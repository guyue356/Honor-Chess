// 音频系统 - 使用 Web Audio API 生成程序化音效
let audioCtx: AudioContext | null = null
let bgmGain: GainNode | null = null
let bgmPlaying = false
let bgmInterval: number | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function ensureResumed() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
}

// ── 背景音乐 ──
// 王者峡谷风格战斗BGM：使用振荡器生成循环旋律
const BGM_NOTES = [
  // 主旋律 - 史诗感战斗主题
  { freq: 329.63, dur: 0.25 }, // E4
  { freq: 392.00, dur: 0.25 }, // G4
  { freq: 440.00, dur: 0.5  }, // A4
  { freq: 392.00, dur: 0.25 }, // G4
  { freq: 329.63, dur: 0.25 }, // E4
  { freq: 293.66, dur: 0.5  }, // D4
  { freq: 329.63, dur: 0.25 }, // E4
  { freq: 349.23, dur: 0.25 }, // F4
  { freq: 392.00, dur: 0.5  }, // G4
  { freq: 440.00, dur: 0.5  }, // A4
  { freq: 523.25, dur: 0.5  }, // C5
  { freq: 493.88, dur: 0.5  }, // B4
  { freq: 440.00, dur: 0.25 }, // A4
  { freq: 392.00, dur: 0.25 }, // G4
  { freq: 329.63, dur: 0.5  }, // E4
  { freq: 293.66, dur: 0.5  }, // D4
]

const BGM_BASS = [
  { freq: 130.81, dur: 1.0 }, // C3
  { freq: 146.83, dur: 1.0 }, // D3
  { freq: 130.81, dur: 1.0 }, // C3
  { freq: 110.00, dur: 1.0 }, // A2
]

function playNote(ctx: AudioContext, freq: number, duration: number, startTime: number, type: OscillatorType = 'triangle') {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.06, startTime)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.9)
  osc.connect(gain)
  gain.connect(bgmGain!)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

function scheduleLoop() {
  const ctx = getCtx()
  if (!bgmGain || !bgmPlaying) return

  let time = ctx.currentTime + 0.1
  // Melody
  for (const note of BGM_NOTES) {
    playNote(ctx, note.freq, note.dur, time, 'triangle')
    time += note.dur
  }
  // Bass
  let bassTime = ctx.currentTime + 0.1
  for (const note of BGM_BASS) {
    playNote(ctx, note.freq, note.dur, bassTime, 'sine')
    bassTime += note.dur
  }
}

export function startBGM() {
  if (bgmPlaying) return
  ensureResumed()
  const ctx = getCtx()
  bgmGain = ctx.createGain()
  bgmGain.gain.value = 0.8
  bgmGain.connect(ctx.destination)
  bgmPlaying = true
  scheduleLoop()
  bgmInterval = window.setInterval(() => {
    if (bgmPlaying) scheduleLoop()
  }, 3500)
}

export function stopBGM() {
  bgmPlaying = false
  if (bgmInterval) {
    clearInterval(bgmInterval)
    bgmInterval = null
  }
  if (bgmGain) {
    bgmGain.gain.exponentialRampToValueAtTime(0.001, getCtx().currentTime + 0.5)
    setTimeout(() => { bgmGain = null }, 600)
  }
}

export function setBGMVolume(vol: number) {
  if (bgmGain) bgmGain.gain.value = Math.max(0, Math.min(1, vol))
}

// ── 卡牌音效 ──

function playSfx(type: OscillatorType, freq: number, duration: number, volume: number = 0.15) {
  ensureResumed()
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playNoise(duration: number, volume: number = 0.1) {
  ensureResumed()
  const ctx = getCtx()
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  source.connect(gain)
  gain.connect(ctx.destination)
  source.start(ctx.currentTime)
}

// 攻击音效：尖锐的金属碰撞声
export function playAttackSfx() {
  ensureResumed()
  // 锐利的起始音
  playSfx('sawtooth', 800, 0.08, 0.12)
  setTimeout(() => playSfx('square', 400, 0.1, 0.08), 30)
  setTimeout(() => playNoise(0.15, 0.06), 20)
}

// 治疗音效：柔和的上升音阶
export function playHealSfx() {
  ensureResumed()
  const ctx = getCtx()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(440, now)
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.3)
  gain.gain.setValueAtTime(0.1, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.4)
  // 第二层泛音
  setTimeout(() => playSfx('sine', 660, 0.3, 0.06), 100)
}

