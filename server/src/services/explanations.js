// Builds the full, bilingual result payload: per-item explanation + answer analysis,
// severity summary, personalized advice, and the evidence/basis for the judgement.

const POSITIVE_THRESHOLD = 2 // "more than half the days" or higher = clinically notable per item

// Map intake enum codes to human-readable bilingual labels.
const INTAKE_LABELS = {
  gender: {
    male: { zh: '男', en: 'male' },
    female: { zh: '女', en: 'female' },
    other: { zh: '其他/不愿透露', en: 'other/prefer not to say' }
  },
  episodeDuration: {
    '<2w': { zh: '少于 2 周', en: 'less than 2 weeks' },
    '2w-1m': { zh: '2 周–1 个月', en: '2 weeks to 1 month' },
    '1-3m': { zh: '1–3 个月', en: '1 to 3 months' },
    '3-12m': { zh: '3–12 个月', en: '3 to 12 months' },
    '>1y': { zh: '超过 1 年', en: 'more than 1 year' }
  },
  treatmentHistory: {
    none: { zh: '从未就诊/治疗', en: 'never sought treatment' },
    therapy: { zh: '做过心理咨询/治疗', en: 'had psychotherapy/counseling' },
    meds: { zh: '服用过抗抑郁药物', en: 'took antidepressants' },
    both: { zh: '心理治疗+药物均有过', en: 'both therapy and medication' },
    hospital: { zh: '曾因情绪问题住院', en: 'hospitalized for mood problems' }
  },
  education: {
    middle: { zh: '初中及以下', en: 'middle school or below' },
    high: { zh: '高中/中专', en: 'high school' },
    college: { zh: '大专/本科', en: 'college/bachelor' },
    postgrad: { zh: '硕士及以上', en: 'master or above' }
  },
  occupation: {
    student: { zh: '学生', en: 'student' },
    employed: { zh: '在职', en: 'employed' },
    freelance: { zh: '自由职业', en: 'freelance' },
    retired: { zh: '退休', en: 'retired' },
    unemployed: { zh: '待业/无业', en: 'unemployed' }
  }
}

function labelOf(field, value, lang) {
  if (value == null || value === '') return null
  const entry = INTAKE_LABELS[field]?.[value]
  if (entry) return entry[lang]
  return String(value)
}

export function buildResult(scale, score, intake = {}) {
  const valueMap = new Map(score.itemValues.map((v) => [v.itemId, v.value]))
  const optionMap = new Map((scale.options || []).map((o) => [o.value, o]))

  const items = scale.items.map((item, index) => {
    const value = valueMap.get(item.id) ?? 0
    const option = optionMap.get(value)
    const crisisEndorsed = Boolean(item.crisis) && value >= 1
    return {
      itemId: item.id,
      index: index + 1,
      text: item.text,
      domain: item.domain,
      dsm5: item.dsm5 ?? null,
      explanation: item.explanation,
      selectedValue: value,
      selectedLabel: option ? option.label : null,
      selectedMeaning: option ? option.meaning : null,
      scoreContribution: value,
      isCrisisItem: Boolean(item.crisis),
      crisisEndorsed,
      notable: value >= POSITIVE_THRESHOLD
    }
  })

  const notableItems = items.filter((i) => i.notable)
  const advice = (scale.bandAdvice && scale.bandAdvice[score.severity]) || null

  const summary = {
    zh: buildSummaryZh(scale, score, notableItems, advice),
    en: buildSummaryEn(scale, score, notableItems, advice)
  }

  const basis = {
    zh: buildBasisZh(scale, score, items, notableItems, intake),
    en: buildBasisEn(scale, score, items, notableItems, intake)
  }

  return {
    scheme: scale.id,
    schemeName: scale.name,
    total: score.total,
    maxTotal: score.maxTotal,
    minTotal: score.minTotal,
    normalized: score.normalized,
    severity: score.severity,
    severityLabel: score.severityLabel,
    clinicalCutoff: score.clinicalCutoff,
    aboveCutoff: score.aboveCutoff,
    crisis: score.crisis,
    advice,
    summary,
    basis,
    notableCount: notableItems.length,
    items
  }
}

function severityPct(score) {
  return Math.round(score.normalized * 100)
}

function buildSummaryZh(scale, score, notableItems, advice) {
  const name = scale.shortName?.zh || scale.name.zh
  let s = `你的 ${name} 总分为 ${score.total} / ${score.maxTotal}（严重度约 ${severityPct(score)}%），落在「${score.severityLabel.zh}」范围。`
  if (typeof score.clinicalCutoff === 'number') {
    s += score.aboveCutoff
      ? ` 总分已达到临床参考切点（≥${score.clinicalCutoff}），提示可能存在具有临床意义的抑郁症状。`
      : ` 总分低于临床参考切点（${score.clinicalCutoff}），当前未提示明显的临床抑郁水平。`
  }
  if (notableItems.length) {
    s += ` 其中有 ${notableItems.length} 个条目达到「超过一半天数」及以上频率，为主要困扰来源。`
  }
  if (score.crisis) {
    s += ' 重要：你在与自伤/自杀意念相关的条目上为阳性，请务必优先查看下方的危机支持信息，并尽快联系专业人士或信任的人。'
  }
  if (advice?.zh) s += ` ${advice.zh}`
  return s
}

