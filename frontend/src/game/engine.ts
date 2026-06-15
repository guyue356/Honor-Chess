import type { GameState, PlayerState, CardData, HeroData, LogEntry, EquipCategory } from './types'
import { buildDeck, EQUIP_CATEGORY_NAMES } from './cards'

function getEquipCategory(effectType: string): EquipCategory | null {
  const map: Record<string, EquipCategory> = {
    equip_attack: 'weapon', equip_sha_bonus: 'weapon',
    equip_armor: 'armor', equip_regen: 'armor', equip_thorns: 'armor',
    equip_initiative: 'boots',
  }
  return map[effectType] || null
}

function createPlayerState(hero: HeroData): PlayerState {
  const deck = buildDeck(hero.id)
  const hand = deck.splice(0, 5)
  return {
    hero,
    hp: hero.hp,
    maxHp: hero.hp,
    armor: 0,
    attackBuff: 0,
    hand,
    deck,
    discardPile: [],
    equipment: null,
    equipmentSlots: { weapon: null, armor: null, boots: null },
    statusEffects: [],
    skipNextAttack: false,
    immuneNextDamage: false,
    nextAttackBonus: 0,
    reduceCost: 0,
  }
}

export function initGame(playerHero: HeroData, enemyHero: HeroData): GameState {
  return {
    status: 'playing',
    currentPlayer: 'player',
    turn: 1,
    maxMana: 1,
    currentMana: 1,
    player: createPlayerState(playerHero),
    enemy: createPlayerState(enemyHero),
    battleLog: [],
    winner: null,
  }
}

function addLog(state: GameState, text: string, type: LogEntry['type'] = 'info') {
  state.battleLog.push({ turn: state.turn, text, type })
}

function dealDamage(state: GameState, target: 'player' | 'enemy', rawDamage: number, source: string) {
  const t = state[target]
  let damage = rawDamage

  // Check dodge/immunity
  if (t.immuneNextDamage) {
    t.immuneNextDamage = false
    addLog(state, `${t.hero.name}使用了「闪避」，免疫了本次伤害`, 'info')
    return
  }

  // Apply armor reduction
  if (t.armor > 0) {
    const absorbed = Math.min(t.armor, damage)
    t.armor -= absorbed
    damage -= absorbed
    if (absorbed > 0) addLog(state, `${t.hero.name}的护甲吸收了${absorbed}点伤害`, 'info')
  }

  // Apply equipment armor (check all slots)
  const armorSlot = t.equipmentSlots.armor
  if (armorSlot?.effect.type === 'equip_armor') {
    const absorbed = Math.min(armorSlot.effect.value!, damage)
    damage -= absorbed
  }

  if (damage > 0) {
    t.hp = Math.max(0, t.hp - damage)
    addLog(state, `${source}对${t.hero.name}造成了${damage}点伤害`, 'attack')
  }

  // Thorns (check all slots)
  if (damage > 0) {
    const allSlots = Object.values(t.equipmentSlots)
    for (const slot of allSlots) {
      if (slot?.effect.type === 'equip_thorns') {
        const attacker = target === 'enemy' ? 'player' : 'enemy'
        const at = state[attacker]
        const thornsDmg = slot.effect.value!
        at.hp = Math.max(0, at.hp - thornsDmg)
        addLog(state, `${t.hero.name}的${slot.name}反弹了${thornsDmg}点伤害`, 'attack')
      }
    }
  }
}

function reshuffleDeck(state: GameState, side: 'player' | 'enemy') {
  const p = state[side]
  if (p.discardPile.length === 0) return
  p.deck = [...p.discardPile].sort(() => Math.random() - 0.5)
  p.discardPile = []
  addLog(state, `${p.hero.name}的牌库已空，弃牌堆洗入牌库`, 'system')
}

function drawCard(state: GameState, side: 'player' | 'enemy', count: number = 1) {
  const p = state[side]
  for (let i = 0; i < count; i++) {
    if (p.deck.length === 0) {
      reshuffleDeck(state, side)
    }
    if (p.deck.length > 0) {
      const card = p.deck.shift()!
      p.hand.push(card)
    }
  }
}

function discardRandom(state: GameState, side: 'player' | 'enemy', count: number = 1) {
  const p = state[side]
  for (let i = 0; i < count && p.hand.length > 0; i++) {
    const idx = Math.floor(Math.random() * p.hand.length)
    const card = p.hand.splice(idx, 1)[0]
    p.discardPile.push(card)
  }
}

