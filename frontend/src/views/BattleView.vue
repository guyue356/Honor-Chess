<template>
  <div v-if="!game.gameState" class="flex items-center justify-center min-h-[80vh]">
    <div class="text-center">
      <p class="text-gray-400 mb-6">选择你的英雄开始对战</p>
      <router-link to="/heroes" class="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400">
        选择英雄
      </router-link>
    </div>
  </div>

  <div v-else class="flex h-[calc(100vh-60px)]">
    <!-- Effects layer -->
    <BattleEffects ref="effectsRef" />

    <!-- Sound toggle - top right -->
    <button @click="toggleBGM"
      class="fixed top-3 right-3 z-50 bg-[#1a1a2e]/90 text-gray-400 px-2.5 py-1.5 rounded-full text-sm border border-gray-700 hover:text-yellow-400 hover:border-yellow-700 transition-colors shadow-lg">
      {{ bgmMuted ? '🔇' : '🔊' }}
    </button>

    <!-- Main battle area -->
    <div class="flex-1 max-w-3xl mx-auto px-4 py-6 flex flex-col">
      <!-- Enemy Area -->
      <div class="bg-[#1a1a2e] rounded-lg p-4 pb-6 mb-4 border border-red-900/50 relative overflow-visible"
        :class="{ 'shake': enemyShaking }">
        <Transition name="damage-overlay">
          <div v-if="enemyDamageFlash" class="absolute inset-0 bg-red-500/20 rounded-lg"></div>
        </Transition>
        <div class="flex items-center gap-4 relative z-10">
          <div class="relative" ref="enemyAvatarRef">
            <img :src="game.gameState.enemy.hero.imageUrl" class="w-14 h-14 rounded-lg object-cover transition-all duration-300"
              :class="{ 'ring-2 ring-red-500': enemyShaking }" />
            <div v-if="game.gameState.enemy.armor > 0"
              class="absolute -bottom-1 -right-1 group/status cursor-help">
              <svg class="w-6 h-6 drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.13 9 11.25C17.25 22.13 21 17.25 21 12V7l-9-5z"
                  fill="rgba(59,130,246,0.85)" stroke="rgba(96,165,250,0.9)" stroke-width="1.5"/>
                <text x="12" y="14.5" text-anchor="middle" fill="white" font-size="9" font-weight="bold">{{ game.gameState.enemy.armor }}</text>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-[#0d0d1a] border border-gray-600 rounded-lg p-2 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                <div class="text-blue-400 text-[10px] font-bold mb-0.5">🛡 护甲</div>
                <div class="text-gray-300 text-[10px] leading-relaxed">受到攻击时，护甲值会抵消等量伤害，护甲耗尽后才会扣减生命值</div>
              </div>
            </div>
            <div v-if="game.gameState.enemy.immuneNextDamage"
              class="absolute -top-1 left-0 group/status cursor-help">
              <svg class="w-5 h-5 drop-shadow-lg animate-pulse" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(34,197,94,0.85)" stroke="rgba(74,222,128,0.9)" stroke-width="1.5"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="11">💨</text>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-[#0d0d1a] border border-gray-600 rounded-lg p-2 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                <div class="text-green-400 text-[10px] font-bold mb-0.5">💨 闪避</div>
                <div class="text-gray-300 text-[10px] leading-relaxed">免疫你下一次造成的伤害</div>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-white font-bold">{{ game.gameState.enemy.hero.name }}</span>
              <span class="text-gray-500 text-xs">{{ game.gameState.enemy.hero.title }}</span>
              <span v-if="game.gameState.enemy.skipNextAttack" class="text-red-400 text-xs animate-pulse">[眩晕]</span>
            </div>
            <HealthBar :current="game.gameState.enemy.hp" :max="game.gameState.enemy.maxHp" color="red" />
            <!-- Mana crystals -->
            <div class="mt-1.5">
              <ManaCrystals
                :current="game.gameState.currentPlayer === 'enemy' ? game.gameState.currentMana : game.gameState.maxMana"
                :max="game.gameState.maxMana" />
            </div>
            <div class="mt-1.5">
              <EquipmentSlots :slots="game.gameState.enemy.equipmentSlots" />
            </div>
          </div>
          <div class="text-right flex flex-col items-end gap-1">
            <span class="text-[10px] text-gray-500">手牌 {{ game.gameState.enemy.hand.length }}</span>
          </div>
        </div>
      </div>

      <!-- Battle Field -->
      <div class="flex-1 flex flex-col relative">
        <!-- Round indicator - top left, small -->
        <div class="absolute top-0 left-0 z-10">
          <span class="bg-[#1a1a2e]/90 text-gray-400 px-3 py-1 rounded-full text-xs border border-gray-700"
            :class="{ 'text-yellow-400 border-yellow-700': game.isPlayerTurn }">
            R{{ game.gameState.turn }}
            <span v-if="game.isPlayerTurn" class="text-yellow-400">●</span>
            <span v-else class="text-red-400">●</span>
          </span>
        </div>

        <!-- Card play animation -->
        <Transition name="card-fly">
          <div v-if="flyingCard" class="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div class="relative">
              <div class="absolute inset-0 rounded-full blur-2xl animate-ping"
                :style="{ backgroundColor: flyingCard.color + '30' }"></div>
              <div class="relative rounded-xl px-8 py-4 text-white font-bold text-xl shadow-2xl border-2"
                :style="{ backgroundColor: flyingCard.color + '20', borderColor: flyingCard.color }">
                <div class="text-4xl mb-1 text-center">{{ flyingCard.icon }}</div>
                <div class="text-center">{{ flyingCard.name }}</div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Player Area -->
      <div class="bg-[#1a1a2e] rounded-lg p-4 pt-6 pb-6 mt-4 border border-blue-900/50 relative overflow-visible"
        :class="{ 'shake': playerShaking }">
        <Transition name="damage-overlay">
          <div v-if="playerDamageFlash" class="absolute inset-0 bg-red-500/20 rounded-lg"></div>
        </Transition>
        <Transition name="damage-overlay">
          <div v-if="playerHealFlash" class="absolute inset-0 bg-green-500/10 rounded-lg"></div>
        </Transition>

        <div class="flex items-center gap-4 mb-3 relative z-10">
          <div class="relative" ref="playerAvatarRef">
            <img :src="game.gameState.player.hero.imageUrl" class="w-14 h-14 rounded-lg object-cover transition-all duration-300"
              :class="{ 'ring-2 ring-blue-500': playerShaking }" />
            <div v-if="game.gameState.player.armor > 0"
              class="absolute -bottom-1 -right-1 group/status cursor-help">
              <svg class="w-6 h-6 drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.13 9 11.25C17.25 22.13 21 17.25 21 12V7l-9-5z"
                  fill="rgba(59,130,246,0.85)" stroke="rgba(96,165,250,0.9)" stroke-width="1.5"/>
                <text x="12" y="14.5" text-anchor="middle" fill="white" font-size="9" font-weight="bold">{{ game.gameState.player.armor }}</text>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-[#0d0d1a] border border-gray-600 rounded-lg p-2 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                <div class="text-blue-400 text-[10px] font-bold mb-0.5">🛡 护甲</div>
                <div class="text-gray-300 text-[10px] leading-relaxed">受到攻击时，护甲值会抵消等量伤害，护甲耗尽后才会扣减生命值</div>
              </div>
            </div>
            <div v-if="game.gameState.player.attackBuff > 0"
              class="absolute -top-1 -right-1 group/status cursor-help">
              <svg class="w-5 h-5 drop-shadow-lg animate-pulse" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(249,115,22,0.85)" stroke="rgba(251,146,60,0.9)" stroke-width="1.5"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">⚔</text>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-[#0d0d1a] border border-gray-600 rounded-lg p-2 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                <div class="text-orange-400 text-[10px] font-bold mb-0.5">⚔ 攻击加成</div>
                <div class="text-gray-300 text-[10px] leading-relaxed">每次攻击额外造成 {{ game.gameState.player.attackBuff }} 点伤害，效果永久持续</div>
              </div>
            </div>
            <div v-if="game.gameState.player.immuneNextDamage"
              class="absolute -top-1 left-0 group/status cursor-help">
              <svg class="w-5 h-5 drop-shadow-lg animate-pulse" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(34,197,94,0.85)" stroke="rgba(74,222,128,0.9)" stroke-width="1.5"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="11">💨</text>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-[#0d0d1a] border border-gray-600 rounded-lg p-2 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                <div class="text-green-400 text-[10px] font-bold mb-0.5">💨 闪避</div>
                <div class="text-gray-300 text-[10px] leading-relaxed">免疫对手下一次造成的伤害，触发后消失</div>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-white font-bold">{{ game.gameState.player.hero.name }}</span>
              <span class="text-gray-500 text-xs">{{ game.gameState.player.hero.title }}</span>
            </div>
            <HealthBar :current="game.gameState.player.hp" :max="game.gameState.player.maxHp" color="blue" />
            <!-- Mana crystals -->
            <div class="mt-1.5">
              <ManaCrystals :current="game.gameState.currentMana" :max="game.gameState.maxMana" />
            </div>
            <div class="mt-1.5">
              <EquipmentSlots :slots="game.gameState.player.equipmentSlots" />
            </div>
          </div>
          <div class="text-right flex flex-col items-end gap-1">
            <button v-if="game.isPlayerTurn && game.isPlaying"
              @click="endTurn"
              class="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-5 py-1.5 rounded-lg text-sm font-bold hover:from-yellow-500 hover:to-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/20">
              结束回合
            </button>
          </div>
        </div>

        <!-- Deck / Discard buttons row -->
        <div class="flex items-center gap-2 mb-2 relative z-10">
          <button class="flex items-center gap-1 bg-gray-800/80 hover:bg-gray-700/80 rounded px-2 py-1 transition-colors text-[10px] text-gray-400 border border-gray-700">
            <span class="w-3 h-3 bg-gray-600 rounded-sm inline-block"></span>
            牌库 {{ game.gameState.player.deck.length }}
          </button>
          <button class="flex items-center gap-1 bg-gray-800/80 hover:bg-gray-700/80 rounded px-2 py-1 transition-colors text-[10px] text-gray-400 border border-gray-700">
            <span class="w-3 h-3 bg-gray-700 rounded-sm inline-block border border-gray-600"></span>
            弃牌 {{ game.gameState.player.discardPile.length }}
          </button>
        </div>

        <!-- Player Hand -->
        <div class="flex gap-2 overflow-x-auto pb-3 pt-1 relative z-10 min-h-[140px]">
          <TransitionGroup name="card">
            <div v-for="(card, index) in game.gameState.player.hand" :key="card.id"
              class="flex-shrink-0 w-28 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:-translate-y-4 hover:shadow-xl active:scale-95 relative group min-h-[130px]"
              :class="[getCardClass(card), { 'opacity-40 cursor-not-allowed': !canAfford(card) }]"
              @click="playCard(index)">
              <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                :class="getCardGlowClass(card)"></div>
              <div class="relative p-3 text-center flex flex-col justify-between h-full">
                <div>
                  <img v-if="card.imageUrl" :src="card.imageUrl" class="w-10 h-10 mx-auto mb-1.5 rounded-lg object-cover" />
                  <div class="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
                    :class="getCostBadgeClass(card)">
                    {{ getEffectiveCost(card) }}
                  </div>
                  <div class="text-white text-xs font-bold mb-1.5 leading-tight mt-1">{{ card.name }}</div>
                  <div class="text-gray-400 text-[10px] leading-relaxed">{{ card.description }}</div>
                </div>
                <div class="text-[9px] uppercase tracking-wider mt-2"
                  :class="getTypeClass(card)">
                  {{ card.type === 'skill' ? '技能' : card.type === 'equipment' ? '装备' : '基础' }}
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Right side battle log panel -->
    <div class="w-12 flex-shrink-0 relative">
      <div v-if="!logExpanded"
        @click="logExpanded = true"
        class="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1a1a2e] border border-gray-700 border-r-0 rounded-l-lg px-2 py-4 cursor-pointer hover:bg-[#252540] transition-colors group">
        <div class="text-gray-400 text-xs group-hover:text-yellow-400 transition-colors select-none"
          style="writing-mode: vertical-rl; text-orientation: mixed;">
          战斗记录
        </div>
        <div v-if="unreadCount > 0"
          class="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </div>
      </div>

      <Transition name="log-panel">
        <div v-if="logExpanded"
          class="absolute right-0 top-0 bottom-0 w-72 bg-[#1a1a2e] border-l border-gray-700 flex flex-col z-30 shadow-2xl">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <span class="text-white font-bold text-sm">战斗记录</span>
            <button @click="logExpanded = false; unreadCount = 0"
              class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div ref="logContainer" class="flex-1 overflow-y-auto p-3 space-y-1">
            <div v-for="(entry, i) in game.gameState.battleLog" :key="i"
              class="text-xs py-1 px-2 rounded transition-colors"
              :class="{
                'text-red-400 bg-red-900/10': entry.type === 'attack',
                'text-green-400 bg-green-900/10': entry.type === 'heal',
                'text-blue-400 bg-blue-900/10': entry.type === 'buff',
                'text-yellow-400 font-bold bg-yellow-900/10': entry.type === 'system',
                'text-gray-500': entry.type === 'info',
              }">
              <span v-if="entry.type === 'attack'" class="mr-1">⚔️</span>
              <span v-else-if="entry.type === 'heal'" class="mr-1">💚</span>
              <span v-else-if="entry.type === 'buff'" class="mr-1">✨</span>
              <span v-else-if="entry.type === 'system'" class="mr-1">📢</span>
              <span class="text-gray-600 mr-1">[{{ entry.turn }}]</span>
              {{ entry.text }}
            </div>
          </div>
          <div class="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
            共 {{ game.gameState.battleLog.length }} 条记录
          </div>
        </div>
      </Transition>
    </div>

    <!-- Game Over Overlay -->
    <Transition name="overlay">
      <div v-if="game.winner" class="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-[#1a1a2e] rounded-2xl p-10 text-center border border-gray-700 shadow-2xl max-w-md">
          <div class="text-7xl mb-4" :class="{ 'animate-bounce': game.winner === 'player' }">
            {{ game.winner === 'player' ? '🏆' : game.winner === 'enemy' ? '💀' : '🤝' }}
          </div>
          <h2 class="text-3xl font-black mb-2"
            :class="game.winner === 'player' ? 'text-yellow-400' : 'text-red-400'">
            {{ game.winner === 'player' ? '胜利！' : game.winner === 'enemy' ? '失败...' : '平局' }}
          </h2>
          <p class="text-gray-400 mb-2">
            {{ game.winner === 'player' ? '你击败了' + game.gameState.enemy.hero.name
              : game.winner === 'enemy' ? '你被' + game.gameState.enemy.hero.name + '击败'
              : '双方同归于尽' }}
          </p>
          <p class="text-gray-500 text-sm mb-4">共 {{ game.gameState.turn }} 回合</p>

          <!-- Rank result -->
          <div v-if="rankResult" class="mb-6 p-4 rounded-xl border"
            :class="rankResult.type === 'win' ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-red-900/20 border-red-700/50'">
            <div class="flex items-center justify-center gap-3 mb-2">
              <span class="text-2xl">{{ rank.currentTier.icon }}</span>
              <div>
                <div class="text-sm font-bold" :style="{ color: rank.currentTier.color }">
                  {{ rank.currentTier.name }} {{ rank.rankState.rank }}
                </div>
                <div class="flex gap-0.5 justify-center mt-0.5">
                  <div v-for="i in rank.starsDisplay.max" :key="i"
                    class="w-2.5 h-2.5 rounded-full"
                    :class="i <= rank.starsDisplay.current ? 'bg-yellow-400 shadow-sm shadow-yellow-400/50' : 'bg-gray-600'" />
                </div>
              </div>
            </div>
            <div class="text-xs" :class="rankResult.type === 'win' ? 'text-yellow-400' : 'text-red-400'">
              <template v-if="rankResult.type === 'win'">
                +{{ rankResult.stars }}⭐
                <span v-if="rankResult.streak >= 3" class="text-orange-400">🔥 {{ rankResult.streak }}连胜</span>
              </template>
              <template v-else>
                -{{ rankResult.stars }}⭐
              </template>
            </div>
          </div>

          <div class="flex gap-4 justify-center">
            <router-link to="/heroes" @click="game.resetGame()"
              class="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-300 transition-all hover:scale-105 shadow-lg shadow-yellow-500/30">
              再来一局
            </router-link>
            <router-link to="/" @click="game.resetGame()"
              class="border border-gray-600 text-gray-300 px-6 py-3 rounded-xl hover:border-yellow-400 hover:text-yellow-400 transition-all">
              返回首页
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'
import type { CardData } from '../game/types'
import { getEffectConfig } from '../game/effects'
import { canPlayCard } from '../game/engine'
import { startBGM, stopBGM, playCardSfx, playTurnSfx, playVictorySfx, playDefeatSfx } from '../game/audio'
import { useRankStore } from '../stores/rank'
import HealthBar from '../components/HealthBar.vue'
import BattleEffects from '../components/BattleEffects.vue'
import EquipmentSlots from '../components/EquipmentSlots.vue'
import ManaCrystals from '../components/ManaCrystals.vue'

const game = useGameStore()
const rank = useRankStore()
const effectsRef = ref<InstanceType<typeof BattleEffects> | null>(null)
const logContainer = ref<HTMLElement | null>(null)
const enemyAvatarRef = ref<HTMLElement | null>(null)
const playerAvatarRef = ref<HTMLElement | null>(null)

const flyingCard = ref<{ name: string; icon: string; color: string } | null>(null)
const enemyShaking = ref(false)
const playerShaking = ref(false)
const enemyDamageFlash = ref(false)
const playerDamageFlash = ref(false)
const playerHealFlash = ref(false)
const logExpanded = ref(false)
const unreadCount = ref(0)
const bgmMuted = ref(false)
const rankResult = ref<{ type: 'win' | 'loss'; stars: number; streak: number } | null>(null)

let lastLogLen = 0
let lastTurn = 0

onMounted(() => {
  if (!bgmMuted.value) startBGM()
})

onUnmounted(() => {
  stopBGM()
})

function toggleBGM() {
  bgmMuted.value = !bgmMuted.value
  if (bgmMuted.value) stopBGM()
  else startBGM()
}

watch(() => game.winner, (w) => {
  if (w) {
    stopBGM()
    if (w === 'player') {
      playVictorySfx()
      const result = rank.onWin()
      rankResult.value = { type: 'win', stars: result.starsGained, streak: result.winStreak }
    } else if (w === 'enemy') {
      playDefeatSfx()
      const result = rank.onLoss()
      rankResult.value = { type: 'loss', stars: result.starsLost, streak: 0 }
    }
  }
})

watch(() => game.gameState?.turn, (t) => {
  if (t && t !== lastTurn) {
    lastTurn = t
    playTurnSfx()
  }
})

watch(() => game.gameState?.battleLog.length, (newLen) => {
  if (!newLen || !game.gameState) return

  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })

  if (!logExpanded.value) {
    unreadCount.value += newLen - lastLogLen
  }

  const logs = game.gameState.battleLog
  for (let i = lastLogLen; i < logs.length; i++) {
    // Only auto-scroll, effects are handled by playCard and playNextEnemyCard
  }
  lastLogLen = logs.length
})

