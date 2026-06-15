import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState } from '../game/types'
import { initGame, playCard, endPlayerTurn, canPlayCard, planEnemyTurn, executeOneEnemyCard, finishEnemyTurn } from '../game/engine'
import { DEMO_HEROES } from '../game/heroes'

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState | null>(null)
  const isPlayerTurn = computed(() => gameState.value?.currentPlayer === 'player')
  const isPlaying = computed(() => gameState.value?.status === 'playing')
  const winner = computed(() => gameState.value?.winner)
  const isEnemyAnimating = ref(false)
  const enemyCardQueue = ref<AIAction[]>([])

  function startGame(playerHeroId: number) {
    const playerHero = DEMO_HEROES.find(h => h.id === playerHeroId)!
    const availableHeroes = DEMO_HEROES.filter(h => h.id !== playerHeroId)
    const enemyHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)]
    gameState.value = initGame(playerHero, enemyHero)
  }

  function playPlayerCard(cardIndex: number) {
    if (!gameState.value || !isPlayerTurn.value || isEnemyAnimating.value) return
    if (!canPlayCard(gameState.value, cardIndex)) return
    gameState.value = playCard(gameState.value, cardIndex)
  }

  function endTurn() {
    if (!gameState.value || !isPlayerTurn.value || isEnemyAnimating.value) return
    gameState.value = endPlayerTurn(gameState.value)
    if (gameState.value.status === 'playing') {
      const { state, plan } = planEnemyTurn(gameState.value)
      gameState.value = state
      enemyCardQueue.value = [...plan.actions]
      if (plan.actions.length === 0) {
        finishEnemyTurnAsync()
      } else {
        isEnemyAnimating.value = true
      }
    }
  }

  function executeNextEnemyCard(): { playedCard: import('../game/types').CardData | null } {
    if (enemyCardQueue.value.length === 0) {
      finishEnemyTurnAsync()
      return { playedCard: null }
    }
    const action = enemyCardQueue.value.shift()!
    const { state, playedCard } = executeOneEnemyCard(gameState.value!, action)
    gameState.value = state
    // Stop if game is over
    if (state.status !== 'playing') {
      isEnemyAnimating.value = false
      enemyCardQueue.value = []
      return { playedCard }
    }
    if (enemyCardQueue.value.length === 0) {
      finishEnemyTurnAsync()
    }
    return { playedCard }
  }

  function finishEnemyTurnAsync() {
    if (!gameState.value) return
    gameState.value = finishEnemyTurn(gameState.value)
    isEnemyAnimating.value = false
    enemyCardQueue.value = []
  }

  function resetGame() {
    gameState.value = null
    isEnemyAnimating.value = false
    enemyCardQueue.value = []
  }

  return {
    gameState,
    isPlayerTurn,
    isPlaying,
    winner,
    isEnemyAnimating,
    startGame,
    playPlayerCard,
    endTurn,
    executeNextEnemyCard,
    resetGame,
  }
})
