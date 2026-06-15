<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold text-white mb-6">选择英雄</h1>

    <div v-for="cls in classes" :key="cls" class="mb-6">
      <h2 class="text-lg font-semibold mb-3" :class="classColors[cls].text">{{ cls }}</h2>
      <div class="grid grid-cols-8 gap-2">
        <div v-for="hero in getHeroesByClass(cls)" :key="hero.id"
          class="bg-[#1a1a2e] rounded-lg border cursor-pointer transition-all hover:scale-110 hover:z-10 group relative"
          :class="[classColors[cls].border, selected?.id === hero.id ? 'ring-2 ring-yellow-400 border-yellow-400' : 'border-gray-700 hover:border-gray-500']"
          @click="selectHero(hero)">
          <div class="w-full h-16 overflow-hidden rounded-t-lg">
            <img :src="hero.imageUrl" :alt="hero.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div class="px-1 py-1">
            <div class="text-white font-semibold text-[10px] truncate leading-tight">{{ hero.name }}</div>
          </div>

          <!-- Hover detail tooltip -->
          <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 bg-[#0d0d1a] border border-gray-600 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
            <div class="flex items-center gap-2 mb-2">
              <img :src="hero.imageUrl" class="w-10 h-10 rounded border border-gray-600 object-cover" />
              <div>
                <div class="text-white font-bold text-sm">{{ hero.name }}</div>
                <div class="text-gray-400 text-[10px]">{{ hero.title }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-[10px]">
              <div class="text-gray-400">生命值</div><div class="text-green-400 font-bold">{{ hero.hp }}</div>
              <div class="text-gray-400">攻击力</div><div class="text-red-400 font-bold">{{ hero.attack }}</div>
              <div class="text-gray-400">职业</div><div :class="classColors[cls].text">{{ hero.class }}</div>
            </div>
            <div class="border-t border-gray-700 pt-1.5">
              <div class="text-yellow-400 text-[10px] font-bold">{{ hero.skillName }}（{{ hero.skillManaCost }}费）</div>
              <div class="text-gray-400 text-[10px]">{{ hero.skillDesc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom selection bar -->
    <div v-if="selected" class="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-gray-700 p-4 z-50 shadow-2xl">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img :src="selected.imageUrl" class="w-14 h-14 rounded-lg object-cover border border-gray-600" />
          <div>
            <div class="text-white font-bold text-lg">{{ selected.name }} - {{ selected.title }}</div>
            <div class="text-gray-400 text-sm">{{ selected.class }} | HP:{{ selected.hp }} ATK:{{ selected.attack }}</div>
            <div class="text-yellow-400 text-sm">技能：{{ selected.skillName }}（{{ selected.skillManaCost }}费）- {{ selected.skillDesc }}</div>
          </div>
        </div>
        <button @click="startBattle"
          class="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors active:scale-95">
          开始对战
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { CLASS_COLORS, getHeroesByClass } from '../game/heroes'
import type { HeroData } from '../game/types'

const router = useRouter()
const game = useGameStore()
const selected = ref<HeroData | null>(null)
const classes = ['坦克', '战士', '法师', '刺客', '射手', '辅助']
const classColors = CLASS_COLORS

function selectHero(hero: HeroData) {
  selected.value = hero
}

function startBattle() {
  if (!selected.value) return
  game.startGame(selected.value.id)
  router.push('/battle')
}
</script>
