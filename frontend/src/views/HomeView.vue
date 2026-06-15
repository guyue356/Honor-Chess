<template>
  <div class="max-w-4xl mx-auto px-6 py-16 text-center">
    <h1 class="text-5xl font-bold text-yellow-400 mb-4">王者荣耀英雄杀</h1>
    <p class="text-gray-400 text-lg mb-8">王者峡谷卡牌对战 × 炉石传说法力值 × 英雄专属技能</p>

    <!-- Rank badge -->
    <div class="flex items-center justify-center gap-6 mb-10">
      <div class="bg-[#1a1a2e] rounded-xl p-4 border border-gray-700 min-w-[200px]">
        <div class="text-gray-500 text-xs mb-2">当前段位</div>
        <div class="flex items-center justify-center gap-2">
          <span class="text-3xl">{{ rank.currentTier.icon }}</span>
          <div>
            <div class="text-lg font-bold" :style="{ color: rank.currentTier.color }">
              {{ rank.currentTier.name }} {{ rank.rankState.rank }}
            </div>
            <div class="flex gap-0.5 justify-center mt-1">
              <div v-for="i in rank.starsDisplay.max" :key="i"
                class="w-3 h-3 rounded-full transition-all"
                :class="i <= rank.starsDisplay.current ? 'bg-yellow-400 shadow-sm shadow-yellow-400/50' : 'bg-gray-600'" />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-[#1a1a2e] rounded-xl p-4 border border-gray-700 min-w-[160px]">
        <div class="text-gray-500 text-xs mb-2">战绩统计</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div class="text-gray-400">胜场</div><div class="text-green-400 font-bold">{{ rank.rankState.totalWins }}</div>
          <div class="text-gray-400">负场</div><div class="text-red-400 font-bold">{{ rank.rankState.totalLosses }}</div>
          <div class="text-gray-400">胜率</div><div class="text-yellow-400 font-bold">{{ rank.winRate }}%</div>
          <div class="text-gray-400">最高连胜</div><div class="text-orange-400 font-bold">{{ rank.rankState.bestStreak }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3 mb-8">
      <div v-for="feature in features" :key="feature.title" class="bg-[#1a1a2e] rounded-lg p-3 border border-gray-700">
        <div class="flex items-center gap-2">
          <span class="text-xl">{{ feature.icon }}</span>
          <div>
            <h3 class="text-white font-semibold text-sm">{{ feature.title }}</h3>
            <p class="text-gray-400 text-[10px]">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-4 justify-center">
      <router-link to="/heroes" class="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors">
        开始对战
      </router-link>
      <router-link to="/cards" class="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-bold text-lg hover:border-yellow-400 hover:text-yellow-400 transition-colors">
        卡牌图鉴
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRankStore } from '../stores/rank'

const rank = useRankStore()

const features = [
  { icon: '⚔️', title: '卡牌对战', desc: '王者峡谷主题卡牌，攻击闪避恢复策略组合' },
  { icon: '💎', title: '法力系统', desc: '炉石传说法力值，每回合递增策略选择' },
  { icon: '🦸', title: '英雄技能', desc: '30位王者英雄，每位拥有独特专属技能卡' },
]
</script>
