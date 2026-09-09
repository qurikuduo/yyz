import { Router } from 'express'
import { listScales, getScale } from '../data/scales/index.js'

const router = Router()

// GET /api/scales — list available schemes (metadata only)
router.get('/', (_req, res) => {
  res.json({ scales: listScales() })
})

// GET /api/scales/:id — full definition needed to render the questionnaire
router.get('/:id', (req, res) => {
  const scale = getScale(req.params.id)
  if (!scale) return res.status(404).json({ error: 'Unknown scale' })
  res.json({
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
    options: scale.options,
    items: scale.items.map((it) => ({
      id: it.id,
      text: it.text,
      domain: it.domain,
      dsm5: it.dsm5 ?? null,
      crisis: Boolean(it.crisis)
    }))
  })
})

export default router