function buildSummaryEn(scale, score, notableItems, advice) {
  const name = scale.shortName?.en || scale.name.en
  let s = `Your ${name} total score is ${score.total} / ${score.maxTotal} (~${severityPct(score)}% severity), which falls in the "${score.severityLabel.en}" range.`
  if (typeof score.clinicalCutoff === 'number') {
    s += score.aboveCutoff
      ? ` The score meets the clinical reference cutoff (>=${score.clinicalCutoff}), indicating possible clinically significant depressive symptoms.`
      : ` The score is below the clinical reference cutoff (${score.clinicalCutoff}), not indicating a clinically significant depression level at this time.`
  }
  if (notableItems.length) {
    s += ` ${notableItems.length} item(s) reached "more than half the days" or higher and are the main sources of distress.`
  }
  if (score.crisis) {
    s += ' Important: you endorsed the item related to self-harm/suicidal thoughts. Please prioritize the crisis-support information below and contact a professional or someone you trust as soon as possible.'
  }
  if (advice?.en) s += ` ${advice.en}`
  return s
}

function buildBasisZh(scale, score, items, notableItems, intake) {
  const basis = []
  basis.push(`计分方式：${scale.name.zh}，各条目得分相加，总分范围 ${score.minTotal}–${score.maxTotal}。`)
  basis.push(`本次总分 ${score.total}，依据标准切点判定为「${score.severityLabel.zh}」。`)
  if (typeof score.clinicalCutoff === 'number') {
    basis.push(`临床参考切点为 ${score.clinicalCutoff}：${score.aboveCutoff ? '已达到，提示需专业关注' : '未达到'}。`)
  }
  const core = items.filter((i) => i.dsm5 === 'A1' || i.dsm5 === 'A2')
  const corePositive = core.filter((i) => i.notable)
  if (core.length) {
    basis.push(
      `核心症状（心境低落 / 兴趣缺失）：${corePositive.length ? '至少一项达阳性频率，符合抑郁发作的核心特征' : '均未达阳性频率'}。`
    )
  }
  if (notableItems.length) {
    basis.push(`达到阳性频率的条目：${notableItems.map((i) => i.domain.zh).join('、')}。`)
  }
  basis.push(
    score.crisis
      ? '安全性：自伤/自杀意念条目为阳性，已触发危机提示，此为最高优先级关注点。'
      : '安全性：自伤/自杀意念条目为阴性。'
  )
  const ctx = intakeContextZh(intake)
  if (ctx) basis.push(`个人背景（供解读参考，不改变切点）：${ctx}。`)
  basis.push('性质说明：本结果为筛查/自评参考，非临床诊断；正式诊断需由合格专业人员面评作出。')
  basis.push(`量表出处：${scale.reference}`)
  return basis
}

function buildBasisEn(scale, score, items, notableItems, intake) {
  const basis = []
  basis.push(`Scoring: ${scale.name.en}; item scores are summed, total range ${score.minTotal}-${score.maxTotal}.`)
  basis.push(`Total score ${score.total}, classified as "${score.severityLabel.en}" per standard cutoffs.`)
  if (typeof score.clinicalCutoff === 'number') {
    basis.push(`Clinical reference cutoff ${score.clinicalCutoff}: ${score.aboveCutoff ? 'reached, indicating need for professional attention' : 'not reached'}.`)
  }
  const core = items.filter((i) => i.dsm5 === 'A1' || i.dsm5 === 'A2')
  const corePositive = core.filter((i) => i.notable)
  if (core.length) {
    basis.push(
      `Core symptoms (depressed mood / anhedonia): ${corePositive.length ? 'at least one at positive frequency, consistent with the core features of a depressive episode' : 'none at positive frequency'}.`
    )
  }
  if (notableItems.length) {
    basis.push(`Items at positive frequency: ${notableItems.map((i) => i.domain.en).join(', ')}.`)
  }
  basis.push(
    score.crisis
      ? 'Safety: the self-harm/suicidal-ideation item is positive, triggering crisis guidance — the highest-priority concern.'
      : 'Safety: the self-harm/suicidal-ideation item is negative.'
  )
  const ctx = intakeContextEn(intake)
  if (ctx) basis.push(`Personal context (for interpretation only; cutoffs unchanged): ${ctx}.`)
  basis.push('Nature: this is a screening/self-report reference, not a clinical diagnosis; a formal diagnosis requires in-person evaluation by a qualified professional.')
  basis.push(`Source: ${scale.reference}`)
  return basis
}

function intakeContextZh(intake) {
  const parts = []
  if (intake.age != null && intake.age !== '') parts.push(`年龄 ${intake.age}`)
  const g = labelOf('gender', intake.gender, 'zh'); if (g) parts.push(`性别 ${g}`)
  const d = labelOf('episodeDuration', intake.episodeDuration, 'zh'); if (d) parts.push(`病程 ${d}`)
  const th = labelOf('treatmentHistory', intake.treatmentHistory, 'zh'); if (th) parts.push(`治疗史 ${th}`)
  const e = labelOf('education', intake.education, 'zh'); if (e) parts.push(`教育 ${e}`)
  const o = labelOf('occupation', intake.occupation, 'zh'); if (o) parts.push(`职业 ${o}`)
  return parts.join('，')
}

function intakeContextEn(intake) {
  const parts = []
  if (intake.age != null && intake.age !== '') parts.push(`age ${intake.age}`)
  const g = labelOf('gender', intake.gender, 'en'); if (g) parts.push(`gender ${g}`)
  const d = labelOf('episodeDuration', intake.episodeDuration, 'en'); if (d) parts.push(`duration ${d}`)
  const th = labelOf('treatmentHistory', intake.treatmentHistory, 'en'); if (th) parts.push(`treatment ${th}`)
  const e = labelOf('education', intake.education, 'en'); if (e) parts.push(`education ${e}`)
  const o = labelOf('occupation', intake.occupation, 'en'); if (o) parts.push(`occupation ${o}`)
  return parts.join(', ')
}
