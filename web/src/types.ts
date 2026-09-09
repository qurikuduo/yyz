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
  crisis?: boolean
}

export interface ScaleBand {
  min?: number
  max?: number
  severity: string
  label: Bilingual
}

export interface ScaleSummary {
  id: string
  name: Bilingual
  shortName: Bilingual
  description: Bilingual
  itemCount: number
  scoring: {
    type: string
    perItemMin?: number
    perItemMax?: number
    itemMin?: number
    itemMax?: number
    totalRange: [number, number]
  }
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
  scoring: ScaleSummary['scoring']
  clinicalCutoff: number | null
  bands: ScaleBand[]
  options: ScaleOption[]
  items: ScaleItem[]
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
  explanation: Bilingual
  selectedValue: number
  selectedLabel: Bilingual | null
  selectedMeaning: Bilingual | null
  scoreContribution: number
  isCrisisItem: boolean
  crisisEndorsed: boolean
  notable: boolean
}

export interface AssessmentResult {
  scheme: string
  schemeName: Bilingual
  total: number
  maxTotal: number
  minTotal: number
  normalized: number
  severity: string
  severityLabel: Bilingual
  clinicalCutoff: number | null
  aboveCutoff: boolean | null
  crisis: boolean
  advice: Bilingual | null
  summary: Bilingual
  basis: BilingualList
  notableCount: number
  items: ResultItem[]
}

export interface SubmitResponse {
  token: string
  shareUrl: string
  scheme: string
  language: Lang
  crisis: boolean
  result: AssessmentResult
}

export interface UnlockResponse {
  token: string
  scheme: string
  language: Lang
  crisis: boolean
  createdAt: string
  intake: Intake
  answers: { itemId: string; value: number }[]
  result: AssessmentResult
  comprehensive: unknown | null
}
