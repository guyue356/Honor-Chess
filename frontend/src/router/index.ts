import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  { path: '/heroes', name: 'heroes', component: () => import('../views/HeroesView.vue') },
  { path: '/heroes/:id', name: 'hero-detail', component: () => import('../views/HeroDetailView.vue') },
  { path: '/battle', name: 'battle', component: () => import('../views/BattleView.vue') },
  { path: '/decks', name: 'decks', component: () => import('../views/DecksView.vue') },
  { path: '/rank', name: 'rank', component: () => import('../views/RankView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
  { path: '/cards', name: 'cards', component: () => import('../views/CardsView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
