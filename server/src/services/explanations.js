// Builds the full, bilingual result payload: per-item explanation + answer analysis,
// severity summary, personalized advice, and the evidence/basis for the judgement.
// Handles sum scales (incl. reverse scoring + SDS derived standard score) and the
// DSM-5 criteria module (symptom count + gating determination).

const DEFAULT_NOTABLE_THRESHOLD = 2 // "more than half the days" or higher = clinically notable per item

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

// DSM-5 determination level → bilingual headline.
const DETERMINATION_LABELS = {
  meets: {
    zh: '符合重性抑郁发作的症状标准',
    en: 'Meets symptom criteria for a major depressive episode'
  },
  'symptoms-met-gates-incomplete': {
    zh: '症状数达标，但病程/功能损害/排除等标准尚未全部满足',
    en: 'Symptom count met, but duration/impairment/exclusion criteria are not all satisfied'
  },
  subthreshold: {
    zh: '阈下抑郁症状（未达完整发作标准）',
    en: 'Subthreshold depressive symptoms (below full-episode criteria)'
  },
  'not-met': {
    zh: '未达到抑郁发作的症状标准',
    en: 'Does not meet symptom criteria for a depressive episode'
  }
}

function itemBounds(scale, item) {
  if (item.options && item.options.length) {
    const vs = item.options.map((o) => o.value)
    return [Math.min(...vs), Math.max(...vs)]
  }
  const min = scale.scoring.perItemMin ?? 0
  const max = scale.scoring.perItemMax ?? 3
  return [min, max]
}

function contribution(scale, item, value) {
  if (!item.reverse) return value
  const [min, max] = itemBounds(scale, item)
  return min + max - value
}

