// SDS (Zung Self-Rating Depression Scale) — Zung 1965.
// Reference: Zung WWK. Arch Gen Psychiatry. 1965;12(1):63-70.
// 20 items scored 1-4, timeframe = past week. Items 2,5,6,11,12,14,16,17,18,20 are
// reverse-scored. Raw range 20-80; Standard score = raw x 1.25 (range 25-100).
// Bands on standard score: <50 normal, 50-59 mild, 60-69 moderate, >=70 severe.
// Item 19 ("others would be better off if I were dead") is the crisis item.

const options = [
  { value: 1, label: { zh: '没有或很少时间', en: 'None or a little of the time' }, meaning: { zh: '该情况几乎没有出现（计分 1，最低）。', en: 'This was almost absent (score 1, lowest).' } },
  { value: 2, label: { zh: '小部分时间', en: 'Some of the time' }, meaning: { zh: '该情况有时出现（计分 2）。', en: 'This occurred some of the time (score 2).' } },
  { value: 3, label: { zh: '相当多时间', en: 'Good part of the time' }, meaning: { zh: '该情况经常出现（计分 3），提示较明显。', en: 'This occurred a good part of the time (score 3) — relatively marked.' } },
  { value: 4, label: { zh: '绝大部分或全部时间', en: 'Most or all of the time' }, meaning: { zh: '该情况持续出现（计分 4，最高），为明显困扰。', en: 'This occurred most or all of the time (score 4, highest) — clearly distressing.' } }
]

// Reverse-scored (positively worded) items: same labels, inverted interpretation.
const reverseOptions = [
  { value: 1, label: { zh: '没有或很少时间', en: 'None or a little of the time' }, meaning: { zh: '（反向题）这种积极状态几乎没有，反向计分后贡献最高分 4，提示抑郁程度较高。', en: '(Reverse item) This positive state was almost absent; after reverse scoring it contributes the maximum 4, indicating higher depression.' } },
  { value: 2, label: { zh: '小部分时间', en: 'Some of the time' }, meaning: { zh: '（反向题）偶尔有这种积极状态，反向计分后贡献 3 分。', en: '(Reverse item) This positive state occurred some of the time; after reverse scoring it contributes 3.' } },
  { value: 3, label: { zh: '相当多时间', en: 'Good part of the time' }, meaning: { zh: '（反向题）经常有这种积极状态，反向计分后贡献 2 分。', en: '(Reverse item) This positive state occurred a good part of the time; after reverse scoring it contributes 2.' } },
  { value: 4, label: { zh: '绝大部分或全部时间', en: 'Most or all of the time' }, meaning: { zh: '（反向题）持续有这种积极状态，反向计分后贡献最低分 1，为保护性表现。', en: '(Reverse item) This positive state was present most/all of the time; after reverse scoring it contributes the minimum 1 (protective).' } }
]

