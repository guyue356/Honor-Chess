<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold text-white mb-8 text-center">登录</h1>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="text-gray-400 text-sm mb-1 block">用户名</label>
        <input v-model="username" type="text"
          class="w-full bg-[#1a1a2e] border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-yellow-400 focus:outline-none" />
      </div>
      <div>
        <label class="text-gray-400 text-sm mb-1 block">密码</label>
        <input v-model="password" type="password"
          class="w-full bg-[#1a1a2e] border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-yellow-400 focus:outline-none" />
      </div>
      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
      <button type="submit" class="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">
        登录
      </button>
      <p class="text-center text-gray-400 text-sm">
        没有账号？<router-link to="/register" class="text-yellow-400 hover:underline">去注册</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    await auth.login(username.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.error || '登录失败'
  }
}
</script>
