import { Router } from 'express'
import { getDb } from '../db.js'
import { getScale, comprehensiveScales } from '../data/scales/index.js'
import { scoreScale } from '../services/scoring.js'
import { buildResult } from '../services/explanations.js'
import { buildComprehensive } from '../services/comprehensive.js'
import { generateToken, hashPassword, verifyPassword } from '../services/token.js'

const router = Router()
const MIN_PASSWORD = 6

// POST /api/assessments — submit answers, score, persist, return result + share token.
// scheme='comprehensive' runs the full multi-scale battery and synthesizes an integrated report.
router.post('/', (req, res) => {
  try {
    const { scheme, language = 'zh', intake = {}, answers, password } = req.body || {}

    if (!Array.isArray(answers) || answers.length === 0)
      return res.status(400).json({ error: 'answers must be a non-empty array' })
    if (typeof password !== 'string' || password.length < MIN_PASSWORD)
      return res.status(400).json({ error: `password must be at least ${MIN_PASSWORD} characters` })

    const lang = language === 'en' ? 'en' : 'zh'

    let schemeId
    let singleResult = null
    let multiResults = null
    let comprehensive = null
    let crisis = false

    if (scheme === 'comprehensive') {
      const parts = []
      for (const scale of comprehensiveScales()) {
        const idSet = new Set(scale.items.map((i) => i.id))
        const scaleAnswers = answers.filter((a) => idSet.has(a.itemId))
        const score = scoreScale(scale, scaleAnswers)
        const result = buildResult(scale, score, intake)
        parts.push({ scale, score, result })
        if (score.crisis) crisis = true
      }
      comprehensive = buildComprehensive(parts)
      multiResults = parts.map((p) => p.result)
      schemeId = 'comprehensive'
    } else {
      const scale = getScale(scheme)
      if (!scale) return res.status(400).json({ error: 'Unknown or unsupported scheme' })
      const score = scoreScale(scale, answers)
      singleResult = buildResult(scale, score, intake)
      crisis = Boolean(score.crisis)
      schemeId = scale.id
    }

    const token = generateToken()
    const { salt, hash } = hashPassword(password)
    const db = getDb()
    db.prepare(
      `INSERT INTO assessments
         (token, password_hash, salt, scheme, language, intake_json, answers_json, scores_json, comprehensive_json, crisis)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      token,
      hash,
      salt,
      schemeId,
      lang,
      JSON.stringify(intake ?? {}),
      JSON.stringify(answers),
      JSON.stringify(multiResults ?? singleResult),
      comprehensive ? JSON.stringify(comprehensive) : null,
      crisis ? 1 : 0
    )

    res.status(201).json({
      token,
      shareUrl: `/r/${token}`,
      scheme: schemeId,
      language: lang,
      crisis,
      result: singleResult,
      results: multiResults,
      comprehensive
    })
  } catch (err) {
    const status = err.statusCode || 500
    if (status >= 500) console.error('[assessments] submit error:', err)
    res.status(status).json({ error: err.message || 'Failed to process assessment' })
  }
})

// GET /api/assessments/:token/meta — non-sensitive metadata (does it exist, which scheme)
router.get('/:token/meta', (req, res) => {
  const db = getDb()
  const row = db
    .prepare('SELECT scheme, language, crisis, created_at FROM assessments WHERE token = ?')
    .get(req.params.token)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json({
    exists: true,
    scheme: row.scheme,
    language: row.language,
    crisis: Boolean(row.crisis),
    createdAt: row.created_at
  })
})

// POST /api/assessments/:token/unlock — verify password, return stored result
router.post('/:token/unlock', (req, res) => {
  const { password } = req.body || {}
  if (typeof password !== 'string') return res.status(400).json({ error: 'password required' })

  const db = getDb()
  const row = db
    .prepare(
      `SELECT token, password_hash, salt, scheme, language, intake_json, answers_json,
              scores_json, comprehensive_json, crisis, created_at
         FROM assessments WHERE token = ?`
    )
    .get(req.params.token)
  if (!row) return res.status(404).json({ error: 'Not found' })

  if (!verifyPassword(password, row.salt, row.password_hash))
    return res.status(403).json({ error: 'Incorrect password' })

  const comprehensive = safeParse(row.comprehensive_json, null)
  const stored = safeParse(row.scores_json, null)
  const isMulti = row.scheme === 'comprehensive' || Array.isArray(stored)

  res.json({
    token: row.token,
    scheme: row.scheme,
    language: row.language,
    crisis: Boolean(row.crisis),
    createdAt: row.created_at,
    intake: safeParse(row.intake_json, {}),
    answers: safeParse(row.answers_json, []),
    result: isMulti ? null : stored,
    results: isMulti ? stored : null,
    comprehensive
  })
})

function safeParse(text, fallback) {
  try {
    return text == null ? fallback : JSON.parse(text)
  } catch {
    return fallback
  }
}

export default router
