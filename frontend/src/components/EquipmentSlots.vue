<template>
  <div class="flex items-center gap-2">
    <div v-for="cat in categories" :key="cat.key" class="relative group/equip">
      <!-- Empty slot -->
      <div v-if="!slots[cat.key]"
        class="w-8 h-8 rounded border border-dashed flex items-center justify-center"
        :class="cat.borderClass">
        <span class="text-lg opacity-60">{{ cat.icon }}</span>
      </div>
      <!-- Filled slot -->
      <div v-else class="w-8 h-8 rounded border border-gray-500 cursor-help overflow-hidden bg-gray-800/60 hover:border-yellow-400 transition-colors">
        <img :src="slots[cat.key]!.imageUrl" class="w-full h-full object-cover" v-if="slots[cat.key]!.imageUrl" />
        <div v-else class="w-full h-full flex items-center justify-center text-[10px]">{{ cat.icon }}</div>
      </div>
      <!-- Tooltip -->
      <div v-if="slots[cat.key]"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#0d0d1a] border border-gray-600 rounded-lg p-3 opacity-0 invisible group-hover/equip:opacity-100 group-hover/equip:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
        <div class="flex items-center gap-2 mb-1.5">
          <img :src="slots[cat.key]!.imageUrl" class="w-10 h-10 rounded border border-gray-600" v-if="slots[cat.key]!.imageUrl" />
          <div>
            <div class="text-white font-bold text-xs">{{ slots[cat.key]!.name }}</div>
            <div class="text-yellow-400 text-[10px]">{{ cat.label }}</div>
            <div class="text-gray-400 text-[10px]">{{ slots[cat.key]!.manaCost }}费</div>
          </div>
        </div>
        <div class="text-gray-300 text-[10px] border-t border-gray-700 pt-1.5 mt-1.5 leading-relaxed">{{ slots[cat.key]!.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EquipmentData, EquipCategory } from '../game/types'

const props = defineProps<{
  slots: Record<EquipCategory, EquipmentData | null>
}>()

const categories = [
  { key: 'weapon' as EquipCategory, label: '武器', icon: '⚔', borderClass: 'border-red-500/50 bg-red-900/20' },
  { key: 'armor' as EquipCategory, label: '防具', icon: '🛡', borderClass: 'border-blue-500/50 bg-blue-900/20' },
  { key: 'boots' as EquipCategory, label: '鞋子', icon: '👟', borderClass: 'border-green-500/50 bg-green-900/20' },
]
</script>