function stealRandom(state: GameState, from: 'player' | 'enemy', to: 'player' | 'enemy') {
  const victim = state[from]
  const thief = state[to]
  if (victim.hand.length > 0) {
    const idx = Math.floor(Math.random() * victim.hand.length)
    const card = victim.hand.splice(idx, 1)[0]
    thief.hand.push(card)
    addLog(state, `${thief.hero.name}偷取了${victim.hero.name}的一张牌`, 'info')
  }
}

function getEffectiveManaCost(card: CardData, player: PlayerState): number {
  let cost = card.manaCost
  if (player.reduceCost > 0) {
    cost = Math.max(0, cost - player.reduceCost)
  }
  return cost
}

export function canPlayCard(state: GameState, cardIndex: number): boolean {
  const card = state.player.hand[cardIndex]
  if (!card) return false
  const cost = getEffectiveManaCost(card, state.player)
  return state.currentMana >= cost
}

function executeCardEffect(state: GameState, card: CardData, side: 'player' | 'enemy') {
  const source = state[side]
  const target = side === 'player' ? 'enemy' : 'player'
  const effect = card.effect

  switch (effect.type) {
    case 'damage': {
      const dmg = effect.value! + source.attackBuff + source.nextAttackBonus
      source.nextAttackBonus = 0
      const weaponSlot = source.equipmentSlots.weapon
      const finalDmg = card.name === '普通攻击' && weaponSlot?.effect.type === 'equip_sha_bonus'
        ? dmg + weaponSlot.effect.value!
        : dmg
      dealDamage(state, target, finalDmg, source.hero.name)
      break
    }
    case 'dodge':
      source.immuneNextDamage = true
      addLog(state, `${source.hero.name}使用了「闪避」，免疫下一次伤害`, 'info')
      break
    case 'heal': {
      const healed = Math.min(effect.value!, source.maxHp - source.hp)
      source.hp += healed
      addLog(state, `${source.hero.name}恢复了${healed}点血量`, 'heal')
      break
    }
    case 'draw':
      drawCard(state, side, effect.value!)
      addLog(state, `${source.hero.name}抽了${effect.value!}张牌`, 'info')
      break
    case 'discard':
      discardRandom(state, target, effect.value!)
      addLog(state, `${source.hero.name}弃掉了对方${effect.value!}张牌`, 'info')
      break
    case 'steal':
      stealRandom(state, target, side)
      break
    case 'damage_all':
      dealDamage(state, 'player', effect.value!, source.hero.name)
      dealDamage(state, 'enemy', effect.value!, source.hero.name)
      break
    case 'buff':
      source.attackBuff += effect.value!
      addLog(state, `${source.hero.name}获得${effect.value!}点攻击加成`, 'buff')
      break
    case 'armor':
      source.armor += effect.value!
      addLog(state, `${source.hero.name}获得了${effect.value!}点护甲`, 'buff')
      break
    case 'attack_buff':
      source.attackBuff += effect.value!
      addLog(state, `${source.hero.name}获得${effect.value!}点攻击加成，持续${effect.duration!}回合`, 'buff')
      break
    case 'next_attack_buff':
      source.nextAttackBonus += effect.value!
      addLog(state, `${source.hero.name}的下次攻击将额外造成${effect.value!}点伤害`, 'buff')
      break
    case 'skip_attack':
      state[target].skipNextAttack = true
      addLog(state, `${state[target].hero.name}将跳过下一次攻击`, 'info')
      break
    case 'stun_damage':
      dealDamage(state, target, effect.value!, source.hero.name)
      state[target].skipNextAttack = true
      addLog(state, `${state[target].hero.name}被眩晕，将跳过下一次攻击`, 'info')
      break
    case 'self_damage_enemy':
      dealDamage(state, target, effect.value!, source.hero.name)
      dealDamage(state, side, 2, '反噬')
      break
    case 'conditional_damage': {
      let dmg = effect.value!
      if (state[target].hp < state[target].maxHp * 0.5) {
        dmg *= 2
        addLog(state, `${source.hero.name}触发斩杀效果！伤害翻倍！`, 'attack')
      }
      dealDamage(state, target, dmg, source.hero.name)
      break
    }
    case 'repeat_damage':
      for (let i = 0; i < effect.repeat!; i++) {
        if (state[target].hp <= 0) break
        dealDamage(state, target, effect.value!, source.hero.name)
      }
      break
    case 'true_damage': {
      const t = state[target]
      const dmg = effect.value!
      t.hp = Math.max(0, t.hp - dmg)
      addLog(state, `${source.hero.name}对${t.hero.name}造成了${dmg}点真实伤害`, 'attack')
      break
    }
    case 'damage_draw':
      dealDamage(state, target, effect.value!, source.hero.name)
      drawCard(state, side, (effect as any).drawCount || 1)
      addLog(state, `${source.hero.name}抽了${(effect as any).drawCount || 1}张牌`, 'info')
      break
    case 'damage_heal':
      dealDamage(state, target, effect.value!, source.hero.name)
      const healAmt = 2
      source.hp = Math.min(source.maxHp, source.hp + healAmt)
      addLog(state, `${source.hero.name}回复了${healAmt}点血量`, 'heal')
      break
    case 'damage_armor':
      dealDamage(state, target, effect.value!, source.hero.name)
      source.armor += 2
      addLog(state, `${source.hero.name}获得了2点护甲`, 'buff')
      break
    case 'damage_immunity':
      dealDamage(state, target, effect.value!, source.hero.name)
      source.immuneNextDamage = true
      addLog(state, `${source.hero.name}免疫下一次伤害`, 'buff')
      break
    case 'damage_dispel':
      dealDamage(state, target, effect.value!, source.hero.name)
      if (state[target].armor > 0) {
        state[target].armor = 0
        addLog(state, `移除了${state[target].hero.name}的所有护甲`, 'info')
      }
      break
    case 'execute_damage': {
      const targetHpRatio = state[target].hp / state[target].maxHp
      if (targetHpRatio < 0.3) {
        dealDamage(state, target, effect.value!, source.hero.name)
        addLog(state, `致命一击！造成${effect.value!}点伤害！`, 'attack')
      } else {
        dealDamage(state, target, 3, source.hero.name)
        addLog(state, `目标血量不足30%，仅造成3点伤害`, 'info')
      }
      break
    }
    case 'armor_heal':
      source.armor += effect.value!
      source.hp = Math.min(source.maxHp, source.hp + 1)
      addLog(state, `${source.hero.name}获得${effect.value!}点护甲并回复1血`, 'buff')
      break
    case 'reduce_cost':
      source.reduceCost += effect.value!
      addLog(state, `${source.hero.name}本回合所有卡牌法力消耗-1`, 'buff')
      break
    case 'equip_attack':
    case 'equip_armor':
    case 'equip_sha_bonus':
    case 'equip_regen':
    case 'equip_thorns':
    case 'equip_initiative': {
      const category = getEquipCategory(effect.type)
      if (category) {
        source.equipmentSlots[category] = {
          id: card.id,
          name: card.name,
          category,
          manaCost: card.manaCost,
          description: card.description,
          effect: effect,
          imageUrl: card.imageUrl,
        }
        // Update legacy equipment for compatibility
        source.equipment = source.equipmentSlots[category]
        addLog(state, `${source.hero.name}装备了「${card.name}」(${EQUIP_CATEGORY_NAMES[category]})`, 'buff')
      }
      break
    }
  }
}

