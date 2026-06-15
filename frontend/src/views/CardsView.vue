<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold text-white mb-2">卡牌图鉴</h1>
    <p class="text-gray-500 text-sm mb-6">共 {{ totalCards }} 张卡牌</p>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button v-for="tab in tabs" :key="tab.key"
        class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
        :class="activeTab === tab.key ? 'bg-yellow-500 text-black' : 'bg-[#1a1a2e] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500'"
        @click="activeTab = tab.key">
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Basic cards -->
    <div v-if="activeTab === 'basic'" class="space-y-8">
      <div v-for="group in basicGroups" :key="group.name">
        <h2 class="text-lg font-semibold mb-3" :class="group.color">{{ group.name }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div v-for="card in group.cards" :key="card.id"
            class="bg-[#1a1a2e] rounded-xl border border-gray-700 p-3 hover:border-yellow-500/50 transition-all hover:scale-105 cursor-pointer group"
            @click="showDetail(card)">
            <div class="flex items-center justify-between mb-2">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                :class="getCostBadgeClass(card.manaCost)">
                {{ card.manaCost }}
              </div>
              <span class="text-lg">{{ getEffectConfig(card.effect.type).icon }}</span>
            </div>
            <div class="text-white font-bold text-sm mb-1">{{ card.name }}</div>
            <div class="text-gray-400 text-[10px] leading-relaxed mb-2">{{ card.description }}</div>
            <div class="text-[9px] uppercase tracking-wider" :class="getTypeClass(card)">
              基础卡 · {{ card.quantity }}张
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Equipment cards -->
    <div v-if="activeTab === 'equip'" class="space-y-8">
      <div v-for="group in equipGroups" :key="group.name">
        <h2 class="text-lg font-semibold mb-3" :class="group.color">{{ group.name }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div v-for="card in group.cards" :key="card.id"
            class="bg-[#1a1a2e] rounded-xl border border-gray-500 p-3 hover:border-yellow-500/50 transition-all hover:scale-105 cursor-pointer"
            @click="showEquipDetail(card)">
            <div class="flex items-center justify-between mb-2">
              <div class="w-7 h-7 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs font-black">
                {{ card.manaCost }}
              </div>
              <span class="text-lg">{{ getEffectConfig(card.effect.type).icon }}</span>
            </div>
            <div class="text-white font-bold text-sm mb-1">{{ card.name }}</div>
            <div class="text-gray-400 text-[10px] leading-relaxed mb-2">{{ card.description }}</div>
            <div class="text-[9px] uppercase tracking-wider text-gray-400/60">
              {{ EQUIP_CATEGORY_NAMES[card.category] }}装备
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skill cards -->
    <div v-if="activeTab === 'skill'" class="space-y-8">
      <div v-for="group in skillGroups" :key="group.name">
        <h2 class="text-lg font-semibold mb-3" :class="group.color">{{ group.name }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div v-for="card in group.cards" :key="card.id"
            class="bg-gradient-to-br from-yellow-900/30 via-yellow-950/20 to-yellow-900/30 rounded-xl border border-yellow-500/50 p-3 hover:border-yellow-400 transition-all hover:scale-105 cursor-pointer"
            @click="showSkillDetail(card)">
            <div class="flex items-center justify-between mb-2">
              <div class="w-7 h-7 rounded-full bg-yellow-500 text-black flex items-center justify-center text-xs font-black">
                {{ card.manaCost }}
              </div>
              <span class="text-lg">{{ getEffectConfig(card.effect.type).icon }}</span>
            </div>
            <div class="text-yellow-400 font-bold text-sm mb-1">{{ card.name }}</div>
            <div class="text-gray-400 text-[10px] leading-relaxed mb-2">{{ card.description }}</div>
            <div class="text-[9px] text-yellow-500/60">{{ getHeroName(card.heroId) }} 专属技能</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail modal -->
    <Transition name="overlay">
      <div v-if="detailCard" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="detailCard = null">
        <div class="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-700 shadow-2xl max-w-md w-full">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              :class="(detailCard as any).type === 'skill' ? 'bg-yellow-900/50 border border-yellow-500' : (detailCard as any).type === 'equipment' ? 'bg-gray-700/50 border border-gray-500' : 'bg-[#252538] border border-gray-600'">
              {{ getEffectConfig(detailCard.effect.type).icon }}
            </div>
            <div>
              <div class="text-white font-bold text-xl">{{ detailCard.name }}</div>
              <div class="text-gray-400 text-sm">
                {{ (detailCard as any).type === 'skill' ? '英雄专属技能卡' : (detailCard as any).type === 'equipment' ? EQUIP_CATEGORY_NAMES[(detailCard as any).category as keyof typeof EQUIP_CATEGORY_NAMES || 'weapon'] + '装备' : '基础卡牌' }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-[#0d0d1a] rounded-lg p-3">
              <div class="text-gray-500 text-xs mb-1">法力消耗</div>
              <div class="text-white font-bold text-lg">{{ detailCard.manaCost }}</div>
            </div>
            <div class="bg-[#0d0d1a] rounded-lg p-3">
              <div class="text-gray-500 text-xs mb-1">效果类型</div>
              <div class="font-bold text-lg" :class="getTypeColor(detailCard.effect.type)">{{ getEffectName(detailCard.effect.type) }}</div>
            </div>
          </div>

          <div class="bg-[#0d0d1a] rounded-lg p-4 mb-4">
            <div class="text-gray-500 text-xs mb-2">卡牌效果</div>
            <div class="text-gray-300 text-sm leading-relaxed">{{ detailCard.description }}</div>
            <div class="text-gray-500 text-xs mt-2">{{ getEffectDetail(detailCard.effect) }}</div>
          </div>

          <div v-if="(detailCard as any).heroId" class="bg-[#0d0d1a] rounded-lg p-3 mb-4">
            <div class="text-gray-500 text-xs mb-1">所属英雄</div>
            <div class="flex items-center gap-2">
              <img :src="getHeroImage((detailCard as any).heroId)" class="w-8 h-8 rounded object-cover" />
              <span class="text-yellow-400 font-bold">{{ getHeroName((detailCard as any).heroId) }}</span>
            </div>
          </div>

          <button @click="detailCard = null"
            class="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
            关闭
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BASIC_CARDS, EQUIPMENT_CARDS, SKILL_CARDS, EQUIP_CATEGORY_NAMES } from '../game/cards'
import { getEffectConfig } from '../game/effects'
import { DEMO_HEROES } from '../game/heroes'
import type { CardData, EquipmentData } from '../game/types'

const activeTab = ref<'basic' | 'equip' | 'skill'>('basic')
const detailCard = ref<CardData | EquipmentData | null>(null)

const tabs = computed(() => [
  { key: 'basic' as const, label: '基础卡牌', count: BASIC_CARDS.length },
  { key: 'equip' as const, label: '装备卡', count: EQUIPMENT_CARDS.length },
  { key: 'skill' as const, label: '英雄技能卡', count: Object.keys(SKILL_CARDS).length },
])

const totalCards = computed(() => BASIC_CARDS.length + EQUIPMENT_CARDS.length + Object.keys(SKILL_CARDS).length)

// Deduplicate basic cards by name and count duplicates
const basicGroups = computed(() => {
  const groups: Record<string, { name: string; color: string; cards: (CardData & { quantity: number })[] }> = {
    attack: { name: '⚔️ 攻击类', color: 'text-red-400', cards: [] },
    defense: { name: '🛡️ 防御类', color: 'text-blue-400', cards: [] },
    heal: { name: '💚 恢复类', color: 'text-green-400', cards: [] },
    spell: { name: '✨ 法术类', color: 'text-purple-400', cards: [] },
    aoe: { name: '🌊 AOE类', color: 'text-orange-400', cards: [] },
    buff: { name: '🔥 增益类', color: 'text-yellow-400', cards: [] },
  }

  const seen = new Map<string, CardData & { quantity: number }>()
  for (const card of BASIC_CARDS) {
    if (seen.has(card.name)) {
      seen.get(card.name)!.quantity++
    } else {
      const entry = { ...card, quantity: 1 }
      seen.set(card.name, entry)
    }
  }

  for (const card of seen.values()) {
    if (card.effect.type === 'damage') groups.attack.cards.push(card)
    else if (card.effect.type === 'dodge' || card.effect.type === 'armor') groups.defense.cards.push(card)
    else if (card.effect.type === 'heal') groups.heal.cards.push(card)
    else if (card.effect.type === 'draw' || card.effect.type === 'discard' || card.effect.type === 'steal') groups.spell.cards.push(card)
    else if (card.effect.type === 'damage_all') groups.aoe.cards.push(card)
    else if (card.effect.type === 'buff') groups.buff.cards.push(card)
  }

  return Object.values(groups).filter(g => g.cards.length > 0)
})

const equipGroups = computed(() => {
  const groups: Record<string, { name: string; color: string; cards: EquipmentData[] }> = {
    weapon: { name: '⚔️ 武器', color: 'text-red-400', cards: [] },
    armor: { name: '🛡️ 防具', color: 'text-blue-400', cards: [] },
    boots: { name: '👟 鞋子', color: 'text-green-400', cards: [] },
  }
  for (const card of EQUIPMENT_CARDS) {
    groups[card.category].cards.push(card)
  }
  return Object.values(groups)
})

const skillGroups = computed(() => {
  const groups: Record<string, { name: string; color: string; cards: CardData[] }> = {
    '坦克': { name: '🛡️ 坦克', color: 'text-blue-400', cards: [] },
    '战士': { name: '⚔️ 战士', color: 'text-orange-400', cards: [] },
    '法师': { name: '🔮 法师', color: 'text-purple-400', cards: [] },
    '刺客': { name: '🗡️ 刺客', color: 'text-red-400', cards: [] },
    '射手': { name: '🏹 射手', color: 'text-green-400', cards: [] },
    '辅助': { name: '💚 辅助', color: 'text-yellow-400', cards: [] },
  }
  for (const card of Object.values(SKILL_CARDS)) {
    const hero = DEMO_HEROES.find(h => h.id === card.heroId)
    if (hero) {
      groups[hero.class].cards.push(card)
    }
  }
  return Object.values(groups).filter(g => g.cards.length > 0)
})

function getHeroName(heroId: number | null): string {
  return DEMO_HEROES.find(h => h.id === heroId)?.name || ''
}

function getHeroImage(heroId: number | null): string {
  return DEMO_HEROES.find(h => h.id === heroId)?.imageUrl || ''
}

function getCostBadgeClass(cost: number) {
  if (cost === 0) return 'bg-green-500 text-white'
  if (cost <= 1) return 'bg-blue-500 text-white'
  if (cost <= 2) return 'bg-purple-500 text-white'
  return 'bg-red-500 text-white'
}

function getTypeClass(card: CardData) {
  if (card.effect.type === 'damage') return 'text-red-400/60'
  if (card.effect.type === 'dodge' || card.effect.type === 'armor') return 'text-blue-400/60'
  if (card.effect.type === 'heal') return 'text-green-400/60'
  if (card.effect.type === 'draw' || card.effect.type === 'discard' || card.effect.type === 'steal') return 'text-purple-400/60'
  if (card.effect.type === 'damage_all') return 'text-orange-400/60'
  if (card.effect.type === 'buff') return 'text-yellow-400/60'
  return 'text-gray-400/60'
}

function getEffectName(type: string) {
  const names: Record<string, string> = {
    damage: '伤害', true_damage: '真实伤害', repeat_damage: '多段伤害',
    conditional_damage: '条件伤害', execute_damage: '斩杀', self_damage_enemy: '自损攻击',
    damage_all: '群体伤害', damage_draw: '伤害+抽牌', damage_heal: '伤害+回复',
    damage_armor: '伤害+护甲', damage_immunity: '伤害+免疫', damage_dispel: '伤害+驱散',
    dodge: '闪避', armor: '护甲', armor_heal: '护甲+回复', heal: '治疗',
    draw: '抽牌', discard: '弃牌', steal: '偷牌',
    buff: '攻击加成', attack_buff: '持续攻击加成', next_attack_buff: '下次攻击加成', reduce_cost: '减费',
    skip_attack: '跳过攻击', stun_damage: '眩晕+伤害',
  }
  return names[type] || type
}

function getTypeColor(type: string) {
  if (type.includes('damage')) return 'text-red-400'
  if (type === 'heal' || type === 'armor_heal') return 'text-green-400'
  if (type === 'armor' || type === 'dodge') return 'text-blue-400'
  if (type === 'draw' || type === 'discard' || type === 'steal') return 'text-purple-400'
  if (type.includes('buff')) return 'text-yellow-400'
  return 'text-gray-400'
}

function getEffectDetail(effect: { type: string; value?: number; repeat?: number; duration?: number; drawCount?: number }) {
  const parts: string[] = []
  if (effect.value) parts.push(`数值: ${effect.value}`)
  if (effect.repeat) parts.push(`重复: ${effect.repeat}次`)
  if (effect.duration) parts.push(`持续: ${effect.duration}回合`)
  if (effect.drawCount) parts.push(`抽牌: ${effect.drawCount}张`)
  return parts.join(' · ')
}

function showDetail(card: CardData) {
  detailCard.value = card
}

function showEquipDetail(card: EquipmentData) {
  detailCard.value = card as any
}

function showSkillDetail(card: CardData) {
  detailCard.value = card
}
</script>

<style scoped>
.overlay-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.overlay-leave-active { transition: all 0.2s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>
