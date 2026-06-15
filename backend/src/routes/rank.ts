import { Hono } from 'hono'
import type { Env } from '../types'

const rank = new Hono<{ Bindings: Env }>()

rank.get('/top', async (c) => {
  const limit = Number(c.req.query('limit') || 10)
  const result = await c.env.DB.prepare(
    `SELECT l.*, u.nickname FROM leaderboard l JOIN users u ON l.user_id = u.id ORDER BY l.wins DESC LIMIT ?`
  ).bind(limit).all()
  return c.json({ leaderboard: result.results })
})

rank.get('/me', async (c) => {
  const userId = (c as any).get('userId')
  const record = await c.env.DB.prepare('SELECT * FROM leaderboard WHERE user_id = ?').bind(userId).first()
  const wins = record?.wins || 0
  const losses = record?.losses || 0
  const total = wins + losses
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0
  return c.json({ record: { ...record, winRate } })
})

export { rank }
