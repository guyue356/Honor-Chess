<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <router-link to="/heroes" class="text-yellow-400 hover:underline text-sm mb-4 inline-block">← 返回英雄列表</router-link>
    <div v-if="hero" class="bg-[#1a1a2e] rounded-lg border border-gray-700 overflow-hidden">
      <div class="flex">
        <div class="w-64 aspect-square">
          <img :src="hero.imageUrl" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 p-6">
          <div class="flex items-center gap-3 mb-4">
            <h1 class="text-2xl font-bold text-white">{{ hero.name }}</h1>
            <span class="text-gray-400">{{ hero.title }}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-[#0d0d1a] rounded-lg p-3">
              <div class="text-gray-400 text-xs">职业</div>
              <div class="text-white font-semibold">{{ hero.class }}</div>
            </div>
            <div class="bg-[#0d0d1a] rounded-lg p-3">
              <div class="text-gray-400 text-xs">血量</div>
              <div class="text-white font-semibold">{{ hero.hp }}</div>
            </div>
            <div class="bg-[#0d0d1a] rounded-lg p-3">
              <div class="text-gray-400 text-xs">攻击力</div>
              <div class="text-white font-semibold">{{ hero.attack }}</div>
            </div>
            <div class="bg-[#0d0d1a] rounded-lg p-3">
              <div class="text-gray-400 text-xs">技能消耗</div>
              <div class="text-white font-semibold">{{ hero.skillManaCost }}费</div>
            </div>
          </div>
          <div class="mb-4">
            <h3 class="text-yellow-400 font-semibold mb-1">{{ hero.skillName }}</h3>
            <p class="text-gray-300 text-sm">{{ hero.skillDesc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getHeroById } from '../game/heroes'

const route = useRoute()
const hero = computed(() => getHeroById(Number(route.params.id)))
</script>
