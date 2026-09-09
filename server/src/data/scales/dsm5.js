// DSM-5 Major Depressive Disorder (MDD) symptom module.
// Reference: American Psychiatric Association. Diagnostic and Statistical Manual of Mental
// Disorders, 5th ed. (DSM-5). 2013. Criterion A for a major depressive episode.
// 9 symptom criteria (A1-A9), each endorsed if present nearly every day during the same
// 2-week period. Diagnosis requires >=5 symptoms INCLUDING at least one core symptom
// (A1 depressed mood or A2 anhedonia), plus gating criteria B/C/D/E (duration, impairment,
// exclusion of substance/medical causes, and no manic/hypomanic episode).
// A9 (suicidal ideation) is the crisis criterion.

const symptomOptions = [
  { value: 0, label: { zh: '没有 / 未达到「几乎每天」', en: 'No / not nearly every day' }, meaning: { zh: '该症状在过去两周未达到「几乎每天、大部分时间」的强度，不计入症状数。', en: 'This symptom did not reach the "nearly every day, most of the day" level over the past two weeks; it does not count toward the symptom total.' } },
  { value: 1, label: { zh: '是，过去两周几乎每天', en: 'Yes, nearly every day for the past two weeks' }, meaning: { zh: '该症状在过去两周几乎每天、大部分时间存在，计入症状数（+1）。', en: 'This symptom was present nearly every day, most of the day, over the past two weeks; it counts toward the symptom total (+1).' } }
]

