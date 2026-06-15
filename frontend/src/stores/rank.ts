import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface RankTier {
  name: string
  color: string
  bg: string
  icon: string
  maxRank: number
  starsPerRank: number
}

export const RANK_TIERS: RankTier[] = [
  { name: '青铜', color: '#cd7f32', bg: 'from-amber-900 to-amber-950', icon: '🥉', maxRank: 5, starsPerRank: 2 },
  { name: '白银', color: '#c0c0c0', bg: 'from-gray-400 to-gray-600', icon: '🥈', maxRank: 5, starsPerRank: 2 },
  { name: '黄金', color: '#ffd700', bg: 'from-yellow-500 to-yellow-700', icon: '🥇', maxRank: 5, starsPerRank: 3 },
  { name: '铂金', color: '#00d4ff', bg: 'from-cyan-400 to-cyan-600', icon: '💠', maxRank: 5, starsPerRank: 3 },
  { name: '钻石', color: '#b9f2ff', bg: 'from-blue-400 to-purple-600', icon: '💎', maxRank: 5, starsPerRank: 4 },
  { name: '王者', color: '#ff4500', bg: 'from-red-500 to-orange-600', icon: '👑', maxRank: 1, starsPerRank: 5 },
]

export interface RankState {
  tierIndex: number
  rank: number
  stars: number
  totalWins: number
  totalLosses: number
  winStreak: number
  bestStreak: number
}

function getDefaultRank(): RankState {
  return {
    tierIndex: 0,
    rank: 5,
    stars: 0,
    totalWins: 0,
    totalLosses: 0,
    winStreak: 0,
    bestStreak: 0,
  }
}

export const useRankStore = defineStore('rank', () => {
  const saved = localStorage.getItem('honor-chess-rank')
  const rankState = ref<RankState>(saved ? JSON.parse(saved) : getDefaultRank())

  const currentTier = computed(() => RANK_TIERS[rankState.value.tierIndex])
  const tierName = computed(() => currentTier.value.name)
  const rankDisplay = computed(() => `${currentTier.value.icon} ${currentTier.value.name} ${rankState.value.rank}`)
  const starsDisplay = computed(() => {
    const max = currentTier.value.starsPerRank
    return { current: rankState.value.stars, max }
  })
  const winRate = computed(() => {
    const total = rankState.value.totalWins + rankState.value.totalLosses
    return total > 0 ? Math.round((rankState.value.totalWins / total) * 100) : 0
  })
  const isLegend = computed(() => rankState.value.tierIndex >= RANK_TIERS.length - 1)

  function save() {
    localStorage.setItem('honor-chess-rank', JSON.stringify(rankState.value))
  }

  function onWin() {
    const s = rankState.value
    s.totalWins++
    s.winStreak++
    if (s.winStreak > s.bestStreak) s.bestStreak = s.winStreak

    // Stars gained: 1 base + bonus for streaks
    let starsGained = 1
    if (s.winStreak >= 3) starsGained = 2
    if (s.winStreak >= 5) starsGained = 3

    s.stars += starsGained

    // Check rank up
    const tier = RANK_TIERS[s.tierIndex]
    while (s.stars >= tier.starsPerRank && !isLegend.value) {
      s.stars -= tier.starsPerRank
      if (s.rank > 1) {
        s.rank--
      } else {
        // Tier up
        if (s.tierIndex < RANK_TIERS.length - 1) {
          s.tierIndex++
          s.rank = RANK_TIERS[s.tierIndex].maxRank
          s.stars = 0
        } else {
          // Legend - keep accumulating
          s.stars = tier.starsPerRank
          break
        }
      }
    }

    save()
    return { starsGained, winStreak: s.winStreak }
  }

  function onLoss() {
    const s = rankState.value
    s.totalLosses++
    s.winStreak = 0

    // Stars lost: 1 base, 2 if on a losing streak (3+ losses)
    let starsLost = 1
    if (s.tierIndex <= 1 && s.totalLosses > s.totalWins) starsLost = 2

    s.stars = Math.max(0, s.stars - starsLost)

    // Check rank down
    const tier = RANK_TIERS[s.tierIndex]
    while (s.stars < 0) {
      if (s.rank < tier.maxRank) {
        s.rank++
        s.stars += tier.starsPerRank
      } else if (s.tierIndex > 0) {
        s.tierIndex--
        s.rank = 1
        s.stars = RANK_TIERS[s.tierIndex].starsPerRank - 1
      } else {
        s.stars = 0
        break
      }
    }

    save()
    return { starsLost }
  }

  function resetRank() {
    rankState.value = getDefaultRank()
    save()
  }

  return {
    rankState,
    currentTier,
    tierName,
    rankDisplay,
    starsDisplay,
    winRate,
    isLegend,
    onWin,
    onLoss,
    resetRank,
  }
})