export function buildResult(scale, score, intake = {}) {
  const valueMap = new Map(score.itemValues.map((v) => [v.itemId, v.value]))
  const scaleOptionMap = new Map((scale.options || []).map((o) => [o.value, o]))
  const notableThreshold = scale.notableThreshold ?? DEFAULT_NOTABLE_THRESHOLD

  const items = scale.items.map((item, index) => {
    const value = valueMap.get(item.id) ?? 0
    const optionMap = item.options && item.options.length
      ? new Map(item.options.map((o) => [o.value, o]))
      : scaleOptionMap
    const option = optionMap.get(value)
    const crisisEndorsed = Boolean(item.crisis) && value >= 1
    const isGate = item.kind === 'gate'
    const notable = !isGate && value >= notableThreshold
    return {
      itemId: item.id,
      index: index + 1,
      text: item.text,
      domain: item.domain,
      dsm5: item.dsm5 ?? null,
      kind: item.kind ?? 'item',
      reverse: Boolean(item.reverse),
      explanation: item.explanation,
      selectedValue: value,
      selectedLabel: option ? option.label : null,
      selectedMeaning: option ? option.meaning : null,
      scoreContribution: isGate ? value : contribution(scale, item, value),
      isCrisisItem: Boolean(item.crisis),
      crisisEndorsed,
      gateSatisfied: isGate ? value >= 1 : null,
      notable
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
    scoringType: score.scoringType,
    total: score.total,
    maxTotal: score.maxTotal,
    minTotal: score.minTotal,
    derived: score.derived ?? null,
    normalized: score.normalized,
    severity: score.severity,
    severityLabel: score.severityLabel,
    clinicalCutoff: score.clinicalCutoff,
    aboveCutoff: score.aboveCutoff,
    determination: score.determination
      ? {
          ...score.determination,
          label: DETERMINATION_LABELS[score.determination.level] || null
        }
      : null,
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

function scoreDisplay(score, lang) {
  // SDS shows the derived standard score alongside the raw score.
  if (score.derived) {
    return lang === 'zh'
      ? `粗分 ${score.total}（标准分 ${score.derived.value}）`
      : `raw ${score.total} (standard score ${score.derived.value})`
  }
  return `${score.total}`
}

function buildSummaryZh(scale, score, notableItems, advice) {
  const name = scale.shortName?.zh || scale.name.zh

  if (score.scoringType === 'criteria') {
    const det = score.determination
    const label = DETERMINATION_LABELS[det.level]?.zh || ''
    let s = `${name} 评估：9 项症状标准中有 ${det.count} 项在过去两周内达到「几乎每天」级别，${label}。`
    s += det.coreMet
      ? ' 核心症状（心境低落或兴趣/愉悦缺失）至少具备其一。'
      : ' 但缺少核心症状（心境低落或兴趣/愉悦缺失），这是诊断的必要条件之一。'
    if (det.gates && det.gates.length) {
      const unsatisfied = det.gates.filter((g) => !g.satisfied)
      s += unsatisfied.length
        ? ` 有 ${unsatisfied.length} 项附加标准（病程/功能损害/排除等）未满足，需专业澄清。`
        : ' 病程、功能损害及排除标准均已满足。'
    }
    if (score.crisis) {
      s += ' 重要：你在与自杀意念相关的条目上为阳性，请务必优先查看下方的危机支持信息，并尽快联系专业人士或信任的人。'
    }
    if (advice?.zh) s += ` ${advice.zh}`
    return s
  }

  let s = `你的 ${name} 得分为 ${scoreDisplay(score, 'zh')}，满分 ${score.maxTotal}（严重度约 ${severityPct(score)}%），落在「${score.severityLabel.zh}」范围。`
  if (typeof score.clinicalCutoff === 'number') {
    const cutoffValue = score.derived ? `${score.clinicalCutoff}（标准分）` : `${score.clinicalCutoff}`
    s += score.aboveCutoff
      ? ` 已达到临床参考切点（≥${cutoffValue}），提示可能存在具有临床意义的抑郁症状。`
      : ` 低于临床参考切点（${cutoffValue}），当前未提示明显的临床抑郁水平。`
  }
  if (notableItems.length) {
    s += ` 其中有 ${notableItems.length} 个条目达到较高频率/强度，为主要困扰来源。`
  }
  if (score.crisis) {
    s += ' 重要：你在与自伤/自杀意念相关的条目上为阳性，请务必优先查看下方的危机支持信息，并尽快联系专业人士或信任的人。'
  }
  if (advice?.zh) s += ` ${advice.zh}`
  return s
}

function buildSummaryEn(scale, score, notableItems, advice) {
  const name = scale.shortName?.en || scale.name.en

  if (score.scoringType === 'criteria') {
    const det = score.determination
    const label = DETERMINATION_LABELS[det.level]?.en || ''
    let s = `${name}: ${det.count} of the 9 symptom criteria were present at the "nearly every day" level over the past two weeks — ${label}.`
    s += det.coreMet
      ? ' At least one core symptom (depressed mood or loss of interest/pleasure) is present.'
      : ' However, no core symptom (depressed mood or loss of interest/pleasure) is present, which is a necessary condition for diagnosis.'
    if (det.gates && det.gates.length) {
      const unsatisfied = det.gates.filter((g) => !g.satisfied)
      s += unsatisfied.length
        ? ` ${unsatisfied.length} additional criterion/criteria (duration/impairment/exclusion) are not satisfied and need professional clarification.`
        : ' Duration, functional-impairment and exclusion criteria are all satisfied.'
    }
    if (score.crisis) {
      s += ' Important: you endorsed the item related to suicidal thoughts. Please prioritize the crisis-support information below and contact a professional or someone you trust as soon as possible.'
    }
    if (advice?.en) s += ` ${advice.en}`
    return s
  }

  let s = `Your ${name} score is ${scoreDisplay(score, 'en')} out of ${score.maxTotal} (~${severityPct(score)}% severity), which falls in the "${score.severityLabel.en}" range.`
  if (typeof score.clinicalCutoff === 'number') {
    const cutoffValue = score.derived ? `${score.clinicalCutoff} (standard score)` : `${score.clinicalCutoff}`
    s += score.aboveCutoff
      ? ` It meets the clinical reference cutoff (>=${cutoffValue}), indicating possible clinically significant depressive symptoms.`
      : ` It is below the clinical reference cutoff (${cutoffValue}), not indicating a clinically significant depression level at this time.`
  }
  if (notableItems.length) {
    s += ` ${notableItems.length} item(s) reached a higher frequency/intensity and are the main sources of distress.`
  }
  if (score.crisis) {
    s += ' Important: you endorsed the item related to self-harm/suicidal thoughts. Please prioritize the crisis-support information below and contact a professional or someone you trust as soon as possible.'
  }
  if (advice?.en) s += ` ${advice.en}`
  return s
}

function buildBasisZh(scale, score, items, notableItems, intake) {
  const basis = []

  if (score.scoringType === 'criteria') {
    const det = score.determination
    basis.push(`计分方式：${scale.name.zh}，统计在过去两周内达到「几乎每天」的症状条目数（0–9）。`)
    basis.push(`本次症状数 ${det.count} / ${score.maxTotal}，诊断阈值为 ≥${det.threshold} 项且至少含一项核心症状。`)
    basis.push(`核心症状（A1 心境低落 / A2 兴趣缺失）：${det.coreMet ? '至少具备其一' : '均不具备'}。`)
    if (det.gates && det.gates.length) {
      basis.push(
        `附加标准：${det.gates.map((g) => `${g.text.zh}=${g.satisfied ? '满足' : '未满足'}`).join('；')}。`
      )
    }
    basis.push(`结构化判定：${DETERMINATION_LABELS[det.level]?.zh}。`)
    basis.push(
      score.crisis
        ? '安全性：自杀意念条目（A9）为阳性，已触发危机提示，此为最高优先级关注点。'
        : '安全性：自杀意念条目（A9）为阴性。'
    )
    const ctx = intakeContextZh(intake)
    if (ctx) basis.push(`个人背景（供解读参考，不改变标准）：${ctx}。`)
    basis.push('性质说明：本模块为 DSM-5 症状自评，非临床诊断；正式诊断需由合格专业人员面评作出。')
    basis.push(`标准出处：${scale.reference}`)
    return basis
  }

  if (score.derived) {
    basis.push(
      `计分方式：${scale.name.zh}，20 题各 1–4 分（含反向计分题），粗分范围 ${score.minTotal}–${score.maxTotal}；标准分 = 粗分 × ${scale.scoring.derived.factor}。`
    )
    basis.push(`本次粗分 ${score.total}，标准分 ${score.derived.value}，依据标准分切点判定为「${score.severityLabel.zh}」。`)
  } else {
    basis.push(`计分方式：${scale.name.zh}，各条目得分相加${items.some((i) => i.reverse) ? '（含反向计分题）' : ''}，总分范围 ${score.minTotal}–${score.maxTotal}。`)
    basis.push(`本次总分 ${score.total}，依据标准切点判定为「${score.severityLabel.zh}」。`)
  }
  if (typeof score.clinicalCutoff === 'number') {
    basis.push(`临床参考切点为 ${score.clinicalCutoff}${score.derived ? '（标准分）' : ''}：${score.aboveCutoff ? '已达到，提示需专业关注' : '未达到'}。`)
  }
  const core = items.filter((i) => i.dsm5 === 'A1' || i.dsm5 === 'A2')
  const corePositive = core.filter((i) => i.notable)
  if (core.length) {
    basis.push(
      `核心症状（心境低落 / 兴趣缺失）：${corePositive.length ? '至少一项达阳性频率，符合抑郁发作的核心特征' : '均未达阳性频率'}。`
    )
  }
  if (notableItems.length) {
    basis.push(`达到较高频率/强度的条目：${notableItems.map((i) => i.domain.zh).join('、')}。`)
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

  if (score.scoringType === 'criteria') {
    const det = score.determination
    basis.push(`Scoring: ${scale.name.en}; counts symptom criteria present at the "nearly every day" level over the past two weeks (0-9).`)
    basis.push(`This assessment: ${det.count} / ${score.maxTotal} symptoms; the diagnostic threshold is >=${det.threshold} plus at least one core symptom.`)
    basis.push(`Core symptoms (A1 depressed mood / A2 anhedonia): ${det.coreMet ? 'at least one present' : 'none present'}.`)
    if (det.gates && det.gates.length) {
      basis.push(
        `Additional criteria: ${det.gates.map((g) => `${g.text.en}=${g.satisfied ? 'satisfied' : 'not satisfied'}`).join('; ')}.`
      )
    }
    basis.push(`Structured determination: ${DETERMINATION_LABELS[det.level]?.en}.`)
    basis.push(
      score.crisis
        ? 'Safety: the suicidal-ideation criterion (A9) is positive, triggering crisis guidance — the highest-priority concern.'
        : 'Safety: the suicidal-ideation criterion (A9) is negative.'
    )
    const ctx = intakeContextEn(intake)
    if (ctx) basis.push(`Personal context (for interpretation only; criteria unchanged): ${ctx}.`)
    basis.push('Nature: this DSM-5 symptom self-check is not a clinical diagnosis; a formal diagnosis requires in-person evaluation by a qualified professional.')
    basis.push(`Source: ${scale.reference}`)
    return basis
  }

  if (score.derived) {
    basis.push(
      `Scoring: ${scale.name.en}; 20 items scored 1-4 (some reverse-scored), raw range ${score.minTotal}-${score.maxTotal}; standard score = raw x ${scale.scoring.derived.factor}.`
    )
    basis.push(`This assessment: raw ${score.total}, standard score ${score.derived.value}, classified as "${score.severityLabel.en}" per standard-score cutoffs.`)
  } else {
    basis.push(`Scoring: ${scale.name.en}; item scores are summed${items.some((i) => i.reverse) ? ' (some reverse-scored)' : ''}, total range ${score.minTotal}-${score.maxTotal}.`)
    basis.push(`Total score ${score.total}, classified as "${score.severityLabel.en}" per standard cutoffs.`)
  }
  if (typeof score.clinicalCutoff === 'number') {
    basis.push(`Clinical reference cutoff ${score.clinicalCutoff}${score.derived ? ' (standard score)' : ''}: ${score.aboveCutoff ? 'reached, indicating need for professional attention' : 'not reached'}.`)
  }
  const core = items.filter((i) => i.dsm5 === 'A1' || i.dsm5 === 'A2')
  const corePositive = core.filter((i) => i.notable)
  if (core.length) {
    basis.push(
      `Core symptoms (depressed mood / anhedonia): ${corePositive.length ? 'at least one at positive frequency, consistent with the core features of a depressive episode' : 'none at positive frequency'}.`
    )
  }
  if (notableItems.length) {
    basis.push(`Items at higher frequency/intensity: ${notableItems.map((i) => i.domain.en).join(', ')}.`)
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
