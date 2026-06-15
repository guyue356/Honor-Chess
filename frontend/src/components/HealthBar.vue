<template>
  <div class="w-full">
    <div class="flex items-center justify-between text-xs mb-0.5">
      <span class="text-gray-400">HP</span>
      <span class="text-gray-300" :class="{ 'text-red-400': isLow }">{{ current }}/{{ max }}</span>
    </div>
    <div class="h-3 bg-gray-800 rounded-full overflow-hidden relative">
      <div class="h-full rounded-full transition-all duration-500 ease-out absolute inset-0"
        :class="[colorClass, { 'animate-pulse': isLow }]"
        :style="{ width: percentage + '%' }">
      </div>
      <!-- Damage flash overlay -->
      <div v-if="showFlash" class="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  current: number
  max: number
  color?: 'red' | 'blue'
}>()

const showFlash = ref(false)
const percentage = computed(() => Math.max(0, (props.current / props.max) * 100))
const isLow = computed(() => percentage.value < 30)
const colorClass = computed(() => {
  if (props.color === 'red') return 'bg-gradient-to-r from-red-600 to-red-400'
  return 'bg-gradient-to-r from-blue-600 to-blue-400'
})

watch(() => props.current, (newVal, oldVal) => {
  if (oldVal !== undefined && newVal < oldVal) {
    showFlash.value = true
    setTimeout(() => { showFlash.value = false }, 300)
  }
})
</script>