export function playCard(state: GameState, cardIndex: number): GameState {
  const newState = { ...state }
  const card = newState.player.hand[cardIndex]
  if (!card) return newState

  const cost = getEffectiveManaCost(card, newState.player)
  if (newState.currentMana < cost) return newState

  newState.currentMana -= cost
  newState.player.hand.splice(cardIndex, 1)
  newState.player.discardPile.push(card)
  addLog(newState, `${newState.player.hero.name}使用了「${card.name}」`, 'info')
  executeCardEffect(newState, card, 'player')

  // Check win condition immediately after player card
  if (newState.player.hp <= 0 && newState.enemy.hp <= 0) {
    newState.winner = 'draw'
    newState.status = 'finished'
    addLog(newState, '平局！双方同归于尽！', 'system')
  } else if (newState.enemy.hp <= 0) {
    newState.winner = 'player'
    newState.status = 'finished'
    addLog(newState, '你赢了！', 'system')
  } else if (newState.player.hp <= 0) {
    newState.winner = 'enemy'
    newState.status = 'finished'
    addLog(newState, '你输了！', 'system')
  }

  return newState
}

export function endPlayerTurn(state: GameState): GameState {
  const newState = { ...state }

  // Process status effects
  processStatusEffects(newState, 'player')

  // Equipment regen (check all slots)
  for (const slot of Object.values(newState.player.equipmentSlots)) {
    if (slot?.effect.type === 'equip_regen') {
      const heal = slot.effect.value!
      newState.player.hp = Math.min(newState.player.maxHp, newState.player.hp + heal)
      addLog(newState, `${newState.player.hero.name}的${slot.name}回复了${heal}点血`, 'heal')
    }
  }

  // Switch to enemy
  newState.currentPlayer = 'enemy'
  newState.turn++
  return newState
}

