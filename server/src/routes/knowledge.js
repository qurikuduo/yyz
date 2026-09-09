import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { KNOWLEDGE_ASSETS } from '../config.js'
import { getKnowledge, listKnowledge } from '../data/knowledge.js'

const router = express.Router()

// GET /api/knowledge — categories + resource list
router.get('/', (_req, res) => {
  res.json(listKnowledge())
})

// GET /api/knowledge/:slug — single resource metadata
router.get('/:slug', (req, res) => {
  const r = getKnowledge(req.params.slug)
  if (!r) return res.status(404).json({ error: 'Resource not found' })
  res.json({
    slug: r.slug,
    category: r.category,
    title: r.title,
    summary: r.summary,
    downloadable: Boolean(r.file),
    externalUrl: r.externalUrl ?? null
  })
})

// GET /api/knowledge/:slug/download — serve the bundled file (path-traversal safe)
router.get('/:slug/download', (req, res) => {
  const r = getKnowledge(req.params.slug)
  if (!r || !r.file) return res.status(404).json({ error: 'Downloadable resource not found' })

  const base = path.resolve(KNOWLEDGE_ASSETS)
  const target = path.resolve(base, r.file)
  if (target !== base && !target.startsWith(base + path.sep)) {
    return res.status(400).json({ error: 'Invalid resource path' })
  }
  if (!fs.existsSync(target)) return res.status(404).json({ error: 'File missing on server' })

  res.download(target, r.file)
})

export default router
