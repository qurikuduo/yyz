// Scale scoring engine. Dispatches by scale.scoring.type.
//   'sum'      — PHQ-9 / PHQ-2 / CES-D / BDI-II (per-item reverse + optional derived transform for SDS)
//   'criteria' — DSM-5 MDD module (symptom count + core-symptom + gating criteria)

export function scoreScale(scale, answers) {
  const values = alignAnswers(scale, answers)

  switch (scale.scoring.type) {
    case 'sum':
      return scoreSum(scale, values)
    case 'criteria':
      return scoreCriteria(scale, values)
    default:
      throw new Error(`Unsupported scoring type: ${scale.scoring.type}`)
  }
}

/** Map submitted answers onto the scale's item order, validating each value against allowed options. */
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
    const allowed = allowedValues(scale, item)
    if (!Number.isFinite(value) || !allowed.includes(value)) {
      throw Object.assign(
        new Error(`Invalid value ${value} for item ${item.id} (expected one of ${allowed.join(', ')})`),
        { statusCode: 400 }
      )
    }
    return { itemId: item.id, value }
  })
}

/** The set of legal values for an item: its own options if present, else the scale-wide integer range. */
function allowedValues(scale, item) {
  if (item.options && item.options.length) return item.options.map((o) => o.value)
  const [min, max] = itemBounds(scale, item)
  const out = []
  for (let v = min; v <= max; v++) out.push(v)
  return out
}

function itemBounds(scale, item) {
  if (item.options && item.options.length) {
    const vs = item.options.map((o) => o.value)
    return [Math.min(...vs), Math.max(...vs)]
  }
  const min = scale.scoring.perItemMin ?? scale.scoring.itemMin ?? 0
  const max = scale.scoring.perItemMax ?? scale.scoring.itemMax ?? 3
  return [min, max]
}

/** Reverse-scored items contribute (min + max - value). */
function effectiveValue(scale, item, value) {
  if (!item.reverse) return value
  const [min, max] = itemBounds(scale, item)
  return min + max - value
}

function scoreSum(scale, values) {
  const byId = new Map(scale.items.map((i) => [i.id, i]))
  const [minTotal, maxTotal] = scale.scoring.totalRange

  const raw = values.reduce((acc, v) => acc + effectiveValue(scale, byId.get(v.itemId), v.value), 0)

  const d = scale.scoring.derived
  const derived = d ? round(raw * d.factor, d.round === false ? 2 : 0) : null
  const useDerived = Boolean(d && d.bandOn === 'derived')

  const bandValue = useDerived ? derived : raw
  const normRange = useDerived ? d.range : [minTotal, maxTotal]
  const band = findBand(scale, bandValue)
  const crisis = detectCrisis(scale, values)
  const normalized = normalize(bandValue, normRange)

  return {
    scheme: scale.id,
    scoringType: 'sum',
    total: raw,
    minTotal,
    maxTotal,
    derived: derived != null ? { label: d.label, value: derived, range: d.range } : null,
    bandValue,
    normalized: round(normalized, 3),
    severity: band.severity,
    severityLabel: band.label,
    clinicalCutoff: scale.clinicalCutoff ?? null,
    aboveCutoff:
      typeof scale.clinicalCutoff === 'number' ? bandValue >= scale.clinicalCutoff : null,
    crisis,
    itemValues: values
  }
}

function scoreCriteria(scale, values) {
  const valueMap = new Map(values.map((v) => [v.itemId, v.value]))
  const symptoms = scale.items.filter((i) => i.kind === 'symptom')
  const gates = scale.items.filter((i) => i.kind === 'gate')

  const endorsed = symptoms.filter((s) => (valueMap.get(s.id) ?? 0) >= 1)
  const count = endorsed.length
  const maxTotal = symptoms.length || 1

  const coreRequired = scale.scoring.coreRequired || []
  const coreMet = endorsed.some((s) => coreRequired.includes(s.dsm5))
  const threshold = scale.scoring.threshold ?? 5
  const symptomsMet = count >= threshold && coreMet

  const gateResults = gates.map((g) => ({
    itemId: g.id,
    gateKey: g.gateKey,
    text: g.text,
    satisfied: (valueMap.get(g.id) ?? 0) >= 1
  }))
  const gatesMet = gateResults.length ? gateResults.every((g) => g.satisfied) : true

  let level
  if (symptomsMet && gatesMet) level = 'meets'
  else if (symptomsMet && !gatesMet) level = 'symptoms-met-gates-incomplete'
  else if (count >= 3 || (count >= threshold && !coreMet)) level = 'subthreshold'
  else level = 'not-met'

  const band = findBand(scale, count)
  const crisis = detectCrisis(scale, values)
  const normalized = normalize(count, [0, maxTotal])

  return {
    scheme: scale.id,
    scoringType: 'criteria',
    total: count,
    minTotal: 0,
    maxTotal,
    derived: null,
    bandValue: count,
    normalized: round(normalized, 3),
    severity: band.severity,
    severityLabel: band.label,
    clinicalCutoff: threshold,
    aboveCutoff: count >= threshold,
    crisis,
    itemValues: values,
    determination: {
      count,
      threshold,
      coreRequired,
      coreMet,
      symptomsMet,
      gatesMet,
      level,
      gates: gateResults
    }
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

function normalize(value, [min, max]) {
  return max > min ? (value - min) / (max - min) : 0
}

function round(n, digits) {
  const f = 10 ** digits
  return Math.round(n * f) / f
}