const items = [
  { id: 'sds-1', text: { zh: '我感到情绪沮丧、闷闷不乐', en: 'I feel down-hearted, blue and sad' }, domain: { zh: '抑郁心境', en: 'Depressed mood' }, dsm5: 'A1', explanation: { zh: '直接测量抑郁心境，是 SDS 的核心情绪条目。', en: 'Directly measures depressed mood, the core affective SDS item.' } },
  { id: 'sds-2', text: { zh: '我觉得一天之中早晨最好', en: 'I feel best in the morning' }, domain: { zh: '昼夜节律（正向）', en: 'Diurnal variation (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：抑郁常有「晨重夜轻」的节律，感到早晨最好为正常表现，反向计分后贡献低分。', en: 'Reverse-scored: depression often shows "worse in the morning"; feeling best in the morning is normal and contributes a low score after reversal.' } },
  { id: 'sds-3', text: { zh: '我会一阵阵想哭或觉得想哭', en: 'I have crying spells or feel like it' }, domain: { zh: '哭泣 / 悲伤', en: 'Crying / sadness' }, explanation: { zh: '测量哭泣发作倾向，反映情绪失控与悲伤。', en: 'Measures crying-spell tendency, reflecting sadness and emotional dysregulation.' } },
  { id: 'sds-4', text: { zh: '我晚上睡眠不好', en: 'I have trouble sleeping at night' }, domain: { zh: '睡眠障碍', en: 'Sleep disturbance' }, dsm5: 'A4', explanation: { zh: '对应 DSM-5 睡眠紊乱标准，测量失眠。', en: 'Maps to the DSM-5 sleep-disturbance criterion.' } },
  { id: 'sds-5', text: { zh: '我吃得跟平常一样多', en: 'I eat as much as I used to' }, domain: { zh: '食欲（正向）', en: 'Appetite (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：食欲如常为正常表现，反向计分后贡献低分；食欲下降则提高抑郁分。', en: 'Reverse-scored: normal appetite contributes a low score; reduced appetite raises the depression score.' } },
  { id: 'sds-6', text: { zh: '我对异性/性生活仍然感兴趣', en: 'I still enjoy sex' }, domain: { zh: '兴趣 / 快感（正向）', en: 'Interest / pleasure (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：仍保有性兴趣为保护性表现，快感缺失则提高抑郁分。', en: 'Reverse-scored: retained sexual interest is protective; anhedonia raises the depression score.' } },
  { id: 'sds-7', text: { zh: '我发觉我的体重在下降', en: 'I have noticed that I have been losing weight' }, domain: { zh: '体重下降', en: 'Weight loss' }, dsm5: 'A5', explanation: { zh: '对应 DSM-5 食欲/体重改变标准，测量体重减轻。', en: 'Maps to the DSM-5 appetite/weight-change criterion.' } },
  { id: 'sds-8', text: { zh: '我为便秘而苦恼', en: 'I have been bothered by constipation' }, domain: { zh: '躯体症状', en: 'Somatic symptom' }, explanation: { zh: '测量便秘等躯体化症状，抑郁常伴自主神经/躯体不适。', en: 'Measures somatic symptoms such as constipation; depression often involves autonomic/somatic complaints.' } },
  { id: 'sds-9', text: { zh: '我心跳比平时快', en: 'My heart beats faster than usual' }, domain: { zh: '躯体 / 焦虑症状', en: 'Somatic / anxiety symptom' }, explanation: { zh: '测量心悸，反映抑郁常见的焦虑/躯体唤醒。', en: 'Measures palpitations, reflecting the anxiety/somatic arousal common in depression.' } },
  { id: 'sds-10', text: { zh: '我无缘无故感到疲乏', en: 'I get tired for no good reason' }, domain: { zh: '疲劳 / 精力不足', en: 'Fatigue / low energy' }, dsm5: 'A6', explanation: { zh: '对应 DSM-5 疲劳/精力丧失标准。', en: 'Maps to the DSM-5 fatigue/loss-of-energy criterion.' } },
  { id: 'sds-11', text: { zh: '我的头脑跟平常一样清楚', en: 'My mind is as clear as it used to be' }, domain: { zh: '思维清晰（正向）', en: 'Mental clarity (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：思维清晰为正常表现；认知迟缓/思维困难则提高抑郁分。', en: 'Reverse-scored: mental clarity is normal; cognitive slowing raises the depression score.' } },
  { id: 'sds-12', text: { zh: '我做平时做的事不感到困难', en: 'I find it easy to do the things I used to do' }, domain: { zh: '功能 / 启动（正向）', en: 'Functioning / initiation (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：日常活动不费力为正常表现；启动困难则提高抑郁分。', en: 'Reverse-scored: doing usual activities easily is normal; poor initiation raises the depression score.' } },
  { id: 'sds-13', text: { zh: '我坐立不安，难以保持平静', en: 'I am restless and cannot keep still' }, domain: { zh: '精神运动性激越', en: 'Psychomotor agitation' }, dsm5: 'A9', explanation: { zh: '对应 DSM-5 精神运动性激越标准。', en: 'Maps to the DSM-5 psychomotor-agitation criterion.' } },
  { id: 'sds-14', text: { zh: '我对将来抱有希望', en: 'I feel hopeful about the future' }, domain: { zh: '希望感（正向）', en: 'Hopefulness (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：对未来有希望为保护性表现；绝望感则提高抑郁分。', en: 'Reverse-scored: hopefulness is protective; hopelessness raises the depression score.' } },
  { id: 'sds-15', text: { zh: '我比平常更容易生气/激怒', en: 'I am more irritable than usual' }, domain: { zh: '易激惹', en: 'Irritability' }, explanation: { zh: '测量易激惹，抑郁常见的情绪调节困难表现。', en: 'Measures irritability, a common emotional-dysregulation feature of depression.' } },
  { id: 'sds-16', text: { zh: '我做决定不感到困难', en: 'I find it easy to make decisions' }, domain: { zh: '决策能力（正向）', en: 'Decisiveness (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：决策自如为正常表现；犹豫不决则提高抑郁分（对应认知症状）。', en: 'Reverse-scored: easy decision-making is normal; indecisiveness raises the depression score (a cognitive symptom).' } },
  { id: 'sds-17', text: { zh: '我觉得自己是有用的、不可缺少的', en: 'I feel that I am useful and needed' }, domain: { zh: '自我价值（正向）', en: 'Self-worth (positive)' }, reverse: true, options: reverseOptions, dsm5: 'A7', explanation: { zh: '反向计分题：感到有用/被需要为保护性表现；无价值感则提高抑郁分。', en: 'Reverse-scored: feeling useful/needed is protective; worthlessness raises the depression score.' } },
  { id: 'sds-18', text: { zh: '我的生活过得充实、有意义', en: 'My life is pretty full' }, domain: { zh: '生活满足（正向）', en: 'Life fulfillment (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '反向计分题：生活充实为保护性表现；空虚/无意义感则提高抑郁分。', en: 'Reverse-scored: a full life is protective; emptiness/meaninglessness raises the depression score.' } },
  { id: 'sds-19', text: { zh: '我觉得如果我死了，别人会过得更好', en: 'I feel that others would be better off if I were dead' }, domain: { zh: '自杀 / 无价值意念', en: 'Suicidal / worthlessness ideation' }, dsm5: 'A10', crisis: true, explanation: { zh: '安全性关键条目：测量「自己死了别人更好」的被动自杀意念。只要为阳性（≥2 分），无论总分高低都会触发危机干预提示。', en: 'Critical safety item: measures passive suicidal ideation ("others would be better off if I were dead"). Any positive endorsement triggers crisis guidance regardless of total score.' } },
  { id: 'sds-20', text: { zh: '我对平时喜欢做的事仍然感兴趣', en: 'I still enjoy the things I used to do' }, domain: { zh: '兴趣 / 快感（正向）', en: 'Interest / pleasure (positive)' }, reverse: true, options: reverseOptions, dsm5: 'A2', explanation: { zh: '反向计分题：仍保有兴趣/愉悦为保护性表现；快感缺失则提高抑郁分（对应抑郁核心症状）。', en: 'Reverse-scored: retained interest/pleasure is protective; anhedonia raises the depression score (a core symptom).' } }
]

export const sds = {
  id: 'sds',
  order: 30,
  name: { zh: 'SDS 抑郁自评量表（Zung）', en: 'SDS Zung Self-Rating Depression Scale' },
  shortName: { zh: 'SDS', en: 'SDS' },
  description: {
    zh: 'Zung 抑郁自评量表，20 题（含 10 道反向计分题），报告粗分与标准分（粗分×1.25），国内临床与体检广泛使用。',
    en: 'The Zung Self-Rating Depression Scale; 20 items (10 reverse-scored), reporting both raw and standard scores (raw x 1.25), widely used in Chinese clinical and screening settings.'
  },
  timeframe: {
    zh: '请根据你最近一周的实际感受，为每一题选择最符合的频率。',
    en: 'For each item, choose the frequency that best reflects how you felt during the past week.'
  },
  copyright: {
    status: 'licensed-reference',
    note: { zh: 'SDS 由 W.W.K. Zung 编制，此处用于自评筛查参考。', en: 'SDS was developed by W.W.K. Zung; used here for self-rating screening reference.' }
  },
  reference: 'Zung WWK. A Self-Rating Depression Scale. Arch Gen Psychiatry. 1965;12(1):63-70.',
  weight: 0.84,
  scoring: {
    type: 'sum',
    perItemMin: 1,
    perItemMax: 4,
    totalRange: [20, 80],
    derived: {
      label: { zh: '标准分', en: 'Standard score' },
      factor: 1.25,
      round: true,
      range: [25, 100],
      bandOn: 'derived'
    }
  },
  clinicalCutoff: 50,
  notableThreshold: 3,
  bands: [
    { max: 49, severity: 'minimal', label: { zh: '正常范围', en: 'Normal range' } },
    { max: 59, severity: 'mild', label: { zh: '轻度抑郁', en: 'Mild depression' } },
    { max: 69, severity: 'moderate', label: { zh: '中度抑郁', en: 'Moderate depression' } },
    { max: 100, severity: 'severe', label: { zh: '重度抑郁', en: 'Severe depression' } }
  ],
  bandAdvice: {
    minimal: {
      zh: 'SDS 标准分低于 50，处于正常范围。继续保持健康作息与情绪觉察，如状态变化可复测。',
      en: 'The SDS standard score is below 50 (normal range). Maintain healthy routines and emotional awareness; re-test if your state changes.'
    },
    mild: {
      zh: 'SDS 标准分 50–59，提示轻度抑郁。建议尝试自助方法（见知识库）并观察 2–4 周；若持续或加重，考虑专业评估。',
      en: 'SDS standard score 50-59 suggests mild depression. Try self-help (see the knowledge base) and watch for 2-4 weeks; if persistent or worsening, consider professional evaluation.'
    },
    moderate: {
      zh: 'SDS 标准分 60–69，提示中度抑郁。建议寻求精神科/心理科专业评估，心理治疗和/或药物可能有帮助。',
      en: 'SDS standard score 60-69 suggests moderate depression; seek professional psychiatric/psychological evaluation. Psychotherapy and/or medication may help.'
    },
    severe: {
      zh: 'SDS 标准分 ≥70，提示重度抑郁。请尽快就医评估与治疗。若出现自伤/自杀念头，请立即联系危机热线或急诊。',
      en: 'SDS standard score >=70 suggests severe depression; seek prompt medical evaluation and treatment. If you have thoughts of self-harm, contact a crisis line or emergency department immediately.'
    }
  },
  options,
  items
}

export default sds
