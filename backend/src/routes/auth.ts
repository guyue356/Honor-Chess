import { Hono } from 'hono'
import { createHash, verifyHash } from '../middleware/auth'
import type { Env } from '../types'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/register', async (c) => {
  const { username, password, nickname } = await c.req.json()
  if (!username || !password || !nickname) {
    return c.json({ error: '请填写完整信息' }, 400)
  }

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first()
  if (existing) {
    return c.json({ error: '用户名已存在' }, 400)
  }

  const hash = await createHash(password)
  const result = await c.env.DB.prepare('INSERT INTO users (username, password_hash, nickname) VALUES (?, ?, ?)').bind(username, hash, nickname).run()

  const token = await createJWT({ userId: result.meta.last_row_id, username }, c.env.JWT_SECRET)
  return c.json({ token, user: { id: result.meta.last_row_id, username, nickname } })
})

auth.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  if (!username || !password) {
    return c.json({ error: '请填写用户名和密码' }, 400)
  }

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first() as any
  if (!user || !(await verifyHash(password, user.password_hash))) {
    return c.json({ error: '用户名或密码错误' }, 401)
  }

  const token = await createJWT({ userId: user.id, username: user.username }, c.env.JWT_SECRET)
  return c.json({ token, user: { id: user.id, username: user.username, nickname: user.nickname } })
})

auth.get('/me', async (c) => {
  const userId = (c as any).get('userId')
  if (!userId) return c.json({ error: '未登录' }, 401)

  const user = await c.env.DB.prepare('SELECT id, username, nickname, avatar_url FROM users WHERE id = ?').bind(userId).first()
  return c.json({ user })
})

// Simple JWT implementation using Web Crypto
async function createJWT(payload: any, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  const data = `${header}.${body}`
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return `${data}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`
}

export { auth }
