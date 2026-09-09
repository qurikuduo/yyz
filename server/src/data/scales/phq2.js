// PHQ-2 (Patient Health Questionnaire-2) — public domain ultra-brief screen.
// Reference: Kroenke K, Spitzer RL, Williams JB, Löwe B. J Gen Intern Med. 2003;18(10):864-865.
// Items 1-2 of the PHQ-9. Cutoff >=3 is a positive screen; a positive PHQ-2 should be
// followed by the full PHQ-9.

const options = [
  {
    value: 0,
    label: { zh: '完全不会', en: 'Not at all' },
    meaning: { zh: '过去两周内该症状未出现。', en: 'The symptom was absent over the last two weeks.' }
  },
  {
    value: 1,
    label: { zh: '好几天', en: 'Several days' },
    meaning: { zh: '该症状偶尔出现（数天）。', en: 'The symptom occurred on several days.' }
  },
  {
    value: 2,
    label: { zh: '超过一半的天数', en: 'More than half the days' },
    meaning: { zh: '该症状经常出现（超过一半天数）。', en: 'The symptom occurred more than half the days.' }
  },
  {
    value: 3,
    label: { zh: '几乎每天', en: 'Nearly every day' },
    meaning: { zh: '该症状几乎每天出现。', en: 'The symptom occurred nearly every day.' }
  }
]

const items = [
  {
    id: 'phq2-1',
    text: { zh: '做事时提不起兴趣或没有乐趣', en: 'Little interest or pleasure in doing things' },
    domain: { zh: '兴趣缺失 / 快感缺乏', en: 'Anhedonia / loss of interest' },
    dsm5: 'A2',
    explanation: {
      zh: 'PHQ-2 的第一个核心条目，测量兴趣/愉悦感减退（快感缺乏），是抑郁的两大核心症状之一。',
      en: 'The first core PHQ-2 item, measuring diminished interest/pleasure (anhedonia) — one of the two cardinal symptoms of depression.'
    }
  },
  {
    id: 'phq2-2',
    text: { zh: '情绪低落、抑郁或感到绝望', en: 'Feeling down, depressed, or hopeless' },
    domain: { zh: '抑郁心境', en: 'Depressed mood' },
    dsm5: 'A1',
    explanation: {
      zh: 'PHQ-2 的第二个核心条目，测量心境低落。两题合计 0–6 分，≥3 分为阳性初筛，建议继续完成 PHQ-9。',
      en: 'The second core PHQ-2 item, measuring depressed mood. The two items total 0-6; a score >=3 is a positive screen and should be followed by the full PHQ-9.'
    }
  }
]

export const phq2 = {
  id: 'phq2',
  order: 10,
  name: { zh: 'PHQ-2 患者健康问卷（2 题初筛）', en: 'PHQ-2 Patient Health Questionnaire (2-item screen)' },
  shortName: { zh: 'PHQ-2', en: 'PHQ-2' },
  description: {
    zh: '最简短的循证抑郁初筛工具（PHQ-9 前两题），30 秒完成；≥3 分建议续做 PHQ-9。',
    en: 'The briefest evidence-based depression screen (first two PHQ-9 items), completed in ~30 seconds; a score >=3 warrants the full PHQ-9.'
  },
  timeframe: {
    zh: '在过去两周里，你有多少时候受到以下问题的困扰？',
    en: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?'
  },
  copyright: {
    status: 'public-domain',
    note: { zh: 'PHQ-2 为公有领域工具，可自由使用。', en: 'PHQ-2 is in the public domain and free to use.' }
  },
  reference: 'Kroenke K, Spitzer RL, Williams JB, Löwe B. The Patient Health Questionnaire-2: validity of a two-item depression screener. Med Care. 2003;41(11):1284-1292.',
  scoring: {
    type: 'sum',
    perItemMin: 0,
    perItemMax: 3,
    totalRange: [0, 6]
  },
  clinicalCutoff: 3,
  notableThreshold: 2,
  bands: [
    { max: 2, severity: 'minimal', label: { zh: '初筛阴性（低风险）', en: 'Negative screen (low risk)' } },
    { max: 6, severity: 'positive', label: { zh: '初筛阳性（建议续做 PHQ-9）', en: 'Positive screen (follow up with PHQ-9)' } }
  ],
  bandAdvice: {
    minimal: {
      zh: 'PHQ-2 初筛为阴性，当前抑郁风险较低。若仍有困扰，可继续完成 PHQ-9 获得更细致的评估。',
      en: 'The PHQ-2 screen is negative, indicating low current depression risk. If you still have concerns, continue with the PHQ-9 for a more detailed assessment.'
    },
    positive: {
      zh: 'PHQ-2 初筛为阳性（≥3），提示可能存在抑郁症状。强烈建议继续完成 PHQ-9 或综合评估，并考虑咨询专业人士。',
      en: 'The PHQ-2 screen is positive (>=3), suggesting possible depressive symptoms. It is strongly recommended to complete the PHQ-9 or the comprehensive assessment, and to consider consulting a professional.'
    }
  },
  options,
  items
}

export default phq2