const items = [
  {
    id: 'dsm5-a1', kind: 'symptom', dsm5: 'A1',
    text: { zh: '几乎每天大部分时间都情绪低落、抑郁或感到绝望（主观报告或他人观察到）', en: 'Depressed mood most of the day, nearly every day (subjective report or observed by others)' },
    domain: { zh: '抑郁心境（核心）', en: 'Depressed mood (core)' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A 的核心症状之一。诊断抑郁发作必须具备 A1 或 A2 中的至少一项。', en: 'A core DSM-5 criterion A symptom. A diagnosis requires at least one of A1 or A2.' }
  },
  {
    id: 'dsm5-a2', kind: 'symptom', dsm5: 'A2',
    text: { zh: '几乎每天对几乎所有活动的兴趣或愉悦感明显减退', en: 'Markedly diminished interest or pleasure in all, or almost all, activities most of the day, nearly every day' },
    domain: { zh: '兴趣/愉悦缺失（核心）', en: 'Anhedonia (core)' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A 的另一核心症状（快感缺乏）。与 A1 共同构成诊断的必备症状对。', en: 'The other core DSM-5 criterion A symptom (anhedonia). Together with A1 it forms the mandatory symptom pair.' }
  },
  {
    id: 'dsm5-a3', kind: 'symptom', dsm5: 'A3',
    text: { zh: '在未刻意节食/运动的情况下，体重明显下降或增加，或食欲几乎每天显著减退或增加', en: 'Significant weight loss when not dieting, weight gain, or decrease/increase in appetite nearly every day' },
    domain: { zh: '食欲/体重改变', en: 'Appetite/weight change' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A3：显著的体重或食欲改变（可为增加或减少）。', en: 'DSM-5 criterion A3: significant weight or appetite change (increase or decrease).' }
  },
  {
    id: 'dsm5-a4', kind: 'symptom', dsm5: 'A4',
    text: { zh: '几乎每天失眠或嗜睡', en: 'Insomnia or hypersomnia nearly every day' },
    domain: { zh: '睡眠紊乱', en: 'Sleep disturbance' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A4：睡眠紊乱，既可为失眠也可为嗜睡。', en: 'DSM-5 criterion A4: sleep disturbance, either insomnia or hypersomnia.' }
  },
  {
    id: 'dsm5-a5', kind: 'symptom', dsm5: 'A5',
    text: { zh: '几乎每天精神运动性激越或迟滞（他人可观察到，而非仅主观感受）', en: 'Psychomotor agitation or retardation nearly every day (observable by others, not merely subjective)' },
    domain: { zh: '精神运动性改变', en: 'Psychomotor change' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A5：精神运动性激越或迟滞，需可被他人观察。', en: 'DSM-5 criterion A5: psychomotor agitation or retardation, observable by others.' }
  },
  {
    id: 'dsm5-a6', kind: 'symptom', dsm5: 'A6',
    text: { zh: '几乎每天疲乏或精力丧失', en: 'Fatigue or loss of energy nearly every day' },
    domain: { zh: '疲劳/精力丧失', en: 'Fatigue/loss of energy' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A6：疲劳或精力丧失。', en: 'DSM-5 criterion A6: fatigue or loss of energy.' }
  },
  {
    id: 'dsm5-a7', kind: 'symptom', dsm5: 'A7',
    text: { zh: '几乎每天感到自己无价值，或有过度的、不恰当的内疚/自责', en: 'Feelings of worthlessness or excessive/inappropriate guilt nearly every day' },
    domain: { zh: '无价值感/过度自责', en: 'Worthlessness/excessive guilt' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A7：无价值感或过度/不恰当的内疚。', en: 'DSM-5 criterion A7: worthlessness or excessive/inappropriate guilt.' }
  },
  {
    id: 'dsm5-a8', kind: 'symptom', dsm5: 'A8',
    text: { zh: '几乎每天思考或注意力减退，或犹豫不决', en: 'Diminished ability to think or concentrate, or indecisiveness, nearly every day' },
    domain: { zh: '注意力/决策减退', en: 'Diminished concentration/indecisiveness' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A8：思维/注意力减退或犹豫不决。', en: 'DSM-5 criterion A8: diminished ability to think/concentrate or indecisiveness.' }
  },
  {
    id: 'dsm5-a9', kind: 'symptom', dsm5: 'A9', crisis: true,
    text: { zh: '反复出现死亡念头、自杀意念（无论是否有计划），或有自杀企图', en: 'Recurrent thoughts of death, recurrent suicidal ideation (with or without a plan), or a suicide attempt' },
    domain: { zh: '自杀意念/企图', en: 'Suicidal ideation/attempt' },
    options: symptomOptions,
    explanation: { zh: 'DSM-5 标准 A9，也是最关键的安全性条目。只要为阳性，无论其他标准如何，都会触发危机干预提示。', en: 'DSM-5 criterion A9 and the most critical safety item. Any positive endorsement triggers crisis guidance regardless of the other criteria.' }
  },
  {
    id: 'dsm5-g-duration', kind: 'gate', gateKey: 'duration',
    text: { zh: '这些症状是否在同一「两周」时期内集中出现？', en: 'Did these symptoms occur together during the same two-week period?' },
    domain: { zh: '病程标准（A）', en: 'Duration criterion (A)' },
    options: [
      { value: 0, label: { zh: '否 / 不足两周', en: 'No / less than two weeks' }, meaning: { zh: '症状未在同一两周时期内集中出现，不满足病程要求。', en: 'The symptoms did not cluster within the same two-week period; the duration requirement is not met.' } },
      { value: 1, label: { zh: '是，持续至少两周', en: 'Yes, present for at least two weeks' }, meaning: { zh: '满足 DSM-5 两周病程要求。', en: 'The DSM-5 two-week duration requirement is met.' } }
    ],
    explanation: { zh: 'DSM-5 要求症状在同一两周时期内存在（标准 A 的时间条件）。', en: 'DSM-5 requires symptoms to be present during the same two-week period (the temporal condition of criterion A).' }
  },
  {
    id: 'dsm5-g-impairment', kind: 'gate', gateKey: 'impairment',
    text: { zh: '这些症状是否引起了临床上明显的痛苦，或社交、职业/学业等重要功能的损害？', en: 'Do the symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning?' },
    domain: { zh: '功能损害标准（B）', en: 'Impairment criterion (B)' },
    options: [
      { value: 0, label: { zh: '否，未造成明显影响', en: 'No significant distress or impairment' }, meaning: { zh: '症状未造成明显功能损害，标准 B 未满足。', en: 'The symptoms cause no significant impairment; criterion B is not met.' } },
      { value: 1, label: { zh: '是，造成明显痛苦或功能损害', en: 'Yes, causes clinically significant distress or impairment' }, meaning: { zh: '满足功能损害标准 B。', en: 'Criterion B (functional impairment) is met.' } }
    ],
    explanation: { zh: 'DSM-5 标准 B：症状必须造成临床上明显的痛苦或功能损害。', en: 'DSM-5 criterion B: symptoms must cause clinically significant distress or impairment.' }
  },
  {
    id: 'dsm5-g-exclusion', kind: 'gate', gateKey: 'exclusion',
    text: { zh: '这些症状是否不能归因于某种物质（如药物、酒精）的生理效应或其他躯体疾病（如甲状腺功能减退）？', en: 'Are the symptoms NOT attributable to the physiological effects of a substance (e.g., a drug, alcohol) or another medical condition (e.g., hypothyroidism)?' },
    domain: { zh: '排除标准（C）', en: 'Exclusion criterion (C)' },
    options: [
      { value: 0, label: { zh: '可能由物质/药物/躯体疾病引起', en: 'Possibly attributable to a substance/medication/medical condition' }, meaning: { zh: '症状可能由物质或躯体疾病引起，需医学检查排除，标准 C 存疑。', en: 'The symptoms may be attributable to a substance or medical condition and require medical evaluation; criterion C is in doubt.' } },
      { value: 1, label: { zh: '否，并非由物质或躯体疾病引起', en: 'No, not attributable to a substance or medical condition' }, meaning: { zh: '满足排除标准 C。', en: 'Exclusion criterion C is met.' } }
    ],
    explanation: { zh: 'DSM-5 标准 C：症状不能归因于物质或其他躯体疾病。此题需专业医学评估确认。', en: 'DSM-5 criterion C: symptoms are not attributable to a substance or another medical condition. This requires professional medical evaluation to confirm.' }
  },
  {
    id: 'dsm5-g-manic', kind: 'gate', gateKey: 'manic',
    text: { zh: '你是否从未有过躁狂或轻躁狂发作？', en: 'Have you NEVER had a manic or hypomanic episode?' },
    domain: { zh: '排除双相（标准 E）', en: 'Rule out bipolar (criterion E)' },
    options: [
      { value: 0, label: { zh: '曾有过躁狂/轻躁狂发作', en: 'There has been a manic or hypomanic episode' }, meaning: { zh: '曾有过躁狂/轻躁狂发作，提示可能为双相障碍而非单相抑郁，需专业鉴别。', en: 'A manic/hypomanic episode has occurred, suggesting possible bipolar disorder rather than unipolar depression; professional differential diagnosis is needed.' } },
      { value: 1, label: { zh: '从未有过躁狂/轻躁狂发作', en: 'There has never been a manic or hypomanic episode' }, meaning: { zh: '无躁狂/轻躁狂史，支持单相抑郁的判定。', en: 'No manic/hypomanic history, supporting a unipolar depression determination.' } }
    ],
    explanation: { zh: 'DSM-5 要求排除躁狂/轻躁狂史，以区分单相抑郁与双相障碍（相关标准 E）。', en: 'DSM-5 requires ruling out manic/hypomanic history to distinguish unipolar depression from bipolar disorder (related criterion E).' }
  }
]

export const dsm5 = {
  id: 'dsm5',
  order: 60,
  name: { zh: 'DSM-5 重性抑郁发作（症状自评模块）', en: 'DSM-5 Major Depressive Episode (symptom self-check module)' },
  shortName: { zh: 'DSM-5', en: 'DSM-5' },
  description: {
    zh: '按 DSM-5 重性抑郁发作标准 A 的 9 项症状逐条自评，并附加病程/功能损害/排除/双相鉴别标准，输出结构化判定（符合/阈下/不符合）。',
    en: 'Self-check of the 9 criterion-A symptoms of a DSM-5 major depressive episode, plus duration/impairment/exclusion/bipolar-rule-out criteria, yielding a structured determination (meets / subthreshold / not met).'
  },
  timeframe: {
    zh: '请根据你在「过去两周（同一段时期）」的状态作答。',
    en: 'Answer based on your state during "the same two-week period" (the past two weeks).'
  },
  copyright: {
    status: 'apa-dsm5',
    note: {
      zh: 'DSM-5 版权归美国精神医学学会（APA）所有。此处为症状自评模块，仅供教育/筛查参考，非正式诊断工具。',
      en: 'DSM-5 is copyrighted by the American Psychiatric Association. This symptom self-check module is for educational/screening reference only and is not a formal diagnostic instrument.'
    }
  },
  reference: 'American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders, 5th ed. (DSM-5). Arlington, VA: APA; 2013.',
  weight: 1,
  scoring: {
    type: 'criteria',
    threshold: 5,
    coreRequired: ['A1', 'A2'],
    totalRange: [0, 9]
  },
  clinicalCutoff: 5,
  notableThreshold: 1,
  bands: [
    { max: 1, severity: 'minimal', label: { zh: '症状极少', en: 'Very few symptoms' } },
    { max: 4, severity: 'subthreshold', label: { zh: '阈下抑郁症状', en: 'Subthreshold symptoms' } },
    { max: 9, severity: 'symptomatic', label: { zh: '达到抑郁症状数标准', en: 'Meets symptom-count threshold' } }
  ],
  bandAdvice: {
    minimal: {
      zh: '当前符合的抑郁症状很少。保持规律作息、运动与社会联结，继续自我观察。',
      en: 'Very few depressive symptoms are currently present. Maintain regular sleep, exercise and social contact, and keep self-monitoring.'
    },
    subthreshold: {
      zh: '存在若干抑郁症状但未达完整发作标准（阈下）。建议尝试自助方法并观察；若症状增多或持续，尽早寻求专业评估。',
      en: 'Several depressive symptoms are present but below full-episode criteria (subthreshold). Try self-help and monitor; if symptoms increase or persist, seek professional evaluation early.'
    },
    symptomatic: {
      zh: '符合的症状数已达到抑郁发作的阈值。强烈建议由精神科/心理科医生进行正式面评，以获得诊断与治疗建议。',
      en: 'The symptom count reaches the threshold for a depressive episode. A formal in-person evaluation by a psychiatrist/psychologist is strongly recommended for diagnosis and treatment guidance.'
    }
  },
  items
}

export default dsm5
