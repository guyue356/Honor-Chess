<template>
  <header class="bg-[#1a1a2e] border-b border-gray-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center gap-6">
      <router-link to="/" class="text-xl font-bold text-yellow-400 hover:text-yellow-300">
        王者英雄杀
      </router-link>
      <nav class="flex gap-4 text-sm">
        <router-link to="/heroes" class="text-gray-400 hover:text-white transition-colors">英雄</router-link>
        <router-link to="/battle" class="text-gray-400 hover:text-white transition-colors">对战</router-link>
        <router-link to="/rank" class="text-gray-400 hover:text-white transition-colors">排行榜</router-link>
      </nav>
    </div>
    <div class="flex items-center gap-4">
      <template v-if="auth.isLoggedIn">
        <span class="text-gray-300 text-sm">{{ auth.user?.nickname }}</span>
        <button @click="auth.logout()" class="text-gray-400 hover:text-white text-sm">退出</button>
      </template>
      <template v-else>
        <router-link to="/login" class="text-gray-400 hover:text-white text-sm">登录</router-link>
        <router-link to="/register" class="bg-yellow-500 text-black px-3 py-1 rounded text-sm hover:bg-yellow-400">注册</router-link>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>
