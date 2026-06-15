import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'

interface User {
  id: number
  username: string
  nickname: string
  avatar_url: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  const isLoggedIn = computed(() => !!token.value)

  async function register(username: string, password: string, nickname: string) {
    const res = await api.post('/auth/register', { username, password, nickname })
    token.value = res.data.token
    localStorage.setItem('token', res.data.token)
    user.value = res.data.user
  }

  async function login(username: string, password: string) {
    const res = await api.post('/auth/login', { username, password })
    token.value = res.data.token
    localStorage.setItem('token', res.data.token)
    user.value = res.data.user
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await api.get('/auth/me')
      user.value = res.data.user
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, register, login, fetchMe, logout }
})
