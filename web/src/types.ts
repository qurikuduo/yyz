export type Lang = 'zh' | 'en'

export interface Bilingual {
  zh: string
  en: string
}

export interface BilingualList {
  zh: string[]
  en: string[]
}

export interface ScaleOption {
  value: number
  label: Bilingual
  meaning: Bilingual
}

export interface ScaleItem {
  id: string
  text: Bilingual
  domain: Bilingual
  dsm5?: string | null
  kind?: string
  gateKey?: string | null
  reverse?: boolean
  crisis?: boolean
  options?: ScaleOption[] | null
}

export interface ScaleBand {
  min?: number
  max?: number
  severity: string
  label: Bilingual
}

export interface ScoringDef {
  type: string
  perItemMin?: number
  perItemMax?: number
  itemMin?: number
  itemMax?: number
  totalRange?: [number, number]
  threshold?: number
  coreRequired?: string[]
  derived?: {
    label: Bilingual
    factor: number
    range: [number, number]
    bandOn?: string
  }
}

export interface ScaleSummary {
  id: string
  name: Bilingual
  shortName: Bilingual
  description: Bilingual
  itemCount: number
  scoring: ScoringDef
  copyright: { status: string; note: Bilingual }
  reference: string
}

export interface ScaleDef {
  id: string
  name: Bilingual
  shortName: Bilingual
  description: Bilingual
  timeframe: Bilingual
  copyright: { status: string; note: Bilingual }
  reference: string
  scoring: ScoringDef
  clinicalCutoff: number | null
  bands: ScaleBand[]
  options: ScaleOption[] | null
  items: ScaleItem[]
}

export interface ComprehensiveBattery {
  id: string
  name: Bilingual
  shortName: Bilingual
  description: Bilingual
  quantitative: string[]
  categorical: string[]
}

export interface Intake {
  age?: number | ''
  gender?: string
  episodeDuration?: string
  treatmentHistory?: string
  education?: string
  occupation?: string
}

export interface ResultItem {
  itemId: string
  index: number
  text: Bilingual
  domain: Bilingual
  dsm5: string | null
  kind: string
  reverse: boolean
  explanation: Bilingual
  selectedValue: number
  selectedLabel: Bilingual | null
  selectedMeaning: Bilingual | null
  scoreContribution: number
  isCrisisItem: boolean
  crisisEndorsed: boolean
  gateSatisfied: boolean | null
  notable: boolean
}

export interface Determination {
  count: number
  threshold: number
  coreRequired: string[]
  coreMet: boolean
  symptomsMet: boolean
  gatesMet: boolean
  level: string
  label: Bilingual | null
  gates: { itemId: string; gateKey: string; text: Bilingual; satisfied: boolean }[]
}

export interface DerivedScore {
  label: Bilingual
  value: number
  range: [number, number]
}

export interface AssessmentResult {
  scheme: string
  schemeName: Bilingual
  scoringType: string
  total: number
  maxTotal: number
  minTotal: number
  derived: DerivedScore | null
  normalized: number
  severity: string
  severityLabel: Bilingual
  clinicalCutoff: number | null
  aboveCutoff: boolean | null
  determination: Determination | null
  crisis: boolean
  advice: Bilingual | null
  summary: Bilingual
  basis: BilingualList
  notableCount: number
  items: ResultItem[]
}

export interface ComprehensiveIncluded {
  id: string
  shortName: Bilingual
  scoringType: string
  total: number
  maxTotal: number
  derived: DerivedScore | null
  severity: string
  severityLabel: Bilingual
  normalized: number
  weight: number | null
  determination: Determination | null
}

export interface ComprehensiveReport {
  scheme: 'comprehensive'
  schemeName: Bilingual
  included: ComprehensiveIncluded[]
  integrated: {
    severity: number
    severityPct: number
    band: string
    bandLabel: Bilingual
    weightsUsed: { id: string; weight: number }[]
  }
  concordance: { level: string; sd: number; spread: number; count: number }
  dsm5: {
    level: string
    count: number
    threshold: number
    coreMet: boolean
    symptomsMet: boolean
    gatesMet: boolean
    label: Bilingual | null
    gates: { itemId: string; gateKey: string; text: Bilingual; satisfied: boolean }[]
  } | null
  crisis: boolean
  crisisScales: Bilingual[]
  advice: Bilingual | null
  summary: Bilingual
  basis: BilingualList
}

export interface SubmitResponse {
  token: string
  shareUrl: string
  scheme: string
  language: Lang
  crisis: boolean
  result: AssessmentResult | null
  results: AssessmentResult[] | null
  comprehensive: ComprehensiveReport | null
}

export interface UnlockResponse {
  token: string
  scheme: string
  language: Lang
  crisis: boolean
  createdAt: string
  intake: Intake
  answers: { itemId: string; value: number }[]
  result: AssessmentResult | null
  results: AssessmentResult[] | null
  comprehensive: ComprehensiveReport | null
}
