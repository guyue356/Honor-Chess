import type { Env } from '../types'

export async function createHash(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyHash(password: string, hash: string): Promise<boolean> {
  const computed = await createHash(password)
  return computed === hash
}

export async function authMiddleware(c: any, next: () => Promise<void>, env: Env) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '未登录' }, 401)
  }

  try {
    const token = authHeader.slice(7)
    const [header, body, sig] = token.split('.')
    const data = `${header}.${body}`

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))

    if (!valid) return c.json({ error: 'Token无效' }, 401)

    const payload = JSON.parse(atob(body))
    if (payload.exp < Date.now()) return c.json({ error: 'Token已过期' }, 401)

    c.set('userId', payload.userId)
    c.set('username', payload.username)
  } catch {
    return c.json({ error: 'Token无效' }, 401)
  }

  await next()
}
