<template>
  <div class="w-24">
    <div class="flex items-center justify-between text-xs mb-0.5">
      <span class="text-gray-400">MP</span>
      <span class="text-blue-400">{{ current }}/{{ max }}</span>
    </div>
    <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
      <div class="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300 ease-out"
        :style="{ width: percentage + '%' }">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  max: number
}>()

const percentage = computed(() => Math.max(0, (props.current / props.max) * 100))
</script>
