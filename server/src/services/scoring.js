// Scale scoring engine. Dispatches by scale.scoring.type.
// Currently supports 'sum' (PHQ-9, and later PHQ-2/CES-D/BDI-II).
// 'reverse-sum' (SDS) and 'criteria' (DSM-5) are added in M3.

export function scoreScale(scale, answers) {
  const values = alignAnswers(scale, answers)

  switch (scale.scoring.type) {
    case 'sum':
      return scoreSum(scale, values)
    default:
      throw new Error(`Unsupported scoring type: ${scale.scoring.type}`)
  }
}

/** Map submitted answers onto the scale's item order, validating each value. */
function alignAnswers(scale, answers) {
  const answerMap = new Map()
  for (const a of answers || []) {
    answerMap.set(a.itemId, a.value)
  }
  return scale.items.map((item) => {
    if (!answerMap.has(item.id)) {
      throw Object.assign(new Error(`Missing answer for item ${item.id}`), { statusCode: 400 })
    }
    const value = Number(answerMap.get(item.id))
    const min = scale.scoring.perItemMin ?? scale.scoring.itemMin
    const max = scale.scoring.perItemMax ?? scale.scoring.itemMax
    if (!Number.isFinite(value) || value < min || value > max) {
      throw Object.assign(
        new Error(`Invalid value ${value} for item ${item.id} (expected ${min}-${max})`),
        { statusCode: 400 }
      )
    }
    return { itemId: item.id, value }
  })
}

function scoreSum(scale, values) {
  const total = values.reduce((acc, v) => acc + v.value, 0)
  const [minTotal, maxTotal] = scale.scoring.totalRange
  const band = findBand(scale, total)
  const crisis = detectCrisis(scale, values)
  const normalized = maxTotal > minTotal ? (total - minTotal) / (maxTotal - minTotal) : 0

  return {
    scheme: scale.id,
    scoringType: scale.scoring.type,
    total,
    minTotal,
    maxTotal,
    normalized: round(normalized, 3),
    severity: band.severity,
    severityLabel: band.label,
    clinicalCutoff: scale.clinicalCutoff ?? null,
    aboveCutoff:
      typeof scale.clinicalCutoff === 'number' ? total >= scale.clinicalCutoff : null,
    crisis,
    itemValues: values
  }
}

function findBand(scale, total) {
  const bands = scale.bands || []
  for (const b of bands) {
    if (typeof b.max === 'number' && total <= b.max) return b
    if (typeof b.min === 'number' && typeof b.max === 'number' && total >= b.min && total <= b.max)
      return b
  }
  return bands[bands.length - 1] || { severity: 'unknown', label: { zh: '未知', en: 'Unknown' } }
}

/** Crisis is triggered when any item flagged `crisis` is endorsed (value >= 1). */
function detectCrisis(scale, values) {
  const crisisItems = scale.items.filter((i) => i.crisis)
  if (!crisisItems.length) return false
  const valueMap = new Map(values.map((v) => [v.itemId, v.value]))
  return crisisItems.some((item) => (valueMap.get(item.id) ?? 0) >= 1)
}

function round(n, digits) {
  const f = 10 ** digits
  return Math.round(n * f) / f
}
