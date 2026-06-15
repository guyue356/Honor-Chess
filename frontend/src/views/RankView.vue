<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-2xl font-bold text-white mb-6">排行榜</h1>
    <div class="bg-[#1a1a2e] rounded-lg border border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-700 text-gray-400 text-sm">
            <th class="text-left px-4 py-3">排名</th>
            <th class="text-left px-4 py-3">玩家</th>
            <th class="text-center px-4 py-3">胜场</th>
            <th class="text-center px-4 py-3">胜率</th>
            <th class="text-center px-4 py-3">总伤害</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, i) in players" :key="i" class="border-b border-gray-800 hover:bg-gray-800/50">
            <td class="px-4 py-3">
              <span class="text-yellow-400 font-bold" v-if="i < 3">{{ ['🥇','🥈','🥉'][i] }}</span>
              <span class="text-gray-400" v-else>{{ i + 1 }}</span>
            </td>
            <td class="px-4 py-3 text-white">{{ player.name }}</td>
            <td class="px-4 py-3 text-center text-gray-300">{{ player.wins }}</td>
            <td class="px-4 py-3 text-center text-green-400">{{ player.winRate }}%</td>
            <td class="px-4 py-3 text-center text-red-400">{{ player.damage }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="players.length === 0" class="p-8 text-center text-gray-500">暂无数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const players = [
  { name: '荣耀王者', wins: 128, winRate: 78, damage: 15600 },
  { name: '峡谷之巅', wins: 96, winRate: 72, damage: 12300 },
  { name: '星耀大神', wins: 85, winRate: 68, damage: 10800 },
  { name: '钻石玩家', wins: 72, winRate: 62, damage: 9200 },
  { name: '黄金勇士', wins: 58, winRate: 55, damage: 7600 },
]
</script>
