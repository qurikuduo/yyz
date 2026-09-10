import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Bilingual, BilingualList, Lang } from '../types'

type Dict = Record<string, string>

const zh: Dict = {
  'app.title': '抑郁自测',
  'app.subtitle': '循证抑郁自评工具',
  'nav.home': '首页',
  'nav.knowledge': '知识库',
  'lang.toggle': 'English',
  'home.heading': '选择一个评估方案',
  'home.intro':
    '本工具基于国际主流的权威抑郁量表，可单独使用某个量表，也可进行综合评估（多量表整合）。结果含逐题解释与答案解析，仅供参考，非临床诊断。',
  'home.items': '题',
  'home.start': '开始',
  'home.recommended': '推荐',
  'home.comprehensive': '综合评估（多量表整合）',
  'home.comSoon': '即将在 M3 里程碑开放',
  'intake.heading': '个人信息',
  'intake.intro': '以下信息用于更科学地解读结果与给出个性化建议；量表切点固定，不受这些信息影响。所有信息仅存储于本地数据库。',
  'intake.age': '年龄',
  'intake.gender': '性别',
  'intake.gender.male': '男',
  'intake.gender.female': '女',
  'intake.gender.other': '其他 / 不愿透露',
  'intake.episodeDuration': '本次情绪困扰持续时间',
  'intake.duration.none': '少于 2 周',
  'intake.duration.2w': '2 周 – 1 个月',
  'intake.duration.1-3m': '1 – 3 个月',
  'intake.duration.3-12m': '3 – 12 个月',
  'intake.duration.over1y': '超过 1 年',
  'intake.treatmentHistory': '既往治疗史',
  'intake.treatment.none': '从未就诊/治疗',
  'intake.treatment.therapy': '做过心理咨询/治疗',
  'intake.treatment.meds': '服用过抗抑郁药物',
  'intake.treatment.both': '心理治疗 + 药物均有过',
  'intake.treatment.hospital': '曾因情绪问题住院',
  'intake.education': '教育程度',
  'intake.edu.middle': '初中及以下',
  'intake.edu.high': '高中/中专',
  'intake.edu.college': '大专/本科',
  'intake.edu.postgrad': '硕士及以上',
  'intake.occupation': '职业',
  'intake.occ.student': '学生',
  'intake.occ.employed': '在职',
  'intake.occ.freelance': '自由职业',
  'intake.occ.retired': '退休',
  'intake.occ.unemployed': '待业/无业',
  'intake.optional': '（选填）',
  'intake.next': '下一步：开始答题',
  'intake.skip': '跳过，直接答题',
  'assessment.progress': '进度',
  'assessment.question': '第 {i} / {n} 题',
  'assessment.timeframe': '时间范围',
  'assessment.next': '下一题',
  'assessment.prev': '上一题',
  'assessment.finish': '完成并查看结果',
  'assessment.answered': '已答',
  'assessment.unanswered': '未答',
  'password.heading': '设置访问密码',
  'password.intro': '为你的结果链接设置一个密码以保护隐私。之后凭「唯一链接 + 密码」可随时查看本次结果。',
  'password.label': '密码（至少 6 位）',
  'password.confirm': '确认密码',
  'password.submit': '保存并生成结果',
  'password.mismatch': '两次输入的密码不一致',
  'password.tooShort': '密码至少 6 位',
  'result.heading': '评估结果',
  'result.score': '总分',
  'result.severity': '严重度',
  'result.cutoff': '临床参考切点',
  'result.above': '已达到',
  'result.below': '未达到',
  'result.summary': '结果概述',
  'result.advice': '建议',
  'result.basis': '评判依据',
  'result.itemReview': '逐题解释与答案解析',
  'result.yourAnswer': '你的答案',
  'result.scoreContrib': '得分',
  'result.whatItMeasures': '测量维度',
  'result.whyItMatters': '条目解释',
  'result.answerMeaning': '答案解析',
  'result.notable': '阳性频率',
  'result.shareTitle': '你的专属结果链接',
  'result.shareHint': '妥善保管链接与密码；任何人凭这两者都能查看本结果。',
  'result.copy': '复制链接',
  'result.copied': '已复制',
  'result.viewShared': '打开链接查看',
  'result.retake': '重新测评',
  'result.knowledge': '查看自助资料',
  'result.severityPct': '严重度约 {pct}%',
  'result.rawScore': '粗分',
  'result.determination': 'DSM-5 结构化判定',
  'result.symptomCount': '症状数',
  'result.threshold': '阈值',
  'result.coreSymptom': '核心症状',
  'result.additionalCriteria': '附加标准',
  'result.allSatisfied': '均满足',
  'result.notAllSatisfied': '未全部满足',
  'result.reverseScored': '反向计分',
  'result.afterReverse': '反向后',
  'result.gateSatisfied': '标准满足',
  'result.gateNotSatisfied': '标准未满足',
  'comprehensive.title': '综合评估（多量表整合）',
  'comprehensive.progressNote': '依次完成 PHQ-9、SDS、CES-D、BDI-II 与 DSM-5 模块；全部作答后生成整合报告。',
  'comprehensive.integratedSeverity': '整合严重度',
  'comprehensive.concordance': '跨量表一致性',
  'comprehensive.concordance.high': '高',
  'comprehensive.concordance.moderate': '中',
  'comprehensive.concordance.low': '低',
  'comprehensive.perScale': '各量表得分',
  'comprehensive.dsm5Mapping': 'DSM-5 映射',
  'comprehensive.detailedReports': '分量表详细报告',
  'comprehensive.detailedHint': '点击展开查看每个量表的逐题解释与答案解析。',
  'crisis.title': '请立即关注：检测到自伤/自杀意念',
  'crisis.body':
    '你在与自伤或自杀念头相关的条目上为阳性。无论总分高低，这都是最需要优先处理的情况。请立即联系信任的人、当地急救或心理危机热线。你并不孤单，帮助随时可得。',
  'crisis.cn': '中国大陆：全国心理援助热线 12356；北京心理危机研究与干预中心 010-82951332',
  'crisis.us': '美国/加拿大：988 Suicide & Crisis Lifeline（拨打/短信 988）',
  'crisis.intl': '国际查询：findahelpline.com',
  'crisis.emergency': '若情况危急，请立即拨打当地急救电话（如中国大陆 120）。',
  'disclaimer.short': '本工具为筛查/自评用途，不构成临床诊断。如有自伤或自杀念头，请立即联系当地急救或心理危机热线。',
  'footer.newer': '最新版本 v{v} 可用',
  'disclaimer.full':
    '本应用为筛查与自评工具，不构成医学诊断，也不能替代合格医疗/精神科专业人员的评估、诊断或治疗。量表分数仅供参考，存在假阳性/假阴性。任何结论都应结合专业临床评估。若你或他人处于危机中，请立即联系当地急救或心理危机热线。',
  'shared.heading': '查看已保存的结果',
  'shared.passwordLabel': '请输入该链接的访问密码',
  'shared.unlock': '查看结果',
  'shared.notFound': '未找到该结果链接，请检查地址是否正确。',
  'shared.wrongPassword': '密码不正确，请重试。',
  'shared.createdAt': '测评时间',
  'knowledge.heading': '自助知识库',
  'knowledge.intro':
    '以下为循证的抑郁自助资料与权威来源。可下载的工作表（Markdown）可打印或保存使用；外部链接指向 WHO、NIMH、NHS、MSD、Mayo Clinic 等权威机构。',
  'knowledge.download': '下载',
  'knowledge.open': '打开链接',
  'knowledge.disclaimer':
    '这些资料用于自我教育与辅助，不能替代专业的评估、诊断或治疗。如处于危机中，请立即联系当地急救或心理危机热线。',
  'common.loading': '加载中…',
  'common.error': '出错了',
  'common.back': '返回',
  'common.language': '语言',
  'common.yes': '是',
  'common.no': '否'
}

