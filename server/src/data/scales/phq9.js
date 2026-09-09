// PHQ-9 (Patient Health Questionnaire-9) — public domain.
// Reference: Kroenke K, Spitzer RL, Williams JB. J Gen Intern Med. 2001;16(9):606-613.

const options = [
  {
    value: 0,
    label: { zh: '完全不会', en: 'Not at all' },
    meaning: {
      zh: '过去两周内该症状未出现，属正常范围。',
      en: 'The symptom was absent over the last two weeks — within the normal range.'
    }
  },
  {
    value: 1,
    label: { zh: '好几天', en: 'Several days' },
    meaning: {
      zh: '该症状偶尔出现（数天），频率较轻，可留意但不一定构成临床问题。',
      en: 'The symptom occurred on several days — mild frequency; worth noting but not necessarily clinical.'
    }
  },
  {
    value: 2,
    label: { zh: '超过一半的天数', en: 'More than half the days' },
    meaning: {
      zh: '该症状经常出现（超过一半天数），频率达中度，具有临床关注价值。',
      en: 'The symptom occurred more than half the days — moderate frequency and clinically relevant.'
    }
  },
  {
    value: 3,
    label: { zh: '几乎每天', en: 'Nearly every day' },
    meaning: {
      zh: '该症状几乎每天出现，频率高，属 clinically significant（具临床意义）的表现。',
      en: 'The symptom occurred nearly every day — high frequency and clinically significant.'
    }
  }
]

