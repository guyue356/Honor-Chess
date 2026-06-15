<template>
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
    :class="[tierBorderClass, tierBgClass]">
    <span class="text-lg">{{ tier.icon }}</span>
    <div class="flex flex-col">
      <span class="text-[10px] font-bold leading-none" :style="{ color: tier.color }">{{ tier.name }} {{ rank }}</span>
      <div class="flex gap-0.5 mt-0.5">
        <div v-for="i in stars.max" :key="i"
          class="w-2 h-2 rounded-full transition-all"
          :class="i <= stars.current ? 'bg-yellow-400 shadow-sm shadow-yellow-400/50' : 'bg-gray-600'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RANK_TIERS } from '../stores/rank'
import type { RankTier } from '../stores/rank'

const props = defineProps<{
  tierIndex: number
  rank: number
  stars: { current: number; max: number }
}>()

const tier = computed(() => RANK_TIERS[props.tierIndex] || RANK_TIERS[0])

const tierBorderClass = computed(() => {
  const classes: Record<number, string> = {
    0: 'border-amber-700/60',
    1: 'border-gray-400/60',
    2: 'border-yellow-500/60',
    3: 'border-cyan-400/60',
    4: 'border-purple-400/60',
    5: 'border-red-500/60',
  }
  return classes[props.tierIndex] || 'border-gray-600'
})

const tierBgClass = computed(() => {
  const classes: Record<number, string> = {
    0: 'bg-amber-950/40',
    1: 'bg-gray-700/40',
    2: 'bg-yellow-900/40',
    3: 'bg-cyan-900/40',
    4: 'bg-purple-900/40',
    5: 'bg-red-900/40',
  }
  return classes[props.tierIndex] || 'bg-gray-800'
})
</script>
