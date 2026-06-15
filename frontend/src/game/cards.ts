import type { CardData, EquipmentData, EquipCategory } from './types'

// 王者荣耀世界观基础卡牌
// 设计理念：脱离三国杀，融入王者峡谷、野区、防御塔、暴君主宰等元素
// 牌库约35张基础卡 + 3张装备 = 38张，确保对局可持续20+回合
export const BASIC_CARDS: CardData[] = [
  // ── 攻击类（6张）──
  { id: 'atk_1', name: '普通攻击', type: 'basic', heroId: null, manaCost: 1,
    description: '对目标造成3点伤害', effect: { type: 'damage', value: 3, target: 'enemy' } },
  { id: 'atk_2', name: '普通攻击', type: 'basic', heroId: null, manaCost: 1,
    description: '对目标造成3点伤害', effect: { type: 'damage', value: 3, target: 'enemy' } },
  { id: 'atk_3', name: '普通攻击', type: 'basic', heroId: null, manaCost: 1,
    description: '对目标造成3点伤害', effect: { type: 'damage', value: 3, target: 'enemy' } },
  { id: 'atk_4', name: '普通攻击', type: 'basic', heroId: null, manaCost: 1,
    description: '对目标造成3点伤害', effect: { type: 'damage', value: 3, target: 'enemy' } },
  { id: 'atk_5', name: '普通攻击', type: 'basic', heroId: null, manaCost: 1,
    description: '对目标造成3点伤害', effect: { type: 'damage', value: 3, target: 'enemy' } },
  { id: 'atk_6', name: '普通攻击', type: 'basic', heroId: null, manaCost: 1,
    description: '对目标造成3点伤害', effect: { type: 'damage', value: 3, target: 'enemy' } },

  // ── 防御类（5张）──
  { id: 'dodge_1', name: '闪避', type: 'basic', heroId: null, manaCost: 0,
    description: '免疫下1次伤害', effect: { type: 'dodge', target: 'self' } },
  { id: 'dodge_2', name: '闪避', type: 'basic', heroId: null, manaCost: 0,
    description: '免疫下1次伤害', effect: { type: 'dodge', target: 'self' } },
  { id: 'dodge_3', name: '闪避', type: 'basic', heroId: null, manaCost: 0,
    description: '免疫下1次伤害', effect: { type: 'dodge', target: 'self' } },
  { id: 'block_1', name: '格挡', type: 'basic', heroId: null, manaCost: 1,
    description: '获得2点护甲', effect: { type: 'armor', value: 2, target: 'self' } },
  { id: 'block_2', name: '格挡', type: 'basic', heroId: null, manaCost: 1,
    description: '获得2点护甲', effect: { type: 'armor', value: 2, target: 'self' } },

  // ── 恢复类（4张）──
  { id: 'heal_1', name: '恢复之泉', type: 'basic', heroId: null, manaCost: 1,
    description: '恢复自身2点血量', effect: { type: 'heal', value: 2, target: 'self' } },
  { id: 'heal_2', name: '恢复之泉', type: 'basic', heroId: null, manaCost: 1,
    description: '恢复自身2点血量', effect: { type: 'heal', value: 2, target: 'self' } },
  { id: 'heal_3', name: '恢复之泉', type: 'basic', heroId: null, manaCost: 1,
    description: '恢复自身2点血量', effect: { type: 'heal', value: 2, target: 'self' } },
  { id: 'heal_4', name: '恢复之泉', type: 'basic', heroId: null, manaCost: 1,
    description: '恢复自身2点血量', effect: { type: 'heal', value: 2, target: 'self' } },

  // ── 法术类（8张）──
  { id: 'draw_1', name: '洞察', type: 'basic', heroId: null, manaCost: 2,
    description: '抽2张牌', effect: { type: 'draw', value: 2, target: 'self' } },
  { id: 'draw_2', name: '洞察', type: 'basic', heroId: null, manaCost: 2,
    description: '抽2张牌', effect: { type: 'draw', value: 2, target: 'self' } },
  { id: 'discard_1', name: '反制', type: 'basic', heroId: null, manaCost: 2,
    description: '随机弃掉对方1张手牌', effect: { type: 'discard', value: 1, target: 'enemy' } },
  { id: 'discard_2', name: '反制', type: 'basic', heroId: null, manaCost: 2,
    description: '随机弃掉对方1张手牌', effect: { type: 'discard', value: 1, target: 'enemy' } },
  { id: 'steal_1', name: '掠夺', type: 'basic', heroId: null, manaCost: 2,
    description: '随机获取对方1张手牌', effect: { type: 'steal', value: 1, target: 'enemy' } },
  { id: 'steal_2', name: '掠夺', type: 'basic', heroId: null, manaCost: 2,
    description: '随机获取对方1张手牌', effect: { type: 'steal', value: 1, target: 'enemy' } },
  { id: 'nuke_1', name: '天降正义', type: 'basic', heroId: null, manaCost: 3,
    description: '对目标造成5点伤害', effect: { type: 'damage', value: 5, target: 'enemy' } },
  { id: 'nuke_2', name: '天降正义', type: 'basic', heroId: null, manaCost: 3,
    description: '对目标造成5点伤害', effect: { type: 'damage', value: 5, target: 'enemy' } },

  // ── AOE类（2张）──
  { id: 'aoe_1', name: '野区争夺', type: 'basic', heroId: null, manaCost: 3,
    description: '双方各受3点伤害', effect: { type: 'damage_all', value: 3, target: 'all' } },
  { id: 'aoe_2', name: '野区争夺', type: 'basic', heroId: null, manaCost: 3,
    description: '双方各受3点伤害', effect: { type: 'damage_all', value: 3, target: 'all' } },

  // ── 增益类（4张）──
  { id: 'buff_1', name: '战意昂扬', type: 'basic', heroId: null, manaCost: 1,
    description: '下次攻击伤害+2', effect: { type: 'buff', value: 2, duration: 1, target: 'self' } },
  { id: 'buff_2', name: '战意昂扬', type: 'basic', heroId: null, manaCost: 1,
    description: '下次攻击伤害+2', effect: { type: 'buff', value: 2, duration: 1, target: 'self' } },
  { id: 'buff_3', name: '战意昂扬', type: 'basic', heroId: null, manaCost: 1,
    description: '下次攻击伤害+2', effect: { type: 'buff', value: 2, duration: 1, target: 'self' } },
  { id: 'buff_4', name: '战意昂扬', type: 'basic', heroId: null, manaCost: 1,
    description: '下次攻击伤害+2', effect: { type: 'buff', value: 2, duration: 1, target: 'self' } },
]