const items = [
  {
    id: 'phq9-1',
    text: {
      zh: '做事时提不起兴趣或没有乐趣',
      en: 'Little interest or pleasure in doing things'
    },
    domain: { zh: '兴趣缺失 / 快感缺乏', en: 'Anhedonia / loss of interest' },
    dsm5: 'A2',
    explanation: {
      zh: '此题对应 DSM-5 重性抑郁发作的核心症状之一——兴趣或愉悦感显著减退（快感缺乏）。它是抑郁最核心的两个症状之一，若几乎每天出现，诊断权重很高。',
      en: 'This item maps to a core DSM-5 criterion for a major depressive episode — markedly diminished interest or pleasure (anhedonia). It is one of the two cardinal symptoms of depression and carries high diagnostic weight when present nearly every day.'
    }
  },
  {
    id: 'phq9-2',
    text: {
      zh: '情绪低落、抑郁或感到绝望',
      en: 'Feeling down, depressed, or hopeless'
    },
    domain: { zh: '抑郁心境', en: 'Depressed mood' },
    dsm5: 'A1',
    explanation: {
      zh: '此题对应 DSM-5 的另一个核心症状——几乎每天大部分时间心境低落。与第 1 题共同构成抑郁诊断的必备症状（至少需具备其一）。',
      en: 'This item maps to the other core DSM-5 criterion — depressed mood most of the day, nearly every day. Together with item 1 it forms the mandatory symptom pair (at least one must be present).'
    }
  },
  {
    id: 'phq9-3',
    text: {
      zh: '入睡困难、睡不安稳，或睡眠过多',
      en: 'Trouble falling or staying asleep, or sleeping too much'
    },
    domain: { zh: '睡眠障碍', en: 'Sleep disturbance' },
    dsm5: 'A4',
    explanation: {
      zh: '此题对应 DSM-5 的睡眠紊乱标准（失眠或嗜睡）。睡眠改变是抑郁常见的躯体症状，既可能是入睡/维持困难，也可能是睡眠过多。',
      en: 'This item maps to the DSM-5 sleep-disturbance criterion (insomnia or hypersomnia). Sleep change is a common somatic symptom of depression, spanning both difficulty sleeping and sleeping too much.'
    }
  },
  {
    id: 'phq9-4',
    text: {
      zh: '感觉疲倦或没有活力',
      en: 'Feeling tired or having little energy'
    },
    domain: { zh: '疲劳 / 精力不足', en: 'Fatigue / loss of energy' },
    dsm5: 'A6',
    explanation: {
      zh: '此题对应 DSM-5 的疲劳或精力丧失标准。这种疲倦常与体力活动不成比例，且休息后难以缓解，是抑郁的典型躯体表现。',
      en: 'This item maps to the DSM-5 fatigue/loss-of-energy criterion. This tiredness is often disproportionate to activity and not relieved by rest — a classic somatic feature of depression.'
    }
  },
  {
    id: 'phq9-5',
    text: {
      zh: '食欲不振，或吃得太多',
      en: 'Poor appetite or overeating'
    },
    domain: { zh: '食欲 / 体重改变', en: 'Appetite / weight change' },
    dsm5: 'A5',
    explanation: {
      zh: '此题对应 DSM-5 的食欲或体重显著改变标准（增加或减少）。抑郁可表现为食欲下降伴体重减轻，或食欲增加（尤其对碳水化合物渴求）伴体重上升。',
      en: 'This item maps to the DSM-5 criterion for significant appetite/weight change (increase or decrease). Depression may present as reduced appetite with weight loss, or increased appetite (often carbohydrate craving) with weight gain.'
    }
  },
  {
    id: 'phq9-6',
    text: {
      zh: '觉得自己很糟，或觉得自己很失败、让自己或家人失望了',
      en: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down'
    },
    domain: { zh: '无价值感 / 过度自责', en: 'Worthlessness / excessive guilt' },
    dsm5: 'A7',
    explanation: {
      zh: '此题对应 DSM-5 的无价值感或过度/不恰当自责标准。这类负性自我评价是抑郁的认知核心，常与低自尊和绝望感交织。',
      en: 'This item maps to the DSM-5 criterion for feelings of worthlessness or excessive/inappropriate guilt. Such negative self-evaluation is a cognitive core of depression, often intertwined with low self-esteem and hopelessness.'
    }
  },
  {
    id: 'phq9-7',
    text: {
      zh: '难以集中注意力，例如阅读报纸或看电视时也走神',
      en: 'Trouble concentrating on things, such as reading the newspaper or watching television'
    },
    domain: { zh: '注意力 / 决策能力下降', en: 'Diminished concentration / indecisiveness' },
    dsm5: 'A8',
    explanation: {
      zh: '此题对应 DSM-5 的思维能力/注意力减退或犹豫不决标准。认知迟缓会明显影响工作与学习效率，是抑郁常见的认知症状。',
      en: 'This item maps to the DSM-5 criterion for diminished ability to think/concentrate or indecisiveness. Cognitive slowing markedly affects work and study efficiency and is a common cognitive symptom of depression.'
    }
  },
  {
    id: 'phq9-8',
    text: {
      zh: '动作或说话缓慢到别人已经察觉？或正好相反——烦躁不安、坐立不安，动来动去比平常明显增多',
      en: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual'
    },
    domain: { zh: '精神运动性激越 / 迟滞', en: 'Psychomotor agitation / retardation' },
    dsm5: 'A9',
    explanation: {
      zh: '此题对应 DSM-5 的精神运动性激越或迟滞标准（需他人可观察到，而非仅主观感受）。它是抑郁发作的躯体行为表现之一。',
      en: 'This item maps to the DSM-5 criterion for psychomotor agitation or retardation (observable by others, not merely subjective). It is one of the behavioral/somatic manifestations of a depressive episode.'
    }
  },
  {
    id: 'phq9-9',
    text: {
      zh: '有不如死掉、或用某种方式伤害自己的念头',
      en: 'Thoughts that you would be better off dead or of hurting yourself in some way'
    },
    domain: { zh: '自杀 / 自伤意念', en: 'Suicidal / self-harm ideation' },
    dsm5: 'A10',
    crisis: true,
    explanation: {
      zh: '此题对应 DSM-5 的反复出现死亡念头、自杀意念或自杀企图标准。这是最重要的安全性条目：只要为阳性（≥1 分），无论总分高低，都会触发危机干预提示。',
      en: 'This item maps to the DSM-5 criterion for recurrent thoughts of death, suicidal ideation, or a suicide attempt. It is the most critical safety item: any positive endorsement (≥1) triggers crisis-intervention guidance regardless of the total score.'
    }
  }
]

