import { Hono } from 'hono'
import type { Env } from '../types'

const decks = new Hono<{ Bindings: Env }>()

decks.get('/', async (c) => {
  const userId = (c as any).get('userId')
  const result = await c.env.DB.prepare('SELECT * FROM user_decks WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all()
  return c.json({ decks: result.results })
})

decks.post('/', async (c) => {
  const userId = (c as any).get('userId')
  const { heroId, name, cardIds } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO user_decks (user_id, hero_id, name, card_ids) VALUES (?, ?, ?, ?)'
  ).bind(userId, heroId, name || '默认卡组', JSON.stringify(cardIds || [])).run()
  return c.json({ id: result.meta.last_row_id })
})

decks.put('/:id', async (c) => {
  const userId = (c as any).get('userId')
  const id = Number(c.req.param('id'))
  const { name, cardIds } = await c.req.json()
  await c.env.DB.prepare(
    'UPDATE user_decks SET name = COALESCE(?, name), card_ids = COALESCE(?, card_ids) WHERE id = ? AND user_id = ?'
  ).bind(name, cardIds ? JSON.stringify(cardIds) : null, id, userId).run()
  return c.json({ success: true })
})

decks.delete('/:id', async (c) => {
  const userId = (c as any).get('userId')
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM user_decks WHERE id = ? AND user_id = ?').bind(id, userId).run()
  return c.json({ success: true })
})

export { decks }
