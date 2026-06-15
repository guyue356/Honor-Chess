import { Hono } from 'hono'
import type { Env } from '../types'

const heroes = new Hono<{ Bindings: Env }>()

heroes.get('/', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM heroes ORDER BY class, id').all()
  return c.json({ heroes: result.results })
})

heroes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const hero = await c.env.DB.prepare('SELECT * FROM heroes WHERE id = ?').bind(id).first()
  if (!hero) return c.json({ error: '英雄不存在' }, 404)
  return c.json({ hero })
})

export { heroes }