function getAvatarCenter(target: 'player' | 'enemy'): { x: number; y: number } {
  const el = target === 'enemy' ? enemyAvatarRef.value : playerAvatarRef.value
  if (!el) return { x: window.innerWidth / 2, y: target === 'enemy' ? 100 : window.innerHeight - 200 }
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function triggerPlayerAttackEffect() {
  const enemyPos = getAvatarCenter('enemy')
  const playerPos = getAvatarCenter('player')
  effectsRef.value?.showProjectile(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y, '⚔️', '#ef4444')
  setTimeout(() => {
    effectsRef.value?.emitParticles(enemyPos.x, enemyPos.y, '#ef4444', 12)
    effectsRef.value?.flashScreen('#ef4444', 0.1)
  }, 400)
  enemyShaking.value = true
  enemyDamageFlash.value = true
  setTimeout(() => { enemyShaking.value = false; enemyDamageFlash.value = false }, 500)
}

function endTurn() {
  game.endTurn()
  setTimeout(() => {
    const enemyPos = getAvatarCenter('enemy')
    effectsRef.value?.emitDrawParticles(enemyPos.x, enemyPos.y)
  }, 300)
  // Start enemy card animation loop
  setTimeout(() => playNextEnemyCard(), 1200)
}

function playNextEnemyCard() {
  if (!game.isEnemyAnimating) return
  const { playedCard } = game.executeNextEnemyCard()
  if (playedCard) {
    const config = getEffectConfig(playedCard.effect.type)
    const enemyPos = getAvatarCenter('enemy')
    const playerPos = getAvatarCenter('player')
    // Show flying card from enemy side
    flyingCard.value = { name: playedCard.name, icon: config.icon, color: config.color }
    playCardSfx(playedCard.effect.type)
    setTimeout(() => { flyingCard.value = null }, 600)
    // Trigger effects based on card type
    const isAttack = playedCard.effect.type.includes('damage') || playedCard.effect.type === 'stun_damage'
    if (playedCard.effect.type === 'damage_all') {
      setTimeout(() => {
        effectsRef.value?.showProjectile(enemyPos.x, enemyPos.y, playerPos.x, playerPos.y, '🌊', '#f97316')
        setTimeout(() => {
          effectsRef.value?.emitParticles(playerPos.x, playerPos.y, '#f97316', 10)
          playerShaking.value = true
          playerDamageFlash.value = true
          setTimeout(() => { playerShaking.value = false; playerDamageFlash.value = false }, 500)
          effectsRef.value?.emitParticles(enemyPos.x, enemyPos.y, '#f97316', 10)
          enemyShaking.value = true
          enemyDamageFlash.value = true
          setTimeout(() => { enemyShaking.value = false; enemyDamageFlash.value = false }, 500)
        }, 350)
      }, 200)
    } else if (isAttack) {
      setTimeout(() => {
        effectsRef.value?.showProjectile(enemyPos.x, enemyPos.y, playerPos.x, playerPos.y, '⚔️', '#ef4444')
        setTimeout(() => {
          effectsRef.value?.emitParticles(playerPos.x, playerPos.y, '#ef4444', 12)
          effectsRef.value?.flashScreen('#ef4444', 0.1)
          playerShaking.value = true
          playerDamageFlash.value = true
          setTimeout(() => { playerShaking.value = false; playerDamageFlash.value = false }, 500)
        }, 350)
      }, 200)
      if (playedCard.effect.type === 'self_damage_enemy') {
        setTimeout(() => {
          effectsRef.value?.emitParticles(enemyPos.x, enemyPos.y, '#ef4444', 6)
          enemyShaking.value = true
          enemyDamageFlash.value = true
          setTimeout(() => { enemyShaking.value = false; enemyDamageFlash.value = false }, 500)
        }, 600)
      }
    } else if (playedCard.effect.type === 'heal' || playedCard.effect.type === 'armor_heal') {
      setTimeout(() => {
        effectsRef.value?.emitHealParticles(enemyPos.x, enemyPos.y)
      }, 200)
    } else if (playedCard.effect.type === 'armor' || playedCard.effect.type === 'buff' || playedCard.effect.type === 'attack_buff') {
      setTimeout(() => {
        effectsRef.value?.emitShieldParticles(enemyPos.x, enemyPos.y, playedCard.effect.value || 2)
      }, 200)
    } else if (playedCard.effect.type === 'discard' || playedCard.effect.type === 'steal') {
      setTimeout(() => {
        effectsRef.value?.emitParticles(playerPos.x, playerPos.y, '#8b5cf6', 8)
      }, 200)
    } else if (playedCard.effect.type === 'draw') {
      setTimeout(() => {
        effectsRef.value?.emitDrawParticles(enemyPos.x, enemyPos.y)
      }, 200)
    }
    setTimeout(() => playNextEnemyCard(), 2000)
  }
  // If playedCard is null (can't afford), skip and try next card immediately
  if (!playedCard && game.isEnemyAnimating) {
    playNextEnemyCard()
  }
}

function playCard(index: number) {
  if (!game.isPlayerTurn || !game.isPlaying) return
  const state = game.gameState
  if (!state) return
  if (!canPlayCard(state, index)) return
  const card = state.player.hand[index]
  if (card) {
    const config = getEffectConfig(card.effect.type)
    flyingCard.value = { name: card.name, icon: config.icon, color: config.color }
    playCardSfx(card.effect.type)
    setTimeout(() => { flyingCard.value = null }, 700)
    // Trigger visual effects based on card type (player attacking enemy)
    const isAttack = card.effect.type.includes('damage') || card.effect.type === 'stun_damage'
    if (card.effect.type === 'damage_all') {
      // AOE: damage both sides
      setTimeout(() => {
        triggerPlayerAttackEffect()
        setTimeout(() => {
          const playerPos = getAvatarCenter('player')
          effectsRef.value?.emitParticles(playerPos.x, playerPos.y, '#ef4444', 8)
          playerShaking.value = true
          playerDamageFlash.value = true
          setTimeout(() => { playerShaking.value = false; playerDamageFlash.value = false }, 500)
        }, 200)
      }, 200)
    } else if (isAttack) {
      setTimeout(() => {
        triggerPlayerAttackEffect()
      }, 200)
      // Self-damage cards also show damage on player
      if (card.effect.type === 'self_damage_enemy') {
        setTimeout(() => {
          const playerPos = getAvatarCenter('player')
          effectsRef.value?.emitParticles(playerPos.x, playerPos.y, '#ef4444', 6)
          playerShaking.value = true
          playerDamageFlash.value = true
          setTimeout(() => { playerShaking.value = false; playerDamageFlash.value = false }, 500)
        }, 600)
      }
    } else if (card.effect.type === 'heal' || card.effect.type === 'armor_heal') {
      setTimeout(() => {
        const playerPos = getAvatarCenter('player')
        effectsRef.value?.emitHealParticles(playerPos.x, playerPos.y)
        playerHealFlash.value = true
        setTimeout(() => { playerHealFlash.value = false }, 500)
      }, 200)
    } else if (card.effect.type === 'armor' || card.effect.type === 'buff' || card.effect.type === 'attack_buff') {
      setTimeout(() => {
        const playerPos = getAvatarCenter('player')
        effectsRef.value?.emitShieldParticles(playerPos.x, playerPos.y, card.effect.value || 2)
      }, 200)
    } else if (card.effect.type === 'discard' || card.effect.type === 'steal') {
      // Spell targeting enemy
      setTimeout(() => {
        const enemyPos = getAvatarCenter('enemy')
        effectsRef.value?.emitParticles(enemyPos.x, enemyPos.y, '#8b5cf6', 8)
      }, 200)
    } else if (card.effect.type === 'draw') {
      setTimeout(() => {
        const playerPos = getAvatarCenter('player')
        effectsRef.value?.emitDrawParticles(playerPos.x, playerPos.y)
      }, 200)
    }
  }
  game.playPlayerCard(index)
}

function getEffectiveCost(card: CardData): number {
  const player = game.gameState?.player
  if (!player) return card.manaCost
  let cost = card.manaCost
  if (player.reduceCost > 0) cost = Math.max(0, cost - player.reduceCost)
  return cost
}

function canAfford(card: CardData): boolean {
  const state = game.gameState
  if (!state) return false
  return state.currentMana >= getEffectiveCost(card) && state.currentPlayer === 'player' && !game.isEnemyAnimating
}

function getCardClass(card: CardData) {
  if (!canAfford(card)) return 'bg-gray-800 border-gray-700 cursor-not-allowed'
  if (card.type === 'skill') return 'bg-gradient-to-br from-yellow-900/60 via-yellow-950/40 to-yellow-900/60 border-yellow-500/80'
  if (card.type === 'equipment') return 'bg-gradient-to-br from-gray-700/60 via-gray-800/40 to-gray-700/60 border-gray-400/80'
  return 'bg-gradient-to-br from-[#2a2a3e] via-[#252538] to-[#1f1f30] border-gray-600/80'
}

function getCardGlowClass(card: CardData) {
  const config = getEffectConfig(card.effect.type)
  return `bg-[${config.color}]/10`
}

function getCostBadgeClass(card: CardData) {
  if (card.type === 'skill') return 'bg-yellow-500 text-black'
  if (card.type === 'equipment') return 'bg-gray-500 text-white'
  const cost = getEffectiveCost(card)
  if (cost === 0) return 'bg-green-500 text-white'
  if (cost <= 1) return 'bg-blue-500 text-white'
  if (cost <= 2) return 'bg-purple-500 text-white'
  return 'bg-red-500 text-white'
}

function getTypeClass(card: CardData) {
  if (card.type === 'skill') return 'text-yellow-500/60'
  if (card.type === 'equipment') return 'text-gray-400/60'
  return 'text-blue-400/60'
}
</script>

<style scoped>
.card-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.card-leave-active { transition: all 0.3s ease-in; }
.card-enter-from { opacity: 0; transform: translateY(40px) scale(0.6) rotate(5deg); }
.card-leave-to { opacity: 0; transform: translateY(-40px) scale(0.6) rotate(-5deg); }

.card-fly-enter-active { transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
.card-fly-leave-active { transition: all 0.4s ease-in; }
.card-fly-enter-from { opacity: 0; transform: scale(0.2) rotate(-15deg); }
.card-fly-leave-to { opacity: 0; transform: scale(2) translateY(-30px) rotate(10deg); }

.shake { animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

.damage-overlay-enter-active { transition: opacity 0.1s; }
.damage-overlay-leave-active { transition: opacity 0.3s; }
.damage-overlay-enter-from, .damage-overlay-leave-to { opacity: 0; }

.log-panel-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.log-panel-leave-active { transition: all 0.2s ease-in; }
.log-panel-enter-from { transform: translateX(100%); opacity: 0; }
.log-panel-leave-to { transform: translateX(100%); opacity: 0; }

.overlay-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.overlay-leave-active { transition: all 0.3s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>