export const phq9 = {
  id: 'phq9',
  order: 20,
  name: { zh: 'PHQ-9 患者健康问卷（抑郁）', en: 'PHQ-9 Patient Health Questionnaire' },
  shortName: { zh: 'PHQ-9', en: 'PHQ-9' },
  description: {
    zh: '国际最主流的抑郁筛查工具，9 个条目对应 DSM 抑郁症状，公有领域、循证充分。',
    en: 'The most widely used depression screening tool worldwide; 9 items aligned with DSM depressive symptoms. Public domain and strongly evidence-based.'
  },
  timeframe: {
    zh: '在过去两周里，你有多少时候受到以下问题的困扰？',
    en: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?'
  },
  copyright: {
    status: 'public-domain',
    note: {
      zh: 'PHQ-9 为公有领域工具，可自由使用。',
      en: 'PHQ-9 is in the public domain and free to use.'
    }
  },
  reference: 'Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.',
  weight: 0.86,
  notableThreshold: 2,
  scoring: {
    type: 'sum',
    perItemMin: 0,
    perItemMax: 3,
    totalRange: [0, 27]
  },
  clinicalCutoff: 10,
  bands: [
    { max: 4, severity: 'minimal', label: { zh: '无 / 极轻度抑郁', en: 'Minimal / no depression' } },
    { max: 9, severity: 'mild', label: { zh: '轻度抑郁', en: 'Mild depression' } },
    { max: 14, severity: 'moderate', label: { zh: '中度抑郁', en: 'Moderate depression' } },
    { max: 19, severity: 'moderately-severe', label: { zh: '中重度抑郁', en: 'Moderately severe depression' } },
    { max: 27, severity: 'severe', label: { zh: '重度抑郁', en: 'Severe depression' } }
  ],
  bandAdvice: {
    minimal: {
      zh: '当前抑郁症状水平很低。建议保持规律作息、运动与社交，继续关注自身状态。',
      en: 'Depressive symptoms are currently very low. Maintain regular sleep, exercise and social contact, and keep monitoring your state.'
    },
    mild: {
      zh: '存在轻度抑郁症状。可先尝试自助方法（见知识库），并观察 2–4 周；若持续或加重，建议咨询专业人士。',
      en: 'Mild depressive symptoms are present. Try self-help strategies (see the knowledge base) and watch for 2–4 weeks; if persistent or worsening, consult a professional.'
    },
    moderate: {
      zh: '存在中度抑郁症状，建议寻求专业评估（精神科/心理科）。心理治疗（如 CBT）和/或药物可能有帮助。',
      en: 'Moderate depressive symptoms are present; professional evaluation (psychiatry/psychology) is recommended. Psychotherapy (e.g., CBT) and/or medication may help.'
    },
    'moderately-severe': {
      zh: '存在中重度抑郁症状，强烈建议尽快由专业医生评估，通常需要积极治疗（心理治疗联合药物）。',
      en: 'Moderately severe symptoms are present; prompt evaluation by a clinician is strongly advised. Active treatment (psychotherapy plus medication) is usually indicated.'
    },
    severe: {
      zh: '存在重度抑郁症状，请尽快就医由精神科医生评估与治疗。若出现自伤/自杀念头，请立即联系危机热线或急诊。',
      en: 'Severe depressive symptoms are present; seek psychiatric evaluation and treatment promptly. If you have thoughts of self-harm or suicide, contact a crisis line or emergency department immediately.'
    }
  },
  options,
  items
}

export default phq9