// 王者荣耀世界观装备卡（按类型分组：武器/防具/鞋子，每类可各装备一件）
export const EQUIPMENT_CARDS: EquipmentData[] = [
  // 武器类
  { id: 'equip_1', name: '无尽战刃', category: 'weapon', manaCost: 2, description: '永久增加2点攻击加成',
    effect: { type: 'equip_attack', value: 2 }, imageUrl: '/equip/wujin_zhanren.jpg' },
  { id: 'equip_4', name: '破军', category: 'weapon', manaCost: 2, description: '「普通攻击」额外造成2点伤害',
    effect: { type: 'equip_sha_bonus', value: 2 }, imageUrl: '/equip/pojun.jpg' },
  // 防具类
  { id: 'equip_2', name: '不祥征兆', category: 'armor', manaCost: 2, description: '每次受到攻击时，额外减少1点伤害',
    effect: { type: 'equip_armor', value: 1 }, imageUrl: '/equip/buxiang_zhengzhao.jpg' },
  { id: 'equip_5', name: '霸者重装', category: 'armor', manaCost: 3, description: '每回合结束时回复1点生命值',
    effect: { type: 'equip_regen', value: 1 }, imageUrl: '/equip/bazhe_zhongzhuang.jpg' },
  { id: 'equip_6', name: '反伤刺甲', category: 'armor', manaCost: 2, description: '受到攻击时，反弹1点伤害给攻击者',
    effect: { type: 'equip_thorns', value: 1 }, imageUrl: '/equip/fanshang_cijia.jpg' },
  // 鞋子类
  { id: 'equip_3', name: '疾步之靴', category: 'boots', manaCost: 1, description: '每回合额外抽1张牌',
    effect: { type: 'equip_initiative', value: 1 }, imageUrl: '/equip/jibu_zhixue.jpg' },
]

