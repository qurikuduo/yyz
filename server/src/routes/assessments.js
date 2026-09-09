import { Router } from 'express'
import { getDb } from '../db.js'
import { getScale } from '../data/scales/index.js'
import { scoreScale } from '../services/scoring.js'
import { buildResult } from '../services/explanations.js'
import { generateToken, hashPassword, verifyPassword } from '../services/token.js'

const router = Router()
const MIN_PASSWORD = 6

// POST /api/assessments — submit answers, score, persist, return result + share token
router.post('/', (req, res) => {
  try {
    const { scheme, language = 'zh', intake = {}, answers, password } = req.body || {}

    const scale = getScale(scheme)
    if (!scale) return res.status(400).json({ error: 'Unknown or unsupported scheme' })
    if (!Array.isArray(answers) || answers.length === 0)
      return res.status(400).json({ error: 'answers must be a non-empty array' })
    if (typeof password !== 'string' || password.length < MIN_PASSWORD)
      return res.status(400).json({ error: `password must be at least ${MIN_PASSWORD} characters` })

    const lang = language === 'en' ? 'en' : 'zh'
    const score = scoreScale(scale, answers)
    const result = buildResult(scale, score, intake)

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
      scale.id,
      lang,
      JSON.stringify(intake ?? {}),
      JSON.stringify(answers),
      JSON.stringify(result),
      null,
      score.crisis ? 1 : 0
    )

    res.status(201).json({
      token,
      shareUrl: `/r/${token}`,
      scheme: scale.id,
      language: lang,
      crisis: Boolean(score.crisis),
      result
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

  res.json({
    token: row.token,
    scheme: row.scheme,
    language: row.language,
    crisis: Boolean(row.crisis),
    createdAt: row.created_at,
    intake: safeParse(row.intake_json, {}),
    answers: safeParse(row.answers_json, []),
    result: safeParse(row.scores_json, null),
    comprehensive: safeParse(row.comprehensive_json, null)
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
