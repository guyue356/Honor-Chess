// 卡牌效果对应的图标和颜色配置
export const EFFECT_CONFIG: Record<string, { icon: string; color: string; glow: string; particles: string }> = {
  // 攻击类
  damage: { icon: '⚔️', color: '#ef4444', glow: 'shadow-red-500/50', particles: 'red' },
  true_damage: { icon: '💀', color: '#dc2626', glow: 'shadow-red-600/60', particles: 'darkred' },
  repeat_damage: { icon: '🌪️', color: '#f97316', glow: 'shadow-orange-500/50', particles: 'orange' },
  conditional_damage: { icon: '🎯', color: '#eab308', glow: 'shadow-yellow-500/50', particles: 'yellow' },
  execute_damage: { icon: '☠️', color: '#7f1d1d', glow: 'shadow-red-900/60', particles: 'darkred' },
  self_damage_enemy: { icon: '💥', color: '#ef4444', glow: 'shadow-red-500/50', particles: 'red' },
  damage_all: { icon: '🌊', color: '#f97316', glow: 'shadow-orange-500/50', particles: 'orange' },
  damage_draw: { icon: '⚡', color: '#eab308', glow: 'shadow-yellow-500/50', particles: 'yellow' },
  damage_heal: { icon: '✨', color: '#a855f7', glow: 'shadow-purple-500/50', particles: 'purple' },
  damage_armor: { icon: '🛡️', color: '#3b82f6', glow: 'shadow-blue-500/50', particles: 'blue' },
  damage_immunity: { icon: '👻', color: '#60a5fa', glow: 'shadow-blue-400/50', particles: 'blue' },
  damage_dispel: { icon: '💫', color: '#8b5cf6', glow: 'shadow-violet-500/50', particles: 'purple' },

  // 防御类
  dodge: { icon: '💨', color: '#6b7280', glow: 'shadow-gray-500/50', particles: 'gray' },
  armor: { icon: '🛡️', color: '#3b82f6', glow: 'shadow-blue-500/50', particles: 'blue' },
  armor_heal: { icon: '💚', color: '#22c55e', glow: 'shadow-green-500/50', particles: 'green' },

  // 恢复类
  heal: { icon: '💚', color: '#22c55e', glow: 'shadow-green-500/50', particles: 'green' },

  // 法术类
  draw: { icon: '👁️', color: '#8b5cf6', glow: 'shadow-violet-500/50', particles: 'purple' },
  discard: { icon: '❌', color: '#ef4444', glow: 'shadow-red-500/50', particles: 'red' },
  steal: { icon: '🤏', color: '#eab308', glow: 'shadow-yellow-500/50', particles: 'yellow' },

  // 增益类
  buff: { icon: '🔥', color: '#f97316', glow: 'shadow-orange-500/50', particles: 'orange' },
  attack_buff: { icon: '⚔️', color: '#ef4444', glow: 'shadow-red-500/50', particles: 'red' },
  next_attack_buff: { icon: '⚡', color: '#eab308', glow: 'shadow-yellow-500/50', particles: 'yellow' },
  reduce_cost: { icon: '💎', color: '#06b6d4', glow: 'shadow-cyan-500/50', particles: 'cyan' },

  // 控制类
  skip_attack: { icon: '🔒', color: '#6b7280', glow: 'shadow-gray-500/50', particles: 'gray' },
  stun_damage: { icon: '💫', color: '#a855f7', glow: 'shadow-purple-500/50', particles: 'purple' },

  // 装备类
  equip_attack: { icon: '⚔️', color: '#ef4444', glow: 'shadow-red-500/50', particles: 'red' },
  equip_armor: { icon: '🛡️', color: '#3b82f6', glow: 'shadow-blue-500/50', particles: 'blue' },
  equip_sha_bonus: { icon: '⚡', color: '#eab308', glow: 'shadow-yellow-500/50', particles: 'yellow' },
  equip_regen: { icon: '💚', color: '#22c55e', glow: 'shadow-green-500/50', particles: 'green' },
  equip_thorns: { icon: '🌹', color: '#dc2626', glow: 'shadow-red-600/60', particles: 'darkred' },
  equip_initiative: { icon: '👟', color: '#06b6d4', glow: 'shadow-cyan-500/50', particles: 'cyan' },
}

export function getEffectConfig(effectType: string) {
  return EFFECT_CONFIG[effectType] || { icon: '🃏', color: '#6b7280', glow: 'shadow-gray-500/50', particles: 'gray' }
}
