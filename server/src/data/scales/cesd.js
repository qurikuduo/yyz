// CES-D (Center for Epidemiologic Studies Depression Scale) — Radloff 1977, public domain.
// Reference: Radloff LS. Appl Psychol Meas. 1977;1(3):385-401.
// 20 items, 0-3, timeframe = past week. Items 4, 8, 12, 16 are positively worded and
// reverse-scored. Cutoff >=16 indicates clinically significant depressive symptoms.

const options = [
  {
    value: 0,
    label: { zh: '很少或没有时间（<1 天）', en: 'Rarely or none of the time (<1 day)' },
    meaning: { zh: '过去一周几乎未出现该情况。', en: 'This rarely or never occurred in the past week.' }
  },
  {
    value: 1,
    label: { zh: '有时有（1–2 天）', en: 'Some of the time (1-2 days)' },
    meaning: { zh: '过去一周偶尔出现（1–2 天）。', en: 'This occurred occasionally (1-2 days) in the past week.' }
  },
  {
    value: 2,
    label: { zh: '经常有（3–4 天）', en: 'Occasionally or a moderate amount of the time (3-4 days)' },
    meaning: { zh: '过去一周经常出现（3–4 天），已达较高频率。', en: 'This occurred often (3-4 days) in the past week — a relatively high frequency.' }
  },
  {
    value: 3,
    label: { zh: '多数或持续有（5–7 天）', en: 'Most or all of the time (5-7 days)' },
    meaning: { zh: '过去一周大部分时间持续出现（5–7 天）。', en: 'This occurred most or all of the time (5-7 days) in the past week.' }
  }
]

// Reverse-scored (positively worded) items use inverted meanings.
const reverseOptions = [
  {
    value: 0,
    label: { zh: '很少或没有时间（<1 天）', en: 'Rarely or none of the time (<1 day)' },
    meaning: { zh: '（正向题）过去一周几乎没有这种积极体验，反向计分后贡献最高分。', en: '(Positively worded) This positive experience was almost absent in the past week; after reverse scoring it contributes the highest score.' }
  },
  {
    value: 1,
    label: { zh: '有时有（1–2 天）', en: 'Some of the time (1-2 days)' },
    meaning: { zh: '（正向题）过去一周偶尔有这种积极体验，反向计分后贡献较高分。', en: '(Positively worded) This positive experience occurred occasionally; after reverse scoring it contributes a higher score.' }
  },
  {
    value: 2,
    label: { zh: '经常有（3–4 天）', en: 'Occasionally or a moderate amount of the time (3-4 days)' },
    meaning: { zh: '（正向题）过去一周经常有这种积极体验，反向计分后贡献较低分。', en: '(Positively worded) This positive experience occurred often; after reverse scoring it contributes a lower score.' }
  },
  {
    value: 3,
    label: { zh: '多数或持续有（5–7 天）', en: 'Most or all of the time (5-7 days)' },
    meaning: { zh: '（正向题）过去一周大部分时间都有这种积极体验，反向计分后贡献 0 分（保护性）。', en: '(Positively worded) This positive experience was present most/all of the time; after reverse scoring it contributes 0 (protective).' }
  }
]

