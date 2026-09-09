import { Router } from 'express'
import { listScales, getScale, comprehensiveBattery, comprehensiveScales } from '../data/scales/index.js'

const router = Router()

function fullDefinition(scale) {
  return {
    id: scale.id,
    name: scale.name,
    shortName: scale.shortName,
    description: scale.description,
    timeframe: scale.timeframe,
    copyright: scale.copyright,
    reference: scale.reference,
    scoring: scale.scoring,
    clinicalCutoff: scale.clinicalCutoff ?? null,
    bands: scale.bands,
    options: scale.options ?? null,
    items: scale.items.map((it) => ({
      id: it.id,
      text: it.text,
      domain: it.domain,
      dsm5: it.dsm5 ?? null,
      kind: it.kind ?? 'item',
      gateKey: it.gateKey ?? null,
      reverse: Boolean(it.reverse),
      crisis: Boolean(it.crisis),
      options: it.options ?? null
    }))
  }
}

// GET /api/scales — list available schemes (metadata only)
router.get('/', (_req, res) => {
  res.json({ scales: listScales(), comprehensive: comprehensiveBattery })
})

// GET /api/scales/comprehensive/battery — ordered full definitions for the comprehensive flow
router.get('/comprehensive/battery', (_req, res) => {
  res.json({
    comprehensive: comprehensiveBattery,
    scales: comprehensiveScales().map(fullDefinition)
  })
})

// GET /api/scales/:id — full definition needed to render the questionnaire
router.get('/:id', (req, res) => {
  const scale = getScale(req.params.id)
  if (!scale) return res.status(404).json({ error: 'Unknown scale' })
  res.json(fullDefinition(scale))
})

export default router
