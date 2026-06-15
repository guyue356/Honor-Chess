# 王者荣耀英雄杀 (Honor Chess Hero Kill)

基于王者荣耀英雄IP的1v1卡牌对战游戏，融合王者峡谷世界观卡牌玩法与炉石传说法力值系统。

## 游戏特色

- **30位王者荣耀英雄**：坦克、战士、法师、刺客、射手、辅助六大职业，每位英雄拥有独特专属技能卡
- **策略卡牌系统**：攻击、防御、法术、装备四大类卡牌，配合英雄技能组合出无限策略
- **炉石式法力值**：每回合法力值递增，合理分配法力打出最优连招
- **排位段位系统**：青铜→白银→黄金→铂金→钻石→王者，连胜额外获得星数
- **PixiJS 动效**：菱形法力水晶、粒子特效、护甲盾牌动画、伤害飘字
- **程序化音效**：Web Audio API 生成战斗BGM和各类卡牌音效

## 素材数据来源

### 英雄数据
- `data/heroes/info/*.json`：英雄属性、技能、背景故事等结构化数据
- `data/heroes/images/*.jpg`：英雄头像图片
- 数据来源为王者荣耀官方英雄资料（`pvp.qq.com`），通过爬虫采集整理
- 包含 130+ 位英雄的完整数据，游戏中精选 30 位作为 DEMO 英雄

### 游戏数值
- 英雄生命值 = 原始生存值 × 2 + 10（范围 16-30）
- 英雄攻击力 = 原始攻击值（范围 1-10）
- 卡牌效果数值为游戏平衡性设计，非直接引用原游戏数值

### 装备系统
- 6件装备卡（无尽战刃、破军、不祥征兆、霸者重装、反伤刺甲、疾步之靴）
- 装备图标来源于王者荣耀游戏装备资源

## 游戏设计思想

### 核心循环
```
选择英雄 → 构建牌库 → 1v1对战 → 获胜提升段位
```

### 卡牌体系
| 类型 | 数量 | 说明 |
|------|------|------|
| 基础攻击卡 | 6张 | 1费，造成3点伤害 |
| 防御卡 | 5张 | 闪避（0费免疫伤害）、格挡（1费获得护甲） |
| 恢复卡 | 4张 | 1费，恢复2点生命 |
| 法术卡 | 8张 | 抽牌、弃牌、偷牌、高伤害 |
| AOE卡 | 2张 | 双方各受3点伤害 |
| 增益卡 | 4张 | 1费，下次攻击+2 |
| 装备卡 | 6件 | 武器/防具/鞋子各一件，提供被动效果 |
| 英雄技能卡 | 30张 | 每位英雄1张，以20%概率替换普通攻击 |

### 战斗机制
- **初始状态**：双方从38张牌库抽5张手牌，初始法力1点
- **回合流程**：法力回满并+1（上限10）→ 抽1张牌 → 出牌 → 结束回合
- **伤害计算**：最终伤害 = 基础伤害 + 攻击加成 - 护甲值
- **牌库循环**：弃牌堆自动洗入牌库，确保对局可持续20+回合

### 段位系统
仿照炉石传说设计：
- 6个段位：青铜(5阶) → 白银(5阶) → 黄金(5阶) → 铂金(5阶) → 钻石(5阶) → 王者
- 胜利+1⭐，连胜3场+2⭐，连胜5场+3⭐
- 失败-1⭐，低段位连败-2⭐
- 段位数据存储在 localStorage

## 快速开始

### 环境需求
- **Node.js** >= 18
- **npm** >= 9
- **Wrangler CLI**（后端部署用，本地开发可选）

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 启动开发服务器

```bash
# 启动前端（Vite，端口 5173）
cd frontend
npm run dev

# 启动后端（Cloudflare Workers，端口 8787）
cd backend
npm run dev
```

浏览器访问 http://localhost:5173

### 项目结构

```
Honor Chess/
├── frontend/                # Vue 3 + TypeScript + Vite 前端
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   │   ├── HomeView.vue      # 首页
│   │   │   ├── HeroesView.vue    # 英雄选择
│   │   │   ├── BattleView.vue    # 战斗界面
│   │   │   ├── CardsView.vue     # 卡牌图鉴
│   │   │   └── ...
│   │   ├── components/     # 通用组件
│   │   │   ├── BattleEffects.vue # 战斗特效（PixiJS粒子）
│   │   │   ├── ManaCrystals.vue  # 法力水晶（PixiJS菱形）
│   │   │   ├── HealthBar.vue     # 血条
│   │   │   └── ...
│   │   ├── game/           # 游戏核心逻辑
│   │   │   ├── engine.ts         # 游戏引擎（回合、卡牌效果、AI）
│   │   │   ├── cards.ts          # 卡牌数据定义
│   │   │   ├── heroes.ts         # 英雄数据
│   │   │   ├── effects.ts        # 效果配置
│   │   │   ├── audio.ts          # 音效系统（Web Audio API）
│   │   │   └── types.ts          # TypeScript 类型
│   │   └── stores/         # Pinia 状态管理
│   │       ├── game.ts           # 游戏状态
│   │       └── rank.ts           # 段位状态
│   └── package.json
├── backend/                 # Hono + Cloudflare Workers 后端
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── middleware/     # JWT 认证中间件
│   │   └── db/             # D1 数据库 Schema
│   └── wrangler.toml
├── data/                    # 素材数据
│   └── heroes/
│       ├── info/           # 英雄 JSON 数据（130+）
│       └── images/         # 英雄头像图片
├── PRD.md                   # 产品需求文档
└── 开发计划.md              # 开发里程碑计划
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Composition API + TypeScript |
| 构建工具 | Vite 8 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 4 |
| 样式 | TailwindCSS 4 |
| 游戏动效 | PixiJS 7（法力水晶、粒子特效） |
| 音效 | Web Audio API（程序化生成） |
| 后端框架 | Hono |
| 运行时 | Cloudflare Workers |
| 数据库 | Cloudflare D1 (SQLite) |
| 认证 | JWT |

## 部署

```bash
# 创建 D1 数据库
cd backend
wrangler d1 create honor-chess-db
wrangler d1 execute honor-chess-db --file=./src/db/schema.sql
wrangler d1 execute honor-chess-db --file=./src/db/seed.sql

# 部署后端到 Cloudflare Workers
wrangler deploy

# 构建并部署前端到 Cloudflare Pages
cd ../frontend
npm run build
wrangler pages deploy dist --project-name=honor-chess
```

## License

MIT