const items = [
  { id: 'cesd-1', text: { zh: '平时不会 bothering 我的事情，近来却让我感到困扰', en: 'I was bothered by things that usually don\'t bother me' }, domain: { zh: '易激惹 / 烦恼', en: 'Irritability / feeling bothered' }, explanation: { zh: '测量对日常事物的耐受度下降，反映抑郁常见的易激惹与烦恼感。', en: 'Measures reduced tolerance for everyday things, reflecting the irritability common in depression.' } },
  { id: 'cesd-2', text: { zh: '我不想吃东西，食欲很差', en: 'I did not feel like eating; my appetite was poor' }, domain: { zh: '食欲改变', en: 'Appetite change' }, dsm5: 'A5', explanation: { zh: '对应 DSM-5 食欲/体重改变标准，测量食欲减退。', en: 'Maps to the DSM-5 appetite/weight-change criterion; measures reduced appetite.' } },
  { id: 'cesd-3', text: { zh: '即使有家人和朋友帮助，我仍感到无法摆脱的沮丧', en: 'I felt that I could not shake off the blues even with help from my family or friends' }, domain: { zh: '持续性情绪低落', en: 'Persistent low mood' }, explanation: { zh: '测量难以缓解的沮丧感，即使有社会支持也无法摆脱，是抑郁心境的特征。', en: 'Measures hard-to-relieve low mood that persists despite social support — a feature of depressed mood.' } },
  { id: 'cesd-4', text: { zh: '我觉得自己和别人一样好', en: 'I felt I was just as good as other people' }, domain: { zh: '自我评价（正向）', en: 'Self-worth (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '正向计分题：感到自己与他人同等有价值。反向计分后，缺乏这种感受会提高抑郁分。', en: 'Positively worded: feeling as worthy as others. Reverse-scored, so lacking this feeling raises the depression score.' } },
  { id: 'cesd-5', text: { zh: '我难以集中注意力做事', en: 'I had trouble keeping my mind on what I was doing' }, domain: { zh: '注意力下降', en: 'Poor concentration' }, dsm5: 'A8', explanation: { zh: '对应 DSM-5 注意力/思维减退标准，测量专注困难。', en: 'Maps to the DSM-5 concentration/diminished-thinking criterion.' } },
  { id: 'cesd-6', text: { zh: '我感到情绪低落、抑郁', en: 'I felt depressed' }, domain: { zh: '抑郁心境', en: 'Depressed mood' }, dsm5: 'A1', explanation: { zh: '直接测量抑郁心境，是抑郁的核心症状之一。', en: 'Directly measures depressed mood, a core symptom of depression.' } },
  { id: 'cesd-7', text: { zh: '我觉得做任何事都要费很大力气', en: 'I felt that everything I did was an effort' }, domain: { zh: '精力不足 / 疲乏', en: 'Low energy / effortfulness' }, dsm5: 'A6', explanation: { zh: '对应 DSM-5 疲劳/精力丧失标准，测量做事费力感。', en: 'Maps to the DSM-5 fatigue/loss-of-energy criterion.' } },
  { id: 'cesd-8', text: { zh: '我对未来充满希望', en: 'I felt hopeful about the future' }, domain: { zh: '希望感（正向）', en: 'Hopefulness (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '正向计分题：对未来抱有希望。反向计分后，缺乏希望感（绝望）会提高抑郁分。', en: 'Positively worded: feeling hopeful. Reverse-scored, so hopelessness raises the depression score.' } },
  { id: 'cesd-9', text: { zh: '我觉得自己的人生是个失败', en: 'I thought my life had been a failure' }, domain: { zh: '无价值感 / 失败感', en: 'Worthlessness / failure' }, dsm5: 'A7', explanation: { zh: '对应 DSM-5 无价值感/过度自责标准，测量人生失败感。', en: 'Maps to the DSM-5 worthlessness/excessive-guilt criterion.' } },
  { id: 'cesd-10', text: { zh: '我感到害怕', en: 'I felt fearful' }, domain: { zh: '焦虑 / 恐惧', en: 'Anxiety / fear' }, explanation: { zh: '测量恐惧/焦虑情绪，抑郁常与焦虑症状共存。', en: 'Measures fear/anxiety; depressive and anxiety symptoms frequently co-occur.' } },
  { id: 'cesd-11', text: { zh: '我的睡眠不安稳', en: 'My sleep was restless' }, domain: { zh: '睡眠障碍', en: 'Sleep disturbance' }, dsm5: 'A4', explanation: { zh: '对应 DSM-5 睡眠紊乱标准，测量睡眠不安。', en: 'Maps to the DSM-5 sleep-disturbance criterion.' } },
  { id: 'cesd-12', text: { zh: '我感到快乐', en: 'I was happy' }, domain: { zh: '愉悦感（正向）', en: 'Happiness (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '正向计分题：体验快乐。反向计分后，缺乏快乐（快感缺失）会提高抑郁分。', en: 'Positively worded: feeling happy. Reverse-scored, so anhedonia raises the depression score.' } },
  { id: 'cesd-13', text: { zh: '我说话比平时少', en: 'I talked less than usual' }, domain: { zh: '精神运动 / 社交退缩', en: 'Psychomotor / social withdrawal' }, dsm5: 'A9', explanation: { zh: '反映言语减少/社交退缩，与精神运动性改变相关。', en: 'Reflects reduced speech/social withdrawal, related to psychomotor change.' } },
  { id: 'cesd-14', text: { zh: '我感到孤独', en: 'I felt lonely' }, domain: { zh: '孤独感', en: 'Loneliness' }, explanation: { zh: '测量孤独感，是抑郁的重要人际情绪体验。', en: 'Measures loneliness, an important interpersonal-emotional experience in depression.' } },
  { id: 'cesd-15', text: { zh: '我觉得别人对我不友好', en: 'People were unfriendly' }, domain: { zh: '人际敏感', en: 'Interpersonal sensitivity' }, explanation: { zh: '测量人际敏感/被排斥感，抑郁者常出现负性人际知觉。', en: 'Measures interpersonal sensitivity/perceived rejection, common in depression.' } },
  { id: 'cesd-16', text: { zh: '我享受生活', en: 'I enjoyed life' }, domain: { zh: '生活愉悦（正向）', en: 'Enjoyment of life (positive)' }, reverse: true, options: reverseOptions, explanation: { zh: '正向计分题：享受生活。反向计分后，无法享受生活（快感缺失）会提高抑郁分。', en: 'Positively worded: enjoying life. Reverse-scored, so inability to enjoy life raises the depression score.' } },
  { id: 'cesd-17', text: { zh: '我有哭泣的发作', en: 'I had crying spells' }, domain: { zh: '情绪失控 / 悲伤', en: 'Crying / sadness' }, explanation: { zh: '测量哭泣发作，是情绪失控与悲伤的行为表现。', en: 'Measures crying spells, a behavioral manifestation of sadness and emotional dysregulation.' } },
  { id: 'cesd-18', text: { zh: '我感到悲伤', en: 'I felt sad' }, domain: { zh: '悲伤', en: 'Sadness' }, dsm5: 'A1', explanation: { zh: '直接测量悲伤情绪，与抑郁心境标准相关。', en: 'Directly measures sadness, related to the depressed-mood criterion.' } },
  { id: 'cesd-19', text: { zh: '我觉得别人不喜欢我', en: 'I felt that people disliked me' }, domain: { zh: '被排斥感 / 无价值', en: 'Perceived dislike / worthlessness' }, explanation: { zh: '测量被他人不喜欢的感觉，反映抑郁的负性自我/人际认知。', en: 'Measures feeling disliked, reflecting depression\'s negative self/interpersonal cognition.' } },
  { id: 'cesd-20', text: { zh: '我感到无法打起精神、做事提不起劲', en: 'I could not get going' }, domain: { zh: '精力缺乏 / 启动困难', en: 'Low energy / poor initiation' }, dsm5: 'A6', explanation: { zh: '测量启动困难/精力缺乏，与疲劳标准相关。', en: 'Measures poor initiation/low energy, related to the fatigue criterion.' } }
]

export const cesd = {
  id: 'cesd',
  order: 40,
  name: { zh: 'CES-D 流调中心抑郁量表', en: 'CES-D Center for Epidemiologic Studies Depression Scale' },
  shortName: { zh: 'CES-D', en: 'CES-D' },
  description: {
    zh: '经典流行病学抑郁量表，20 题、聚焦过去一周症状频率，广泛用于人群筛查与研究（含 4 道反向计分题）。',
    en: 'A classic epidemiological depression scale; 20 items focused on past-week symptom frequency, widely used for population screening and research (includes 4 reverse-scored items).'
  },
  timeframe: {
    zh: '以下是关于你最近一周（过去 7 天）的感受，请选择最符合的频率。',
    en: 'The following refer to how you felt during the past week (last 7 days). Choose the frequency that best fits.'
  },
  copyright: {
    status: 'public-domain',
    note: { zh: 'CES-D 为公有领域工具，可自由使用。', en: 'CES-D is in the public domain and free to use.' }
  },
  reference: 'Radloff LS. The CES-D Scale: a self-report depression scale for research in the general population. Appl Psychol Meas. 1977;1(3):385-401.',
  weight: 0.85,
  scoring: {
    type: 'sum',
    perItemMin: 0,
    perItemMax: 3,
    totalRange: [0, 60]
  },
  clinicalCutoff: 16,
  notableThreshold: 2,
  bands: [
    { max: 15, severity: 'minimal', label: { zh: '低于临床切点', en: 'Below clinical cutoff' } },
    { max: 20, severity: 'mild', label: { zh: '轻度（有临床意义）', en: 'Mild (clinically significant)' } },
    { max: 25, severity: 'moderate', label: { zh: '中度', en: 'Moderate' } },
    { max: 60, severity: 'severe', label: { zh: '重度', en: 'Severe' } }
  ],
  bandAdvice: {
    minimal: {
      zh: '过去一周抑郁症状频率低于临床切点（16）。继续保持规律作息与社会联结，如状态变化可复测。',
      en: 'Past-week depressive symptom frequency is below the clinical cutoff (16). Keep up regular routines and social connection; re-test if your state changes.'
    },
    mild: {
      zh: '过去一周抑郁症状达到有临床意义的水平（16–20）。建议尝试自助方法（见知识库）并观察；若持续，考虑专业评估。',
      en: 'Past-week symptoms reach a clinically significant level (16-20). Try self-help (see the knowledge base) and monitor; if persistent, consider professional evaluation.'
    },
    moderate: {
      zh: '过去一周抑郁症状为中度（21–25），建议寻求专业评估。心理治疗和/或药物可能有帮助。',
      en: 'Past-week symptoms are moderate (21-25); professional evaluation is recommended. Psychotherapy and/or medication may help.'
    },
    severe: {
      zh: '过去一周抑郁症状为重度（26–60），请尽快由精神科/心理科医生评估与治疗。若出现自伤念头，请立即联系危机热线或急诊。',
      en: 'Past-week symptoms are severe (26-60); seek prompt psychiatric/psychological evaluation and treatment. If you have thoughts of self-harm, contact a crisis line or emergency department immediately.'
    }
  },
  options,
  items
}

export default cesd
