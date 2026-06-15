import type { HeroData } from './types'

export const DEMO_HEROES: HeroData[] = [
  // 坦克
  { id: 135, name: '项羽', title: '霸王', class: '坦克', hp: 28, attack: 4, skillName: '霸王之怒', skillDesc: '对敌方造成6点伤害', skillManaCost: 3, skillEffect: { type: 'damage', value: 6, target: 'enemy' }, imageUrl: '/heroes/images/135_xiangyu.jpg' },
  { id: 105, name: '廉颇', title: '正义爆轰', class: '坦克', hp: 30, attack: 3, skillName: '猛力冲撞', skillDesc: '造成5伤害+眩晕1回合', skillManaCost: 4, skillEffect: { type: 'stun_damage', value: 5, target: 'enemy' }, imageUrl: '/heroes/images/105_lianpo.jpg' },
  { id: 171, name: '张飞', title: '禁血狂兽', class: '坦克', hp: 30, attack: 4, skillName: '狂兽血性', skillDesc: '获得4护甲持续2回合', skillManaCost: 3, skillEffect: { type: 'armor', value: 4, duration: 2, target: 'self' }, imageUrl: '/heroes/images/171_zhangfei.jpg' },
  { id: 149, name: '刘邦', title: '双面君主', class: '坦克', hp: 26, attack: 4, skillName: '帝王守护', skillDesc: '回复4血量', skillManaCost: 3, skillEffect: { type: 'heal', value: 4, target: 'self' }, imageUrl: '/heroes/images/149_liubang.jpg' },
  { id: 510, name: '孙策', title: '光明之海', class: '坦克', hp: 24, attack: 5, skillName: '怒海冲锋', skillDesc: '造成7伤害，自身受2伤害', skillManaCost: 4, skillEffect: { type: 'self_damage_enemy', value: 7, target: 'enemy' }, imageUrl: '/heroes/images/510_sunce.jpg' },

  // 战士
  { id: 140, name: '关羽', title: '一骑当千', class: '战士', hp: 22, attack: 6, skillName: '单刀赴会', skillDesc: '造成6伤害，敌方<50%血则翻倍', skillManaCost: 4, skillEffect: { type: 'conditional_damage', value: 6, condition: 'low_hp_double', target: 'enemy' }, imageUrl: '/heroes/images/140_guanyu.jpg' },
  { id: 154, name: '花木兰', title: '传说之刃', class: '战士', hp: 20, attack: 7, skillName: '重剑无锋', skillDesc: '造成2伤害×3次', skillManaCost: 5, skillEffect: { type: 'repeat_damage', value: 2, repeat: 3, target: 'enemy' }, imageUrl: '/heroes/images/154_huamulan.jpg' },
  { id: 193, name: '铠', title: '破灭刃锋', class: '战士', hp: 22, attack: 6, skillName: '魔铠降世', skillDesc: '获得+2攻击持续3回合', skillManaCost: 4, skillEffect: { type: 'attack_buff', value: 2, duration: 3, target: 'self' }, imageUrl: '/heroes/images/193_kai.jpg' },
  { id: 107, name: '赵云', title: '苍天翔龙', class: '战士', hp: 22, attack: 6, skillName: '龙胆突刺', skillDesc: '造成5伤害+抽1张牌', skillManaCost: 3, skillEffect: { type: 'damage_draw', value: 5, target: 'enemy' }, imageUrl: '/heroes/images/107_zhaoyun.jpg' },
  { id: 123, name: '吕布', title: '无双之魔', class: '战士', hp: 20, attack: 7, skillName: '天魔缭乱', skillDesc: '造成8伤害，自身受1伤害', skillManaCost: 5, skillEffect: { type: 'self_damage_enemy', value: 8, target: 'enemy' }, imageUrl: '/heroes/images/123_lvbu.jpg' },

  // 法师
  { id: 190, name: '诸葛亮', title: '绝代智谋', class: '法师', hp: 18, attack: 4, skillName: '元素弹幕', skillDesc: '造成7伤害', skillManaCost: 4, skillEffect: { type: 'damage', value: 7, target: 'enemy' }, imageUrl: '/heroes/images/190_zhugeliang.jpg' },
  { id: 141, name: '貂蝉', title: '绝世舞姬', class: '法师', hp: 18, attack: 3, skillName: '绝世舞姬', skillDesc: '造成5伤害+回复2血', skillManaCost: 4, skillEffect: { type: 'damage_heal', value: 5, target: 'enemy' }, imageUrl: '/heroes/images/141_diaochan.jpg' },
  { id: 142, name: '安琪拉', title: '暗夜萝莉', class: '法师', hp: 16, attack: 4, skillName: '心灵骇客', skillDesc: '造成8伤害', skillManaCost: 5, skillEffect: { type: 'damage', value: 8, target: 'enemy' }, imageUrl: '/heroes/images/142_anqila.jpg' },
  { id: 109, name: '妲己', title: '魅力之狐', class: '法师', hp: 16, attack: 3, skillName: '魅惑之狐', skillDesc: '敌方跳过下1次攻击', skillManaCost: 4, skillEffect: { type: 'skip_attack', target: 'enemy' }, imageUrl: '/heroes/images/109_daji.jpg' },
  { id: 152, name: '王昭君', title: '冰雪之华', class: '法师', hp: 18, attack: 4, skillName: '凤凰于飞', skillDesc: '对敌方全体造成4伤害', skillManaCost: 5, skillEffect: { type: 'damage', value: 4, target: 'enemy' }, imageUrl: '/heroes/images/152_wangzhaojun.jpg' },

  // 刺客
  { id: 131, name: '李白', title: '青莲剑仙', class: '刺客', hp: 18, attack: 7, skillName: '青莲剑歌', skillDesc: '造成6伤害+免疫1次伤害', skillManaCost: 4, skillEffect: { type: 'damage_immunity', value: 6, target: 'enemy' }, imageUrl: '/heroes/images/131_libai.jpg' },
  { id: 150, name: '韩信', title: '国士无双', class: '刺客', hp: 18, attack: 7, skillName: '国士无双', skillDesc: '造成9伤害', skillManaCost: 5, skillEffect: { type: 'damage', value: 9, target: 'enemy' }, imageUrl: '/heroes/images/150_hanxin.jpg' },
  { id: 146, name: '露娜', title: '月光之女', class: '刺客', hp: 20, attack: 4, skillName: '月光斩', skillDesc: '造成2伤害×3次', skillManaCost: 4, skillEffect: { type: 'repeat_damage', value: 2, repeat: 3, target: 'enemy' }, imageUrl: '/heroes/images/146_luna.jpg' },
  { id: 153, name: '兰陵王', title: '暗影刀锋', class: '刺客', hp: 18, attack: 6, skillName: '暗影突袭', skillDesc: '下次攻击+5伤害', skillManaCost: 3, skillEffect: { type: 'next_attack_buff', value: 5, target: 'self' }, imageUrl: '/heroes/images/153_lanlingwang.jpg' },
  { id: 116, name: '阿轲', title: '信念之刃', class: '刺客', hp: 16, attack: 10, skillName: '致命一击', skillDesc: '对<30%血目标造成12伤害', skillManaCost: 5, skillEffect: { type: 'execute_damage', value: 12, condition: 'low_hp', target: 'enemy' }, imageUrl: '/heroes/images/116_ake.jpg' },

  // 射手
  { id: 111, name: '孙尚香', title: '千金重弩', class: '射手', hp: 16, attack: 8, skillName: '千金重弩', skillDesc: '造成6伤害+抽2张牌', skillManaCost: 4, skillEffect: { type: 'damage_draw', value: 6, drawCount: 2, target: 'enemy' as const }, imageUrl: '/heroes/images/111_sunshangxiang.jpg' },
  { id: 112, name: '鲁班七号', title: '机关造物', class: '射手', hp: 16, attack: 7, skillName: '空中支援', skillDesc: '对敌方全体造成3伤害', skillManaCost: 4, skillEffect: { type: 'damage', value: 3, target: 'enemy' }, imageUrl: '/heroes/images/112_lubanqihao.jpg' },
  { id: 169, name: '后羿', title: '半神之弓', class: '射手', hp: 18, attack: 6, skillName: '黄金射手', skillDesc: '造成7伤害（无视护甲）', skillManaCost: 4, skillEffect: { type: 'true_damage', value: 7, target: 'enemy' }, imageUrl: '/heroes/images/169_houyi.jpg' },
  { id: 174, name: '虞姬', title: '森之风灵', class: '射手', hp: 18, attack: 8, skillName: '霸王别姬', skillDesc: '造成5伤害+获得2护甲', skillManaCost: 4, skillEffect: { type: 'damage_armor', value: 5, target: 'enemy' }, imageUrl: '/heroes/images/174_yuji.jpg' },
  { id: 133, name: '狄仁杰', title: '断案大师', class: '射手', hp: 18, attack: 6, skillName: '断案大师', skillDesc: '造成4伤害+移除敌方1增益', skillManaCost: 3, skillEffect: { type: 'damage_dispel', value: 4, target: 'enemy' }, imageUrl: '/heroes/images/133_direnjie.jpg' },

  // 辅助
  { id: 184, name: '蔡文姬', title: '天籁弦音', class: '辅助', hp: 20, attack: 2, skillName: '天籁弦音', skillDesc: '回复4血量', skillManaCost: 3, skillEffect: { type: 'heal', value: 4, target: 'self' }, imageUrl: '/heroes/images/184_caiwenji.jpg' },
  { id: 191, name: '大乔', title: '沧海之曜', class: '辅助', hp: 20, attack: 3, skillName: '沧海之曜', skillDesc: '抽3张牌', skillManaCost: 3, skillEffect: { type: 'draw', value: 3, target: 'self' }, imageUrl: '/heroes/images/191_daqiao.jpg' },
  { id: 505, name: '瑶', title: '鹿灵守心', class: '辅助', hp: 18, attack: 2, skillName: '鹿灵守护', skillDesc: '获得3护甲+回复1血', skillManaCost: 3, skillEffect: { type: 'armor_heal', value: 3, target: 'self' }, imageUrl: '/heroes/images/505_yao.jpg' },
  { id: 501, name: '明世隐', title: '灵魂劫卜', class: '辅助', hp: 20, attack: 3, skillName: '灵魂连结', skillDesc: '与敌方各受3伤害', skillManaCost: 4, skillEffect: { type: 'damage_all', value: 3, target: 'all' }, imageUrl: '/heroes/images/501_mingshiyin.jpg' },
  { id: 118, name: '孙膑', title: '逆流之时', class: '辅助', hp: 18, attack: 3, skillName: '时光流逝', skillDesc: '所有卡牌法力消耗-1（本回合）', skillManaCost: 3, skillEffect: { type: 'reduce_cost', value: 1, target: 'self' }, imageUrl: '/heroes/images/118_sunbin.jpg' },
]

export const CLASS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  '坦克': { bg: 'bg-blue-900/50', border: 'border-blue-500', text: 'text-blue-400' },
  '战士': { bg: 'bg-orange-900/50', border: 'border-orange-500', text: 'text-orange-400' },
  '法师': { bg: 'bg-purple-900/50', border: 'border-purple-500', text: 'text-purple-400' },
  '刺客': { bg: 'bg-red-900/50', border: 'border-red-500', text: 'text-red-400' },
  '射手': { bg: 'bg-green-900/50', border: 'border-green-500', text: 'text-green-400' },
  '辅助': { bg: 'bg-yellow-900/50', border: 'border-yellow-500', text: 'text-yellow-400' },
}

export function getHeroById(id: number): HeroData | undefined {
  return DEMO_HEROES.find(h => h.id === id)
}

export function getHeroesByClass(className: string): HeroData[] {
  return DEMO_HEROES.filter(h => h.class === className)
}
