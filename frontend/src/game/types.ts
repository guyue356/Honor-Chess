export interface HeroData {
  id: number
  name: string
  title: string
  class: '坦克' | '战士' | '法师' | '刺客' | '射手' | '辅助'
  hp: number
  attack: number
  skillName: string
  skillDesc: string
  skillManaCost: number
  skillEffect: SkillEffect
  imageUrl: string
}

export type CardType = 'basic' | 'skill' | 'equipment'

export interface CardData {
  id: string
  name: string
  type: CardType
  heroId: number | null
  manaCost: number
  description: string
  effect: SkillEffect
  imageUrl?: string
}

export interface SkillEffect {
  type: string
  value?: number
  repeat?: number
  drawCount?: number
  target?: 'self' | 'enemy' | 'all'
  duration?: number
  condition?: string
}

export type EquipCategory = 'weapon' | 'armor' | 'boots'

export interface EquipmentData {
  id: string
  name: string
  category: EquipCategory
  manaCost: number
  description: string
  effect: SkillEffect
  imageUrl?: string
}

export interface StatusEffect {
  type: string
  value: number
  duration: number
  source: string
}

export interface PlayerState {
  hero: HeroData
  hp: number
  maxHp: number
  armor: number
  attackBuff: number
  hand: CardData[]
  deck: CardData[]
  discardPile: CardData[]
  equipment: EquipmentData | null
  equipmentSlots: Record<EquipCategory, EquipmentData | null>
  statusEffects: StatusEffect[]
  skipNextAttack: boolean
  immuneNextDamage: boolean
  nextAttackBonus: number
  reduceCost: number
}

export interface GameState {
  status: 'idle' | 'selecting' | 'playing' | 'finished'
  currentPlayer: 'player' | 'enemy'
  turn: number
  maxMana: number
  currentMana: number
  player: PlayerState
  enemy: PlayerState
  battleLog: LogEntry[]
  winner: 'player' | 'enemy' | 'draw' | null
}

export interface LogEntry {
  turn: number
  text: string
  type: 'attack' | 'skill' | 'heal' | 'buff' | 'info' | 'system'
}

export interface DeckConfig {
  heroId: number
  cardIds: string[]
}