export const EQUIP_CATEGORY_NAMES: Record<EquipCategory, string> = {
  weapon: '武器',
  armor: '防具',
  boots: '鞋子',
}

// 英雄专属技能卡（30张）
export const SKILL_CARDS: Record<number, CardData> = {
  135: { id: 'skill_135', name: '霸王之怒', type: 'skill', heroId: 135, manaCost: 3,
    description: '对敌方造成6点伤害', effect: { type: 'damage', value: 6, target: 'enemy' } },
  105: { id: 'skill_105', name: '猛力冲撞', type: 'skill', heroId: 105, manaCost: 4,
    description: '造成5伤害+眩晕1回合', effect: { type: 'stun_damage', value: 5, target: 'enemy' } },
  171: { id: 'skill_171', name: '狂兽血性', type: 'skill', heroId: 171, manaCost: 3,
    description: '获得4护甲持续2回合', effect: { type: 'armor', value: 4, duration: 2, target: 'self' } },
  149: { id: 'skill_149', name: '帝王守护', type: 'skill', heroId: 149, manaCost: 3,
    description: '回复4血量', effect: { type: 'heal', value: 4, target: 'self' } },
  510: { id: 'skill_510', name: '怒海冲锋', type: 'skill', heroId: 510, manaCost: 4,
    description: '造成7伤害，自身受2伤害', effect: { type: 'self_damage_enemy', value: 7, target: 'enemy' } },
  140: { id: 'skill_140', name: '单刀赴会', type: 'skill', heroId: 140, manaCost: 4,
    description: '造成6伤害，敌方<50%血则翻倍', effect: { type: 'conditional_damage', value: 6, condition: 'low_hp_double', target: 'enemy' } },
  154: { id: 'skill_154', name: '重剑无锋', type: 'skill', heroId: 154, manaCost: 5,
    description: '造成2伤害×3次', effect: { type: 'repeat_damage', value: 2, repeat: 3, target: 'enemy' } },
  193: { id: 'skill_193', name: '魔铠降世', type: 'skill', heroId: 193, manaCost: 4,
    description: '获得+2攻击持续3回合', effect: { type: 'attack_buff', value: 2, duration: 3, target: 'self' } },
  107: { id: 'skill_107', name: '龙胆突刺', type: 'skill', heroId: 107, manaCost: 3,
    description: '造成5伤害+抽1张牌', effect: { type: 'damage_draw', value: 5, target: 'enemy' } },
  123: { id: 'skill_123', name: '天魔缭乱', type: 'skill', heroId: 123, manaCost: 5,
    description: '造成8伤害，自身受1伤害', effect: { type: 'self_damage_enemy', value: 8, target: 'enemy' } },
  190: { id: 'skill_190', name: '元素弹幕', type: 'skill', heroId: 190, manaCost: 4,
    description: '造成7伤害', effect: { type: 'damage', value: 7, target: 'enemy' } },
  141: { id: 'skill_141', name: '绝世舞姬', type: 'skill', heroId: 141, manaCost: 4,
    description: '造成5伤害+回复2血', effect: { type: 'damage_heal', value: 5, target: 'enemy' } },
  142: { id: 'skill_142', name: '心灵骇客', type: 'skill', heroId: 142, manaCost: 5,
    description: '造成8伤害', effect: { type: 'damage', value: 8, target: 'enemy' } },
  109: { id: 'skill_109', name: '魅惑之狐', type: 'skill', heroId: 109, manaCost: 4,
    description: '敌方跳过下1次攻击', effect: { type: 'skip_attack', target: 'enemy' } },
  152: { id: 'skill_152', name: '凤凰于飞', type: 'skill', heroId: 152, manaCost: 5,
    description: '对敌方全体造成4伤害', effect: { type: 'damage', value: 4, target: 'enemy' } },
  131: { id: 'skill_131', name: '青莲剑歌', type: 'skill', heroId: 131, manaCost: 4,
    description: '造成6伤害+免疫1次伤害', effect: { type: 'damage_immunity', value: 6, target: 'enemy' } },
  150: { id: 'skill_150', name: '国士无双', type: 'skill', heroId: 150, manaCost: 5,
    description: '造成9伤害', effect: { type: 'damage', value: 9, target: 'enemy' } },
  146: { id: 'skill_146', name: '月光斩', type: 'skill', heroId: 146, manaCost: 4,
    description: '造成2伤害×3次', effect: { type: 'repeat_damage', value: 2, repeat: 3, target: 'enemy' } },
  153: { id: 'skill_153', name: '暗影突袭', type: 'skill', heroId: 153, manaCost: 3,
    description: '下次攻击+5伤害', effect: { type: 'next_attack_buff', value: 5, target: 'self' } },
  116: { id: 'skill_116', name: '致命一击', type: 'skill', heroId: 116, manaCost: 5,
    description: '对<30%血目标造成12伤害', effect: { type: 'execute_damage', value: 12, condition: 'low_hp', target: 'enemy' } },
  111: { id: 'skill_111', name: '千金重弩', type: 'skill', heroId: 111, manaCost: 4,
    description: '造成6伤害+抽2张牌', effect: { type: 'damage_draw', value: 6, drawCount: 2, target: 'enemy' } },
  112: { id: 'skill_112', name: '空中支援', type: 'skill', heroId: 112, manaCost: 4,
    description: '对敌方全体造成3伤害', effect: { type: 'damage', value: 3, target: 'enemy' } },
  169: { id: 'skill_169', name: '黄金射手', type: 'skill', heroId: 169, manaCost: 4,
    description: '造成7伤害（无视护甲）', effect: { type: 'true_damage', value: 7, target: 'enemy' } },
  174: { id: 'skill_174', name: '霸王别姬', type: 'skill', heroId: 174, manaCost: 4,
    description: '造成5伤害+获得2护甲', effect: { type: 'damage_armor', value: 5, target: 'enemy' } },
  133: { id: 'skill_133', name: '断案大师', type: 'skill', heroId: 133, manaCost: 3,
    description: '造成4伤害+移除敌方1增益', effect: { type: 'damage_dispel', value: 4, target: 'enemy' } },
  184: { id: 'skill_184', name: '天籁弦音', type: 'skill', heroId: 184, manaCost: 3,
    description: '回复4血量', effect: { type: 'heal', value: 4, target: 'self' } },
  191: { id: 'skill_191', name: '沧海之曜', type: 'skill', heroId: 191, manaCost: 3,
    description: '抽3张牌', effect: { type: 'draw', value: 3, target: 'self' } },
  505: { id: 'skill_505', name: '鹿灵守护', type: 'skill', heroId: 505, manaCost: 3,
    description: '获得3护甲+回复1血', effect: { type: 'armor_heal', value: 3, target: 'self' } },
  501: { id: 'skill_501', name: '灵魂连结', type: 'skill', heroId: 501, manaCost: 4,
    description: '与敌方各受3伤害', effect: { type: 'damage_all', value: 3, target: 'all' } },
  118: { id: 'skill_118', name: '时光流逝', type: 'skill', heroId: 118, manaCost: 3,
    description: '所有卡牌法力消耗-1（本回合）', effect: { type: 'reduce_cost', value: 1, target: 'self' } },
}

export function buildDeck(heroId: number): CardData[] {
  const deck: CardData[] = []
  const skillCard = SKILL_CARDS[heroId]
  const shuffledBasic = [...BASIC_CARDS].sort(() => Math.random() - 0.5)

  for (const card of shuffledBasic) {
    if (card.name === '普通攻击' && skillCard && Math.random() < 0.2) {
      deck.push({ ...skillCard, id: `${skillCard.id}_${deck.length}` })
    } else {
      deck.push({ ...card, id: `${card.id}_${deck.length}` })
    }
  }

  // Pick one equipment from each category (weapon, armor, boots)
  const categories: EquipCategory[] = ['weapon', 'armor', 'boots']
  for (const cat of categories) {
    const catCards = EQUIPMENT_CARDS.filter(e => e.category === cat)
    const picked = catCards[Math.floor(Math.random() * catCards.length)]
    deck.push({
      id: `${picked.id}_${deck.length}`,
      name: picked.name,
      type: 'equipment',
      heroId: null,
      manaCost: picked.manaCost,
      description: picked.description,
      effect: picked.effect,
      imageUrl: picked.imageUrl,
    })
  }

  return deck.sort(() => Math.random() - 0.5)
}