function processStatusEffects(state: GameState, side: 'player' | 'enemy') {
  const p = state[side]
  p.statusEffects = p.statusEffects.filter(eff => {
    eff.duration--
    return eff.duration > 0
  })
}

export function executeEnemyTurn(state: GameState): GameState {
  const newState = { ...state }

  // Enemy turn start
  newState.maxMana = Math.min(10, newState.maxMana + 1)
  newState.currentMana = newState.maxMana
  newState.player.reduceCost = 0

  // Draw card
  drawCard(newState, 'enemy', 1)
  addLog(newState, `--- ${newState.enemy.hero.name}的回合 ---`, 'system')

  // Check skip attack
  if (newState.enemy.skipNextAttack) {
    newState.enemy.skipNextAttack = false
    addLog(newState, `${newState.enemy.hero.name}被跳过了攻击`, 'info')
  } else {
    // AI plays cards
    const aiActions = aiTurn(newState)
    for (const action of aiActions) {
      if (action.type === 'play_card') {
        const cardIdx = newState.enemy.hand.findIndex(c => c.id === action.cardId)
        if (cardIdx === -1) continue
        const card = newState.enemy.hand[cardIdx]
        const cost = getEffectiveManaCost(card, newState.enemy)
        if (newState.currentMana >= cost) {
          newState.currentMana -= cost
          newState.enemy.hand.splice(cardIdx, 1)
          newState.enemy.discardPile.push(card)
          addLog(newState, `${newState.enemy.hero.name}使用了「${card.name}」`, 'info')
          executeCardEffect(newState, card, 'enemy')
        }
      }
    }
  }

  // Equipment regen for enemy (check all slots)
  for (const slot of Object.values(newState.enemy.equipmentSlots)) {
    if (slot?.effect.type === 'equip_regen') {
      const heal = slot.effect.value!
      newState.enemy.hp = Math.min(newState.enemy.maxHp, newState.enemy.hp + heal)
    }
  }

  // Process status effects
  processStatusEffects(newState, 'enemy')

  // Check win condition
  if (newState.player.hp <= 0 && newState.enemy.hp <= 0) {
    newState.winner = 'draw'
    newState.status = 'finished'
    addLog(newState, '平局！双方同归于尽！', 'system')
  } else if (newState.player.hp <= 0) {
    newState.winner = 'enemy'
    newState.status = 'finished'
    addLog(newState, '你输了！', 'system')
  } else if (newState.enemy.hp <= 0) {
    newState.winner = 'player'
    newState.status = 'finished'
    addLog(newState, '你赢了！', 'system')
  }

  // Switch back to player
  if (newState.status === 'playing') {
    newState.currentPlayer = 'player'
    newState.maxMana = Math.min(10, newState.maxMana + 1)
    newState.currentMana = newState.maxMana
    drawCard(newState, 'player', 1)
    addLog(newState, `--- 你的回合 ---`, 'system')
  }

  return newState
}

// ── Step-by-step enemy turn (for animation) ──

export interface EnemyTurnPlan {
  actions: AIAction[]
  skipped: boolean
}

export function planEnemyTurn(state: GameState): { state: GameState; plan: EnemyTurnPlan } {
  const newState = { ...state }
  newState.maxMana = Math.min(10, newState.maxMana + 1)
  newState.currentMana = newState.maxMana
  newState.player.reduceCost = 0

  drawCard(newState, 'enemy', 1)
  addLog(newState, `--- ${newState.enemy.hero.name}的回合 ---`, 'system')

  if (newState.enemy.skipNextAttack) {
    newState.enemy.skipNextAttack = false
    addLog(newState, `${newState.enemy.hero.name}被跳过了攻击`, 'info')
    return { state: newState, plan: { actions: [], skipped: true } }
  }

  const actions = aiTurn(newState)
  return { state: newState, plan: { actions, skipped: false } }
}

