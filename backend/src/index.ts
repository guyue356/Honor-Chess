import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authMiddleware } from './middleware/auth'
import { auth } from './routes/auth'
import { heroes } from './routes/heroes'
import { decks } from './routes/decks'
import { rank } from './routes/rank'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

// Public routes
app.route('/api/auth', auth)
app.route('/api/heroes', heroes)

// Protected routes
app.use('/api/decks/*', async (c, next) => authMiddleware(c, next, c.env))
app.use('/api/rank/*', async (c, next) => authMiddleware(c, next, c.env))
app.route('/api/decks', decks)
app.route('/api/rank', rank)

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

export default app
