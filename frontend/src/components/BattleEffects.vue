<template>
  <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    <!-- Particle effects -->
    <div v-for="p in particles" :key="p.id"
      class="absolute rounded-full"
      :style="{
        left: p.x + 'px',
        top: p.y + 'px',
        width: p.size + 'px',
        height: p.size + 'px',
        backgroundColor: p.color,
        boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}40`,
        transform: `translate(${p.dx}px, ${p.dy}px) scale(${p.scale || 1})`,
        opacity: p.opacity ?? 1,
        transition: `all ${p.dur || 0.6}s ${p.ease || 'ease-out'}`,
      }">
    </div>

    <!-- Shockwave ring -->
    <Transition name="shockwave">
      <div v-if="shockwave" class="absolute rounded-full border-2"
        :style="{
          left: shockwave.x - shockwave.size / 2 + 'px',
          top: shockwave.y - shockwave.size / 2 + 'px',
          width: shockwave.size + 'px',
          height: shockwave.size + 'px',
          borderColor: shockwave.color,
          boxShadow: `0 0 20px ${shockwave.color}60, inset 0 0 20px ${shockwave.color}20`,
        }">
      </div>
    </Transition>

    <!-- Shield effect overlay -->
    <Transition name="shield-pop">
      <div v-if="shieldEffect" class="absolute z-40 flex items-center justify-center"
        :style="{ left: shieldEffect.x - 55 + 'px', top: shieldEffect.y - 55 + 'px', width: '110px', height: '110px' }">
        <div class="relative w-full h-full">
          <svg viewBox="0 0 100 100" class="w-full h-full" style="filter: drop-shadow(0 0 16px rgba(59,130,246,0.8));">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#2563eb" stop-opacity="0.1"/>
              </linearGradient>
            </defs>
            <polygon points="50,5 90,25 90,65 50,95 10,65 10,25"
              fill="url(#shieldGrad)" stroke="rgba(96,165,250,0.8)" stroke-width="2.5"
              class="shield-hex" />
            <polygon points="50,15 80,30 80,60 50,85 20,60 20,30"
              fill="none" stroke="rgba(147,197,253,0.5)" stroke-width="1"
              class="shield-hex-inner" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center text-blue-300 text-xl font-black"
            style="text-shadow: 0 0 12px rgba(59,130,246,0.9), 0 0 24px rgba(59,130,246,0.4);">
            +{{ shieldEffect.value }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating damage/heal text -->
    <TransitionGroup name="float-text">
      <div v-for="ft in floatingTexts" :key="ft.id"
        class="absolute font-black text-2xl pointer-events-none z-50"
        :style="{
          left: ft.x + 'px',
          top: ft.y + 'px',
          color: ft.color,
          textShadow: `0 0 10px ${ft.color}, 0 0 20px ${ft.color}80`,
          transform: `translate(-50%, -50%) translateY(${ft.dy}px) scale(${ft.scale})`,
          opacity: ft.opacity,
          transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        }">
        {{ ft.text }}
      </div>
    </TransitionGroup>

    <!-- Attack projectile -->
    <div v-if="projectile" class="absolute z-50"
      :style="{ left: projectile.x + 'px', top: projectile.y + 'px' }">
      <div class="text-4xl" :style="{ filter: `drop-shadow(0 0 14px ${projectile.color}) drop-shadow(0 0 28px ${projectile.color}80)` }">
        {{ projectile.icon }}
      </div>
      <!-- Trail -->
      <div class="absolute -z-10 w-6 h-6 rounded-full blur-md"
        :style="{ backgroundColor: projectile.color + '60', left: '-8px', top: '8px' }">
      </div>
    </div>

    <!-- Screen flash overlay -->
    <Transition name="screen-flash">
      <div v-if="screenEffect" class="absolute inset-0"
        :style="{ backgroundColor: screenEffect.color, opacity: screenEffect.opacity }">
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  dx: number
  dy: number
  scale?: number
  opacity?: number
  dur?: number
  ease?: string
}

interface Projectile {
  x: number
  y: number
  icon: string
  color: string
}

interface ScreenEffect {
  color: string
  opacity: number
}

interface Shockwave {
  x: number
  y: number
  size: number
  color: string
}

interface FloatingText {
  id: number
  x: number
  y: number
  text: string
  color: string
  dy: number
  scale: number
  opacity: number
}

const particles = ref<Particle[]>([])
const projectile = ref<Projectile | null>(null)
const screenEffect = ref<ScreenEffect | null>(null)
const shieldEffect = ref<{ x: number; y: number; value: number } | null>(null)
const shockwave = ref<Shockwave | null>(null)
const floatingTexts = ref<FloatingText[]>([])
let particleId = 0

function emitParticles(x: number, y: number, color: string, count: number = 8) {
  // Impact shockwave
  shockwave.value = { x, y, size: 20, color }
  setTimeout(() => {
    if (shockwave.value && shockwave.value.x === x) shockwave.value = { ...shockwave.value, size: 80 }
  }, 30)
  setTimeout(() => { if (shockwave.value && shockwave.value.x === x) shockwave.value = null }, 400)

  for (let i = 0; i < count; i++) {
    const id = particleId++
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const distance = 20 + Math.random() * 50
    const size = 3 + Math.random() * 5
    const dur = 0.4 + Math.random() * 0.3
    particles.value.push({
      id, x, y, size, color,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance - 15,
      scale: 1.5,
      opacity: 1,
      dur,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    })
    // Shrink and fade
    setTimeout(() => {
      const p = particles.value.find(p => p.id === id)
      if (p) { p.scale = 0; p.opacity = 0 }
    }, dur * 1000)
    setTimeout(() => {
      particles.value = particles.value.filter(p => p.id !== id)
    }, dur * 1000 + 200)
  }
}

function emitHealParticles(x: number, y: number) {
  // Floating heal text
  const ftId = particleId++
  floatingTexts.value.push({
    id: ftId, x, y: y - 20,
    text: '+' + Math.floor(2 + Math.random() * 4),
    color: '#4ade80', dy: -50, scale: 0.5, opacity: 1,
  })
  setTimeout(() => {
    const ft = floatingTexts.value.find(f => f.id === ftId)
    if (ft) { ft.dy = -70; ft.scale = 1.1; ft.opacity = 0 }
  }, 50)
  setTimeout(() => { floatingTexts.value = floatingTexts.value.filter(f => f.id !== ftId) }, 900)

  for (let i = 0; i < 10; i++) {
    const id = particleId++
    particles.value.push({
      id,
      x: x + (Math.random() - 0.5) * 30,
      y: y + Math.random() * 10,
      size: 3 + Math.random() * 4,
      color: `hsl(${120 + Math.random() * 40}, 80%, ${55 + Math.random() * 20}%)`,
      dx: (Math.random() - 0.5) * 25,
      dy: -(15 + Math.random() * 35),
      scale: 1.2,
      opacity: 1,
      dur: 0.6 + Math.random() * 0.3,
    })
    const dur = 600 + Math.random() * 300
    setTimeout(() => {
      const p = particles.value.find(p => p.id === id)
      if (p) { p.scale = 0.3; p.opacity = 0 }
    }, dur - 200)
    setTimeout(() => { particles.value = particles.value.filter(p => p.id !== id) }, dur)
  }
}

function emitShieldParticles(x: number, y: number, armorValue: number = 2) {
  shieldEffect.value = { x, y, value: armorValue }
  setTimeout(() => { shieldEffect.value = null }, 1100)

  // Inward converging ring
  for (let i = 0; i < 14; i++) {
    const id = particleId++
    const angle = (Math.PI * 2 * i) / 14
    const startDist = 45
    particles.value.push({
      id,
      x: x + Math.cos(angle) * startDist,
      y: y + Math.sin(angle) * startDist,
      size: 3 + Math.random() * 3,
      color: `hsl(${205 + Math.random() * 25}, 85%, ${65 + Math.random() * 20}%)`,
      dx: Math.cos(angle) * -25,
      dy: Math.sin(angle) * -25,
      scale: 1.3,
      opacity: 1,
      dur: 0.5,
    })
    setTimeout(() => {
      const p = particles.value.find(p => p.id === id)
      if (p) { p.scale = 0; p.opacity = 0 }
    }, 400)
    setTimeout(() => { particles.value = particles.value.filter(p => p.id !== id) }, 600)
  }
  // Sparkle burst
  for (let i = 0; i < 6; i++) {
    const id = particleId++
    particles.value.push({
      id,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: 2 + Math.random() * 2,
      color: '#93c5fd',
      dx: (Math.random() - 0.5) * 30,
      dy: -(8 + Math.random() * 20),
      scale: 1.5,
      opacity: 1,
      dur: 0.5,
    })
    setTimeout(() => {
      const p = particles.value.find(p => p.id === id)
      if (p) { p.scale = 0; p.opacity = 0 }
    }, 350)
    setTimeout(() => { particles.value = particles.value.filter(p => p.id !== id) }, 550)
  }
}

function emitDrawParticles(x: number, y: number) {
  for (let i = 0; i < 8; i++) {
    const id = particleId++
    particles.value.push({
      id,
      x: x + (Math.random() - 0.5) * 25,
      y,
      size: 2 + Math.random() * 3,
      color: `hsl(${250 + Math.random() * 50}, 75%, ${60 + Math.random() * 20}%)`,
      dx: (Math.random() - 0.5) * 35,
      dy: -(12 + Math.random() * 25),
      scale: 1.2,
      opacity: 1,
      dur: 0.45,
    })
    setTimeout(() => {
      const p = particles.value.find(p => p.id === id)
      if (p) { p.scale = 0; p.opacity = 0 }
    }, 300)
    setTimeout(() => { particles.value = particles.value.filter(p => p.id !== id) }, 500)
  }
}

function showProjectile(fromX: number, fromY: number, toX: number, toY: number, icon: string, color: string) {
  projectile.value = { x: fromX, y: fromY, icon, color }
  const duration = 350
  const startTime = Date.now()
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    if (projectile.value) {
      projectile.value.x = fromX + (toX - fromX) * eased
      projectile.value.y = fromY + (toY - fromY) * eased - Math.sin(progress * Math.PI) * 40
    }
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      projectile.value = null
    }
  }
  requestAnimationFrame(animate)
}

function flashScreen(color: string, opacity: number = 0.15) {
  screenEffect.value = { color, opacity }
  setTimeout(() => { screenEffect.value = null }, 180)
}

defineExpose({
  emitParticles,
  emitHealParticles,
  emitShieldParticles,
  emitDrawParticles,
  showProjectile,
  flashScreen,
})
</script>

<style scoped>
.shockwave-enter-active {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.shockwave-leave-active {
  transition: all 0.2s ease-out;
}
.shockwave-enter-from {
  transform: scale(0.3);
  opacity: 0.8;
}
.shockwave-leave-to {
  opacity: 0;
}

.float-text-enter-active {
  transition: none;
}
.float-text-leave-active {
  transition: none;
}

.shield-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.shield-pop-leave-active {
  transition: all 0.5s ease-out;
}
.shield-pop-enter-from {
  opacity: 0;
  transform: scale(1.6);
}
.shield-pop-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.shield-hex {
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  animation: shield-draw 0.6s ease-out forwards;
}
.shield-hex-inner {
  animation: shield-pulse 0.9s ease-in-out;
}

@keyframes shield-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes shield-pulse {
  0% { opacity: 0; transform: scale(1.2); }
  50% { opacity: 1; }
  100% { opacity: 0.6; transform: scale(1); }
}

.screen-flash-enter-active {
  transition: opacity 0.04s;
}
.screen-flash-leave-active {
  transition: opacity 0.25s ease-out;
}
.screen-flash-enter-from,
.screen-flash-leave-to {
  opacity: 0;
}
</style>
