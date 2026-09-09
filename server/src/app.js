import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { WEB_DIST } from './config.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors())
  app.use(express.json({ limit: '1mb' }))

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() })
  })

  // Serve built frontend (production). SPA fallback for non-API routes.
  if (fs.existsSync(WEB_DIST) && fs.existsSync(path.join(WEB_DIST, 'index.html'))) {
    app.use(express.static(WEB_DIST))
    app.get(/^(?!\/api\/).*/, (_req, res) => {
      res.sendFile(path.join(WEB_DIST, 'index.html'))
    })
  } else {
    app.get('/', (_req, res) => {
      res
        .status(200)
        .type('html')
        .send(
          '<h1>Depression Self-Assessment API</h1><p>Frontend not built yet. Run <code>npm run build</code> in <code>web/</code>, or use the dev server.</p>'
        )
    })
  }

  return app
}
