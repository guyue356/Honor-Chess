<template>
  <div ref="container" class="mana-crystals" :style="{ width: totalWidth + 'px', height: '28px' }"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import * as PIXI from 'pixi.js'

const props = defineProps<{
  current: number
  max: number
}>()

const container = ref<HTMLElement | null>(null)
let app: PIXI.Application | null = null

const crystalSize = 16
const gap = 3
const totalWidth = computed(() => Math.max(1, props.max) * (crystalSize + gap))

function drawDiamond(g: PIXI.Graphics, cx: number, cy: number, r: number) {
  g.moveTo(cx, cy - r)
  g.lineTo(cx + r * 0.7, cy)
  g.lineTo(cx, cy + r)
  g.lineTo(cx - r * 0.7, cy)
  g.closePath()
}

async function initPixi() {
  if (!container.value) return

  app = new PIXI.Application({
    width: totalWidth.value,
    height: 28,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  })

  container.value.appendChild(app.view as HTMLCanvasElement)
  drawCrystals()
}

function drawCrystals() {
  if (!app) return
  app.stage.removeChildren()

  for (let i = 0; i < props.max; i++) {
    const crystal = new PIXI.Container()
    crystal.x = i * (crystalSize + gap) + crystalSize / 2 + 2
    crystal.y = 14

    const active = i < props.current
    const g = new PIXI.Graphics()

    if (active) {
      // Outer glow
      g.beginFill(0x00d4ff, 0.12)
      drawDiamond(g, 0, 0, crystalSize / 2 + 4)
      g.endFill()

      // Main crystal body
      g.beginFill(0x0088cc)
      drawDiamond(g, 0, 0, crystalSize / 2)
      g.endFill()

      // Upper highlight (lighter)
      g.beginFill(0x44ccff, 0.7)
      g.moveTo(0, -crystalSize / 2)
      g.lineTo(crystalSize * 0.35, 0)
      g.lineTo(0, 2)
      g.lineTo(-crystalSize * 0.35, 0)
      g.closePath()
      g.endFill()

      // Shine streak
      g.lineStyle(1.2, 0xffffff, 0.55)
      g.moveTo(-2, -crystalSize / 2 + 3)
      g.lineTo(0, -2)

      // Subtle pulse via alpha
      let phase = Math.random() * Math.PI * 2
      const ticker = app!.ticker.add(() => {
        phase += 0.06
        crystal.alpha = 0.8 + Math.sin(phase) * 0.2
      })

      // Store ticker for cleanup
      ;(crystal as any)._ticker = ticker
    } else {
      // Inactive: dim outline
      g.lineStyle(1.2, 0x3a3a5e, 0.35)
      drawDiamond(g, 0, 0, crystalSize / 2)

      // Very faint fill
      g.beginFill(0x1a1a2e, 0.3)
      drawDiamond(g, 0, 0, crystalSize / 2 - 1)
      g.endFill()
    }

    crystal.addChild(g)
    app!.stage.addChild(crystal)
  }
}

watch([() => props.current, () => props.max], () => {
  if (app) {
    app.renderer.resize(totalWidth.value, 28)
  }
  drawCrystals()
})

onMounted(async () => {
  await nextTick()
  initPixi()
})

onUnmounted(() => {
  if (app) {
    app.destroy(true, { children: true })
    app = null
  }
})
</script>

<style scoped>
.mana-crystals {
  display: inline-block;
  vertical-align: middle;
}
.mana-crystals :deep(canvas) {
  display: block;
}
</style>
