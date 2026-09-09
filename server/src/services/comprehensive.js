// Comprehensive multi-scale synthesis.
// Combines the quantitative scales (PHQ-9, SDS, CES-D, BDI-II) into a reliability-weighted
// integrated severity, computes cross-scale concordance, maps the DSM-5 categorical module,
// aggregates crisis flags, and produces a bilingual integrated narrative with its basis.

const INTEGRATED_BANDS = [
  { max: 0.15, severity: 'minimal', label: { zh: '无 / 极轻度', en: 'Minimal / none' } },
  { max: 0.35, severity: 'mild', label: { zh: '轻度', en: 'Mild' } },
  { max: 0.55, severity: 'moderate', label: { zh: '中度', en: 'Moderate' } },
  { max: 0.75, severity: 'moderately-severe', label: { zh: '中重度', en: 'Moderately severe' } },
  { max: 1.01, severity: 'severe', label: { zh: '重度', en: 'Severe' } }
]

const DSM5_LEVEL = {
  meets: { zh: '符合重性抑郁发作的症状标准', en: 'meets symptom criteria for a major depressive episode' },
  'symptoms-met-gates-incomplete': { zh: '症状数达标但病程/功能损害/排除标准尚未全部满足', en: 'symptom count met but duration/impairment/exclusion criteria are incomplete' },
  subthreshold: { zh: '为阈下抑郁症状', en: 'subthreshold depressive symptoms' },
  'not-met': { zh: '未达到抑郁发作的症状标准', en: 'does not meet symptom criteria for a depressive episode' }
}

const INTEGRATED_ADVICE = {
  minimal: {
    zh: '多量表整合显示当前抑郁严重度很低。保持规律作息、运动与社会联结，继续自我观察。',
    en: 'Multi-scale integration indicates a very low current depression severity. Maintain regular sleep, exercise and social contact, and keep self-monitoring.'
  },
  mild: {
    zh: '多量表整合显示轻度抑郁。建议尝试自助方法（见知识库）并观察 2–4 周；若持续或加重，考虑专业评估。',
    en: 'Integration indicates mild depression. Try self-help strategies (see the knowledge base) and monitor for 2-4 weeks; if persistent or worsening, consider professional evaluation.'
  },
  moderate: {
    zh: '多量表整合显示中度抑郁，建议寻求精神科/心理科专业评估。心理治疗（如 CBT）和/或药物可能有帮助。',
    en: 'Integration indicates moderate depression; professional psychiatric/psychological evaluation is recommended. Psychotherapy (e.g., CBT) and/or medication may help.'
  },
  'moderately-severe': {
    zh: '多量表整合显示中重度抑郁，强烈建议尽快由专业医生评估，通常需要积极治疗。',
    en: 'Integration indicates moderately severe depression; prompt evaluation by a clinician is strongly advised. Active treatment is usually indicated.'
  },
  severe: {
    zh: '多量表整合显示重度抑郁，请尽快就医由精神科医生评估与治疗。若出现自伤/自杀念头，请立即联系危机热线或急诊。',
    en: 'Integration indicates severe depression; seek psychiatric evaluation and treatment promptly. If you have thoughts of self-harm, contact a crisis line or emergency department immediately.'
  }
}

function findIntegratedBand(v) {
  for (const b of INTEGRATED_BANDS) if (v <= b.max) return b
  return INTEGRATED_BANDS[INTEGRATED_BANDS.length - 1]
}

function mean(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
}

function stdev(arr) {
  if (arr.length < 2) return 0
  const m = mean(arr)
  return Math.sqrt(mean(arr.map((x) => (x - m) ** 2)))
}

