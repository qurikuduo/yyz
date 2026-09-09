// Static registry of bundled self-help resources and authoritative external links.
// Downloadable entries reference a file inside server/knowledge-assets.

export const knowledgeCategories = [
  { id: 'self-help', order: 10, name: { zh: '自助导引', en: 'Self-help guides' } },
  { id: 'worksheets', order: 20, name: { zh: '练习工作表', en: 'Worksheets' } },
  { id: 'crisis', order: 30, name: { zh: '危机资源', en: 'Crisis resources' } },
  { id: 'authoritative', order: 40, name: { zh: '权威资料（外部链接）', en: 'Authoritative sources (external links)' } }
]

export const knowledgeResources = [
  {
    slug: 'depression-self-help-guide',
    category: 'self-help',
    order: 10,
    title: { zh: '抑郁自助导引', en: 'Depression Self-Help Guide' },
    summary: {
      zh: '了解抑郁是什么、循证的自助方法（行为激活、认知行为、睡眠、运动、社交、正念），以及何时寻求专业帮助。',
      en: 'What depression is and evidence-based self-help (behavioral activation, CBT, sleep, exercise, social connection, mindfulness), plus when to seek professional care.'
    },
    file: 'depression-self-help-guide.md'
  },
  {
    slug: 'behavioral-activation-schedule',
    category: 'worksheets',
    order: 20,
    title: { zh: '行为激活日程表', en: 'Behavioral Activation Schedule' },
    summary: {
      zh: '可打印的周计划与每日记录表，用"由外而内"地安排有价值/有成就感的活动来改善情绪。',
      en: 'A printable weekly planner and daily log to schedule valued/achievement activities "outside-in" and lift mood.'
    },
    file: 'behavioral-activation-schedule.md'
  },
  {
    slug: 'cbt-thought-record',
    category: 'worksheets',
    order: 30,
    title: { zh: '思维记录表（CBT）', en: 'CBT Thought Record' },
    summary: {
      zh: '识别自动思维与认知歪曲，练习更平衡的替代想法，附常见认知歪曲对照表与示例。',
      en: 'Identify automatic thoughts and cognitive distortions, practice balanced alternatives, with a distortions table and a worked example.'
    },
    file: 'cbt-thought-record.md'
  },
  {
    slug: 'mood-sleep-diary',
    category: 'worksheets',
    order: 40,
    title: { zh: '情绪与睡眠日记', en: 'Mood & Sleep Diary' },
    summary: {
      zh: '每日记录情绪、焦虑、睡眠与活动，配合每周回顾与睡眠卫生要点，看清相互影响的规律。',
      en: 'Daily logging of mood, anxiety, sleep, and activity, with weekly review and sleep-hygiene basics to reveal patterns.'
    },
    file: 'mood-sleep-diary.md'
  },
  {
    slug: 'crisis-resources-card',
    category: 'crisis',
    order: 50,
    title: { zh: '危机资源卡', en: 'Crisis Resources Card' },
    summary: {
      zh: '危机时的立即行动步骤、中外心理援助热线、简版安全计划，以及给陪伴者的建议。',
      en: 'Immediate action steps, international crisis hotlines, a brief safety plan, and guidance for supporters.'
    },
    file: 'crisis-resources-card.md'
  },
  {
    slug: 'who-depression',
    category: 'authoritative',
    order: 60,
    title: { zh: 'WHO：抑郁事实简章', en: 'WHO: Depression fact sheet' },
    summary: {
      zh: '世界卫生组织关于抑郁的权威概述：症状、分型、治疗与全球数据。',
      en: 'World Health Organization overview of depression: symptoms, types, treatment, and global data.'
    },
    externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/depression'
  },
  {
    slug: 'nimh-depression',
    category: 'authoritative',
    order: 70,
    title: { zh: 'NIMH：抑郁专题', en: 'NIMH: Depression topic' },
    summary: {
      zh: '美国国家精神卫生研究所关于抑郁症的科普、症状与治疗信息。',
      en: 'US National Institute of Mental Health information on depression: signs, symptoms, and treatments.'
    },
    externalUrl: 'https://www.nimh.nih.gov/health/topics/depression'
  },
  {
    slug: 'nhs-depression',
    category: 'authoritative',
    order: 80,
    title: { zh: 'NHS：成人抑郁', en: 'NHS: Depression in adults' },
    summary: {
      zh: '英国国家医疗服务体系关于成人抑郁的症状、就医与自我调理建议。',
      en: 'UK National Health Service guidance on adult depression: symptoms, treatment, and things you can try.'
    },
    externalUrl: 'https://www.nhs.uk/mental-health/conditions/depression-in-adults/'
  },
  {
    slug: 'msd-depression',
    category: 'authoritative',
    order: 90,
    title: { zh: 'MSD 诊疗手册：抑郁障碍', en: 'MSD Manual: Depression' },
    summary: {
      zh: '默沙东诊疗手册（大众版）关于抑郁障碍的诊断标准（基于 DSM-5）与治疗说明。',
      en: 'MSD Manual (consumer version) on depressive disorders, including DSM-5-based diagnosis and treatment.'
    },
    externalUrl: 'https://www.msdmanuals.com/home/mental-health-disorders/mood-disorders/depression'
  },
  {
    slug: 'mayo-depression',
    category: 'authoritative',
    order: 100,
    title: { zh: 'Mayo Clinic：抑郁症', en: 'Mayo Clinic: Depression' },
    summary: {
      zh: '梅奥诊所关于抑郁症的症状、病因、诊断与应对方式的通俗说明。',
      en: 'Mayo Clinic overview of depression: symptoms, causes, diagnosis, and coping.'
    },
    externalUrl: 'https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007'
  },
  {
    slug: 'findahelpline',
    category: 'authoritative',
    order: 110,
    title: { zh: 'findahelpline：全球危机热线查询', en: 'findahelpline: global crisis line directory' },
    summary: {
      zh: '按国家/地区查询心理危机与支持热线的目录。',
      en: 'A directory to find crisis and support helplines by country/region.'
    },
    externalUrl: 'https://findahelpline.com'
  }
]

const bySlug = new Map(knowledgeResources.map((r) => [r.slug, r]))

export function listKnowledge() {
  const resources = [...knowledgeResources].sort((a, b) => a.order - b.order).map((r) => ({
    slug: r.slug,
    category: r.category,
    title: r.title,
    summary: r.summary,
    downloadable: Boolean(r.file),
    externalUrl: r.externalUrl ?? null,
    order: r.order
  }))
  return { categories: [...knowledgeCategories].sort((a, b) => a.order - b.order), resources }
}

export function getKnowledge(slug) {
  return bySlug.get(slug) ?? null
}