const en: Dict = {
  'app.title': 'Depression Self-Assessment',
  'app.subtitle': 'Evidence-based depression screening',
  'nav.home': 'Home',
  'nav.knowledge': 'Knowledge Base',
  'lang.toggle': '中文',
  'home.heading': 'Choose an assessment scheme',
  'home.intro':
    'This tool is built on internationally recognized, authoritative depression scales. Use a single scale, or a comprehensive multi-scale synthesis. Results include per-item explanations and answer analysis, for reference only — not a clinical diagnosis.',
  'home.items': 'items',
  'home.start': 'Start',
  'home.recommended': 'Recommended',
  'home.comprehensive': 'Comprehensive assessment (multi-scale synthesis)',
  'home.comSoon': 'Arriving in milestone M3',
  'intake.heading': 'Personal information',
  'intake.intro':
    'This information is used to interpret your result more scientifically and give personalized suggestions. Scale cutoffs are fixed and unaffected. All data is stored only in the local database.',
  'intake.age': 'Age',
  'intake.gender': 'Gender',
  'intake.gender.male': 'Male',
  'intake.gender.female': 'Female',
  'intake.gender.other': 'Other / prefer not to say',
  'intake.episodeDuration': 'How long have these mood difficulties lasted?',
  'intake.duration.none': 'Less than 2 weeks',
  'intake.duration.2w': '2 weeks – 1 month',
  'intake.duration.1-3m': '1 – 3 months',
  'intake.duration.3-12m': '3 – 12 months',
  'intake.duration.over1y': 'More than 1 year',
  'intake.treatmentHistory': 'Past treatment history',
  'intake.treatment.none': 'Never sought treatment',
  'intake.treatment.therapy': 'Had psychotherapy/counseling',
  'intake.treatment.meds': 'Took antidepressant medication',
  'intake.treatment.both': 'Both therapy and medication',
  'intake.treatment.hospital': 'Hospitalized for mood problems',
  'intake.education': 'Education level',
  'intake.edu.middle': 'Middle school or below',
  'intake.edu.high': 'High school',
  'intake.edu.college': 'College / Bachelor',
  'intake.edu.postgrad': 'Master or above',
  'intake.occupation': 'Occupation',
  'intake.occ.student': 'Student',
  'intake.occ.employed': 'Employed',
  'intake.occ.freelance': 'Freelance',
  'intake.occ.retired': 'Retired',
  'intake.occ.unemployed': 'Unemployed',
  'intake.optional': '(optional)',
  'intake.next': 'Next: start the questions',
  'intake.skip': 'Skip, go straight to questions',
  'assessment.progress': 'Progress',
  'assessment.question': 'Question {i} / {n}',
  'assessment.timeframe': 'Time frame',
  'assessment.next': 'Next',
  'assessment.prev': 'Back',
  'assessment.finish': 'Finish & see result',
  'assessment.answered': 'answered',
  'assessment.unanswered': 'unanswered',
  'password.heading': 'Set an access password',
  'password.intro':
    'Set a password to protect your result link. You can view this result anytime with the unique link + password.',
  'password.label': 'Password (min 6 characters)',
  'password.confirm': 'Confirm password',
  'password.submit': 'Save & generate result',
  'password.mismatch': 'The two passwords do not match',
  'password.tooShort': 'Password must be at least 6 characters',
  'result.heading': 'Assessment result',
  'result.score': 'Total score',
  'result.severity': 'Severity',
  'result.cutoff': 'Clinical reference cutoff',
  'result.above': 'reached',
  'result.below': 'not reached',
  'result.summary': 'Summary',
  'result.advice': 'Suggestions',
  'result.basis': 'Basis for this judgement',
  'result.itemReview': 'Per-item explanation & answer analysis',
  'result.yourAnswer': 'Your answer',
  'result.scoreContrib': 'Score',
  'result.whatItMeasures': 'What it measures',
  'result.whyItMatters': 'Item explanation',
  'result.answerMeaning': 'Answer analysis',
  'result.notable': 'Positive frequency',
  'result.shareTitle': 'Your private result link',
  'result.shareHint':
    'Keep the link and password safe; anyone with both can view this result.',
  'result.copy': 'Copy link',
  'result.copied': 'Copied',
  'result.viewShared': 'Open link to view',
  'result.retake': 'Retake assessment',
  'result.knowledge': 'View self-help resources',
  'result.severityPct': '~{pct}% severity',
  'result.rawScore': 'Raw score',
  'result.determination': 'DSM-5 structured determination',
  'result.symptomCount': 'Symptom count',
  'result.threshold': 'Threshold',
  'result.coreSymptom': 'Core symptom',
  'result.additionalCriteria': 'Additional criteria',
  'result.allSatisfied': 'all satisfied',
  'result.notAllSatisfied': 'not all satisfied',
  'result.reverseScored': 'Reverse-scored',
  'result.afterReverse': 'after reversal',
  'result.gateSatisfied': 'Criterion satisfied',
  'result.gateNotSatisfied': 'Criterion not satisfied',
  'comprehensive.title': 'Comprehensive assessment (multi-scale integration)',
  'comprehensive.progressNote': 'Complete PHQ-9, SDS, CES-D, BDI-II and the DSM-5 module in turn; an integrated report is generated once all are answered.',
  'comprehensive.integratedSeverity': 'Integrated severity',
  'comprehensive.concordance': 'Cross-scale concordance',
  'comprehensive.concordance.high': 'High',
  'comprehensive.concordance.moderate': 'Moderate',
  'comprehensive.concordance.low': 'Low',
  'comprehensive.perScale': 'Per-scale scores',
  'comprehensive.dsm5Mapping': 'DSM-5 mapping',
  'comprehensive.detailedReports': 'Detailed per-scale reports',
  'comprehensive.detailedHint': 'Click to expand each scale\'s per-item explanation and answer analysis.',
  'crisis.title': 'Immediate attention: self-harm/suicidal thoughts detected',
  'crisis.body':
    'You endorsed the item related to self-harm or suicidal thoughts. Regardless of your total score, this is the highest priority. Please contact someone you trust, local emergency services, or a crisis line right away. You are not alone, and help is available now.',
  'crisis.cn': 'Mainland China: National Psychological Assistance Hotline 12356; Beijing Crisis Intervention Center 010-82951332',
  'crisis.us': 'US/Canada: 988 Suicide & Crisis Lifeline (call/text 988)',
  'crisis.intl': 'International: findahelpline.com',
  'crisis.emergency': 'If this is an emergency, call your local emergency number now (e.g., 120 in Mainland China).',
  'disclaimer.short':
    'This is a screening/self-report tool, not a clinical diagnosis. If you have thoughts of self-harm or suicide, contact local emergency services or a crisis line immediately.',
  'footer.newer': 'v{v} available',
  'disclaimer.full':
    'This application is a screening and self-report tool. It is not a medical diagnosis and does not replace evaluation, diagnosis, or treatment by a qualified medical/psychiatric professional. Scores are for reference only and may yield false positives/negatives. Any conclusion should be combined with professional clinical evaluation. If you or someone else is in crisis, contact local emergency services or a crisis line immediately.',
  'shared.heading': 'View a saved result',
  'shared.passwordLabel': 'Enter the access password for this link',
  'shared.unlock': 'View result',
  'shared.notFound': 'Result link not found. Please check the address.',
  'shared.wrongPassword': 'Incorrect password. Please try again.',
  'shared.createdAt': 'Assessment time',
  'knowledge.heading': 'Self-help knowledge base',
  'knowledge.intro':
    'Evidence-based depression self-help materials and authoritative sources below. Downloadable worksheets (Markdown) can be printed or saved; external links point to WHO, NIMH, NHS, MSD, and Mayo Clinic.',
  'knowledge.download': 'Download',
  'knowledge.open': 'Open link',
  'knowledge.disclaimer':
    'These materials are for self-education and support and do not replace professional assessment, diagnosis, or treatment. If you are in crisis, contact local emergency services or a crisis line immediately.',
  'common.loading': 'Loading…',
  'common.error': 'Something went wrong',
  'common.back': 'Back',
  'common.language': 'Language',
  'common.yes': 'Yes',
  'common.no': 'No'
}

const dicts: Record<Lang, Dict> = { zh, en }

interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: string, vars?: Record<string, string | number>) => string
  pick: (b: Bilingual) => string
  pickList: (b: BilingualList) => string[]
}

const I18nContext = createContext<I18nValue | null>(null)

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem('lang')
    if (v === 'zh' || v === 'en') return v
  } catch {
    /* ignore */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : ''
  return nav.startsWith('zh') ? 'zh' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18nValue>(() => {
    const t = (key: string, vars?: Record<string, string | number>) => {
      let s = dicts[lang][key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
      return s
    }
    return {
      lang,
      setLang: (l: Lang) => setLangState(l),
      toggle: () => setLangState((p) => (p === 'zh' ? 'en' : 'zh')),
      t,
      pick: (b: Bilingual) => (b ? b[lang] : ''),
      pickList: (b: BilingualList) => (b ? b[lang] : [])
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