function round(n, digits) {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

/**
 * @param {Array<{scale:object, score:object, result:object}>} parts per-scale outputs
 */
export function buildComprehensive(parts) {
  const quantitative = parts.filter((p) => p.score.scoringType === 'sum')
  const dsm5Part = parts.find((p) => p.score.scoringType === 'criteria')

  // Reliability-weighted integrated severity across quantitative scales.
  let wSum = 0
  let acc = 0
  const included = []
  for (const p of parts) {
    const w = quantitative.includes(p) ? (p.scale.weight ?? 1) : 0
    if (quantitative.includes(p)) {
      wSum += w
      acc += w * (p.score.normalized ?? 0)
    }
    included.push({
      id: p.scale.id,
      shortName: p.scale.shortName,
      scoringType: p.score.scoringType,
      total: p.score.total,
      maxTotal: p.score.maxTotal,
      derived: p.score.derived ?? null,
      severity: p.score.severity,
      severityLabel: p.score.severityLabel,
      normalized: p.score.normalized,
      weight: quantitative.includes(p) ? round(w, 2) : null,
      determination: p.result.determination ?? null
    })
  }
  const integratedSeverity = wSum ? round(acc / wSum, 3) : 0
  const band = findIntegratedBand(integratedSeverity)

  // Concordance across quantitative scales.
  const norms = quantitative.map((p) => p.score.normalized ?? 0)
  const sd = round(stdev(norms), 3)
  const spread = norms.length ? round(Math.max(...norms) - Math.min(...norms), 3) : 0
  const concordanceLevel = sd < 0.12 ? 'high' : sd < 0.22 ? 'moderate' : 'low'

  // DSM-5 mapping.
  const dsm5 = dsm5Part
    ? {
        level: dsm5Part.score.determination.level,
        count: dsm5Part.score.determination.count,
        threshold: dsm5Part.score.determination.threshold,
        coreMet: dsm5Part.score.determination.coreMet,
        symptomsMet: dsm5Part.score.determination.symptomsMet,
        gatesMet: dsm5Part.score.determination.gatesMet,
        label: DSM5_LEVEL[dsm5Part.score.determination.level] || null,
        gates: dsm5Part.score.determination.gates
      }
    : null

  // Crisis aggregation.
  const crisisScales = parts.filter((p) => p.score.crisis).map((p) => p.scale.shortName)
  const crisis = crisisScales.length > 0

  const advice = INTEGRATED_ADVICE[band.severity]

  const summary = {
    zh: buildSummaryZh({ integratedSeverity, band, quantitative, concordanceLevel, dsm5, crisis, crisisScales, advice }),
    en: buildSummaryEn({ integratedSeverity, band, quantitative, concordanceLevel, dsm5, crisis, crisisScales, advice })
  }

  const basis = {
    zh: buildBasisZh({ parts, quantitative, included, integratedSeverity, band, sd, spread, concordanceLevel, dsm5, crisis, crisisScales }),
    en: buildBasisEn({ parts, quantitative, included, integratedSeverity, band, sd, spread, concordanceLevel, dsm5, crisis, crisisScales })
  }

  return {
    scheme: 'comprehensive',
    schemeName: { zh: '综合评估', en: 'Comprehensive assessment' },
    included,
    integrated: {
      severity: integratedSeverity,
      severityPct: Math.round(integratedSeverity * 100),
      band: band.severity,
      bandLabel: band.label,
      weightsUsed: quantitative.map((p) => ({ id: p.scale.id, weight: round(p.scale.weight ?? 1, 2) }))
    },
    concordance: { level: concordanceLevel, sd, spread, count: quantitative.length },
    dsm5,
    crisis,
    crisisScales,
    advice,
    summary,
    basis
  }
}

const CONCORDANCE_ZH = {
  high: '各量表结论高度一致',
  moderate: '各量表结论基本一致、存在中等差异',
  low: '各量表结论差异较大'
}
const CONCORDANCE_EN = {
  high: 'the scales agree closely',
  moderate: 'the scales broadly agree with moderate divergence',
  low: 'the scales diverge considerably'
}

function scaleScoreText(p, lang) {
  const name = lang === 'zh' ? p.scale.shortName.zh : p.scale.shortName.en
  const val = p.score.derived
    ? lang === 'zh'
      ? `标准分 ${p.score.derived.value}`
      : `standard ${p.score.derived.value}`
    : `${p.score.total}/${p.score.maxTotal}`
  return `${name} ${val}`
}

function buildSummaryZh(d) {
  const pct = Math.round(d.integratedSeverity * 100)
  let s = `综合 ${d.quantitative.length} 个循证量表的加权整合，你的抑郁严重度约为 ${pct}%（0–100%），判定为「${d.band.label.zh}」。`
  s += `跨量表一致性为「${d.concordanceLevel === 'high' ? '高' : d.concordanceLevel === 'moderate' ? '中' : '低'}」——${CONCORDANCE_ZH[d.concordanceLevel]}。`
  if (d.dsm5) {
    s += ` 按 DSM-5 标准：9 项症状中 ${d.dsm5.count} 项达标，${DSM5_LEVEL[d.dsm5.level]?.zh}。`
  }
  if (d.crisis) {
    s += ` 重要：${d.crisisScales.map((n) => n.zh).join('、')} 触发了自伤/自杀意念的危机提示，请务必优先查看危机支持信息并尽快联系专业人士或信任的人。`
  }
  if (d.advice?.zh) s += ` ${d.advice.zh}`
  return s
}

function buildSummaryEn(d) {
  const pct = Math.round(d.integratedSeverity * 100)
  let s = `Integrating ${d.quantitative.length} evidence-based scales (reliability-weighted), your overall depression severity is about ${pct}% (0-100%), classified as "${d.band.label.en}".`
  s += ` Cross-scale concordance is "${d.concordanceLevel}" — ${CONCORDANCE_EN[d.concordanceLevel]}.`
  if (d.dsm5) {
    s += ` By DSM-5 criteria: ${d.dsm5.count} of 9 symptoms are met — ${DSM5_LEVEL[d.dsm5.level]?.en}.`
  }
  if (d.crisis) {
    s += ` Important: ${d.crisisScales.map((n) => n.en).join(', ')} triggered crisis guidance for self-harm/suicidal ideation. Please prioritize the crisis-support information and contact a professional or someone you trust as soon as possible.`
  }
  if (d.advice?.en) s += ` ${d.advice.en}`
  return s
}

function buildBasisZh(d) {
  const basis = []
  basis.push(`整合方法：对 ${d.quantitative.length} 个量化量表（${d.quantitative.map((p) => p.scale.shortName.zh).join('、')}）分别将得分归一化为 0–1 严重度，再按信度权重加权求整合严重度。`)
  basis.push(`各量表得分：${d.included.filter((i) => i.scoringType === 'sum').map((i) => `${i.shortName.zh}${i.derived ? ' 标准分 ' + i.derived.value : ' ' + i.total + '/' + i.maxTotal}（严重度 ${Math.round(i.normalized * 100)}%，权重 ${i.weight}）`).join('；')}。`)
  basis.push(`整合严重度 = ${d.integratedSeverity}（${Math.round(d.integratedSeverity * 100)}%），落在「${d.band.label.zh}」区间。`)
  basis.push(`一致性分析：量化量表归一化严重度的标准差 SD=${d.sd}，极差=${d.spread}；判定为「${CONCORDANCE_ZH[d.concordanceLevel]}」。${d.concordanceLevel === 'low' ? '（差异较大时，建议以临床面评为准，并留意各量表侧重不同。）' : ''}`)
  if (d.dsm5) {
    basis.push(`DSM-5 映射：症状数 ${d.dsm5.count}/9（阈值 ≥${d.dsm5.threshold} 且需含核心症状 A1/A2）；核心症状${d.dsm5.coreMet ? '已具备' : '未具备'}；附加标准${d.dsm5.gatesMet ? '均满足' : '未全部满足'}；结论：${DSM5_LEVEL[d.dsm5.level]?.zh}。`)
  }
  basis.push(
    d.crisis
      ? `安全性：${d.crisisScales.map((n) => n.zh).join('、')} 的自杀意念条目为阳性，已触发危机提示，此为最高优先级。`
      : '安全性：所有量表的自杀意念条目均为阴性。'
  )
  basis.push('性质说明：综合评估整合多量表信息以提高稳健性，但仍为筛查/自评参考，非临床诊断；正式诊断需由合格专业人员面评作出。')
  return basis
}

function buildBasisEn(d) {
  const basis = []
  basis.push(`Method: each of the ${d.quantitative.length} quantitative scales (${d.quantitative.map((p) => p.scale.shortName.en).join(', ')}) is normalized to a 0-1 severity, then combined into an integrated severity using reliability weights.`)
  basis.push(`Scale scores: ${d.included.filter((i) => i.scoringType === 'sum').map((i) => `${i.shortName.en}${i.derived ? ' standard ' + i.derived.value : ' ' + i.total + '/' + i.maxTotal} (severity ${Math.round(i.normalized * 100)}%, weight ${i.weight})`).join('; ')}.`)
  basis.push(`Integrated severity = ${d.integratedSeverity} (${Math.round(d.integratedSeverity * 100)}%), in the "${d.band.label.en}" band.`)
  basis.push(`Concordance: SD of normalized severities = ${d.sd}, spread = ${d.spread}; judged as "${CONCORDANCE_EN[d.concordanceLevel]}".${d.concordanceLevel === 'low' ? ' (When divergence is large, defer to in-person clinical evaluation; note each scale emphasizes different facets.)' : ''}`)
  if (d.dsm5) {
    basis.push(`DSM-5 mapping: ${d.dsm5.count}/9 symptoms (threshold >=${d.dsm5.threshold} plus a core symptom A1/A2); core symptom ${d.dsm5.coreMet ? 'present' : 'absent'}; additional criteria ${d.dsm5.gatesMet ? 'all satisfied' : 'not all satisfied'}; conclusion: ${DSM5_LEVEL[d.dsm5.level]?.en}.`)
  }
  basis.push(
    d.crisis
      ? `Safety: the suicidal-ideation item is positive on ${d.crisisScales.map((n) => n.en).join(', ')}, triggering crisis guidance — the highest priority.`
      : 'Safety: the suicidal-ideation items are negative across all scales.'
  )
  basis.push('Nature: the comprehensive assessment integrates multiple scales for robustness but remains a screening/self-report reference, not a clinical diagnosis; a formal diagnosis requires in-person evaluation by a qualified professional.')
  return basis
}