export function executeOneEnemyCard(state: GameState, action: AIAction): { state: GameState; playedCard: CardData | null } {
  if (action.type !== 'play_card') return { state, playedCard: null }

  const newState = { ...state }
  const cardIdx = newState.enemy.hand.findIndex(c => c.id === action.cardId)
  if (cardIdx === -1) return { state: newState, playedCard: null }
  const card = newState.enemy.hand[cardIdx]

  const cost = getEffectiveManaCost(card, newState.enemy)
  if (newState.currentMana < cost) return { state: newState, playedCard: null }

  newState.currentMana -= cost
  newState.enemy.hand.splice(cardIdx, 1)
  newState.enemy.discardPile.push(card)
  addLog(newState, `${newState.enemy.hero.name}使用了「${card.name}」`, 'info')
  executeCardEffect(newState, card, 'enemy')

  // Check win condition mid-turn
  if (newState.player.hp <= 0 && newState.enemy.hp <= 0) {
    newState.winner = 'draw'
    newState.status = 'finished'
    addLog(newState, '平局！双方同归于尽！', 'system')
  } else if (newState.enemy.hp <= 0) {
    newState.winner = 'player'
    newState.status = 'finished'
    addLog(newState, '你赢了！', 'system')
  } else if (newState.player.hp <= 0) {
    newState.winner = 'enemy'
    newState.status = 'finished'
    addLog(newState, '你输了！', 'system')
  }

  return { state: newState, playedCard: card }
}

export function finishEnemyTurn(state: GameState): GameState {
  const newState = { ...state }

  for (const slot of Object.values(newState.enemy.equipmentSlots)) {
    if (slot?.effect.type === 'equip_regen') {
      const heal = slot.effect.value!
      newState.enemy.hp = Math.min(newState.enemy.maxHp, newState.enemy.hp + heal)
    }
  }

  processStatusEffects(newState, 'enemy')

  if (newState.player.hp <= 0 && newState.enemy.hp <= 0) {
    newState.winner = 'draw'
    newState.status = 'finished'
    addLog(newState, '平局！双方同归于尽！', 'system')
  } else if (newState.player.hp <= 0) {
    newState.winner = 'enemy'
    newState.status = 'finished'
    addLog(newState, '你输了！', 'system')
  } else if (newState.enemy.hp <= 0) {
    newState.winner = 'player'
    newState.status = 'finished'
    addLog(newState, '你赢了！', 'system')
  }

  if (newState.status === 'playing') {
    newState.currentPlayer = 'player'
    newState.maxMana = Math.min(10, newState.maxMana + 1)
    newState.currentMana = newState.maxMana
    drawCard(newState, 'player', 1)
    // Boots of speed: draw 1 extra card
    if (newState.player.equipmentSlots.boots?.effect.type === 'equip_initiative') {
      drawCard(newState, 'player', 1)
      addLog(newState, `疾步之靴效果：额外抽1张牌`, 'info')
    }
    addLog(newState, `--- 你的回合 ---`, 'system')
  }

  return newState
}

export interface AIAction {
  type: 'play_card'
  cardId: string
}

function aiTurn(state: GameState): AIAction[] {
  const actions: AIAction[] = []
  const enemy = state.enemy
  let manaLeft = state.currentMana

  // Sort hand by priority: heal < damage < utility
  const sortedCards = enemy.hand
    .map((card) => ({ card }))
    .sort((a, b) => {
      const priorityA = getCardPriority(a.card, enemy.hp / enemy.maxHp)
      const priorityB = getCardPriority(b.card, enemy.hp / enemy.maxHp)
      return priorityB - priorityA
    })

  for (const { card } of sortedCards) {
    const cost = getEffectiveManaCost(card, enemy)
    if (cost <= manaLeft) {
      actions.push({ type: 'play_card', cardId: card.id })
      manaLeft -= cost
    }
  }

  return actions
}

function getCardPriority(card: CardData, hpRatio: number): number {
  if (hpRatio < 0.3) {
    if (card.effect.type === 'heal') return 100
  }
  if (card.type === 'skill') return 80
  if (card.effect.type === 'damage') return 60
  if (card.effect.type === 'heal') return 50
  if (card.type === 'equipment') return 30
  return 20
}
