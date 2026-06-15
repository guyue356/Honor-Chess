<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-2xl font-bold text-white mb-6">个人中心</h1>
    <div class="bg-[#1a1a2e] rounded-lg p-6 border border-gray-700">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-2xl font-bold text-black">
          {{ auth.user?.nickname?.[0] || '?' }}
        </div>
        <div>
          <div class="text-white font-bold text-lg">{{ auth.user?.nickname || '未登录' }}</div>
          <div class="text-gray-400 text-sm">@{{ auth.user?.username || '---' }}</div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="bg-[#0d0d1a] rounded-lg p-4">
          <div class="text-2xl font-bold text-yellow-400">0</div>
          <div class="text-gray-400 text-sm">胜场</div>
        </div>
        <div class="bg-[#0d0d1a] rounded-lg p-4">
          <div class="text-2xl font-bold text-red-400">0</div>
          <div class="text-gray-400 text-sm">败场</div>
        </div>
        <div class="bg-[#0d0d1a] rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-400">0%</div>
          <div class="text-gray-400 text-sm">胜率</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>