// 护甲/防御音效：低沉的盾牌碰撞
export function playArmorSfx() {
  ensureResumed()
  // 低沉的撞击
  playSfx('sine', 150, 0.3, 0.12)
  setTimeout(() => playSfx('triangle', 200, 0.2, 0.08), 50)
  // 金属回响
  setTimeout(() => playSfx('square', 1200, 0.05, 0.04), 80)
  setTimeout(() => playSfx('square', 900, 0.06, 0.03), 120)
}

// 法术/抽牌音效：神秘的水晶声
export function playSpellSfx() {
  ensureResumed()
  const ctx = getCtx()
  const now = ctx.currentTime
  // 上升的水晶音
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, now)
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15)
  gain.gain.setValueAtTime(0.08, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.3)
  // 回响
  setTimeout(() => playSfx('sine', 800, 0.2, 0.04), 150)
}

// 装备音效：沉重的装备碰撞
export function playEquipSfx() {
  ensureResumed()
  // 沉重的撞击
  playSfx('sawtooth', 100, 0.2, 0.08)
  setTimeout(() => playSfx('square', 300, 0.15, 0.06), 50)
  // 金属叮当声
  setTimeout(() => playSfx('triangle', 2000, 0.08, 0.04), 100)
  setTimeout(() => playSfx('triangle', 2500, 0.06, 0.03), 150)
}

// 闪避/增益音效：轻盈的风声
export function playBuffSfx() {
  ensureResumed()
  const ctx = getCtx()
  const now = ctx.currentTime
  // 上升的风声
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(500, now)
  osc.frequency.exponentialRampToValueAtTime(1000, now + 0.2)
  gain.gain.setValueAtTime(0.06, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.25)
  playNoise(0.1, 0.03)
}

// 控制/眩晕音效：低沉的嗡鸣
export function playControlSfx() {
  ensureResumed()
  const ctx = getCtx()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.value = 80
  gain.gain.setValueAtTime(0.08, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.4)
}

// AOE音效：爆炸声
export function playAoeSfx() {
  ensureResumed()
  playNoise(0.3, 0.1)
  playSfx('sawtooth', 200, 0.2, 0.1)
  setTimeout(() => playSfx('square', 100, 0.3, 0.06), 50)
}

// 根据卡牌效果类型播放对应音效
export function playCardSfx(effectType: string) {
  switch (effectType) {
    case 'damage':
    case 'true_damage':
    case 'repeat_damage':
    case 'conditional_damage':
    case 'execute_damage':
    case 'damage_draw':
    case 'damage_heal':
    case 'damage_armor':
    case 'damage_immunity':
    case 'damage_dispel':
      playAttackSfx()
      break
    case 'damage_all':
      playAoeSfx()
      break
    case 'heal':
    case 'armor_heal':
      playHealSfx()
      break
    case 'armor':
    case 'dodge':
    case 'buff':
    case 'attack_buff':
    case 'next_attack_buff':
      playArmorSfx()
      break
    case 'draw':
    case 'discard':
    case 'steal':
    case 'reduce_cost':
      playSpellSfx()
      break
    case 'skip_attack':
    case 'stun_damage':
      playControlSfx()
      break
    case 'self_damage_enemy':
      playAttackSfx()
      setTimeout(playAoeSfx, 200)
      break
    default:
      if (effectType.startsWith('equip_')) {
        playEquipSfx()
      } else {
        playSpellSfx()
      }
  }
}

// 回合切换音效
export function playTurnSfx() {
  ensureResumed()
  playSfx('sine', 600, 0.1, 0.05)
  setTimeout(() => playSfx('sine', 800, 0.1, 0.04), 100)
}

// 胜利音效
export function playVictorySfx() {
  ensureResumed()
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    setTimeout(() => playSfx('triangle', freq, 0.3, 0.1), i * 150)
  })
}

// 失败音效
export function playDefeatSfx() {
  ensureResumed()
  const notes = [440, 349.23, 293.66, 220]
  notes.forEach((freq, i) => {
    setTimeout(() => playSfx('sine', freq, 0.4, 0.08), i * 200)
  })
}
