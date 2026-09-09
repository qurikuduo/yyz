import type {
  ComprehensiveBattery,
  Intake,
  Lang,
  ScaleDef,
  ScaleSummary,
  SubmitResponse,
  UnlockResponse
} from '../types'

const BASE = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`
    throw Object.assign(new Error(message), { status: res.status })
  }
  return data as T
}

export function fetchScales() {
  return request<{ scales: ScaleSummary[]; comprehensive: ComprehensiveBattery }>('/scales')
}

export function fetchScale(id: string) {
  return request<ScaleDef>(`/scales/${encodeURIComponent(id)}`)
}

export function fetchComprehensiveBattery() {
  return request<{ comprehensive: ComprehensiveBattery; scales: ScaleDef[] }>(
    '/scales/comprehensive/battery'
  )
}

export interface SubmitPayload {
  scheme: string
  language: Lang
  intake: Intake
  answers: { itemId: string; value: number }[]
  password: string
}

export function submitAssessment(payload: SubmitPayload) {
  return request<SubmitResponse>('/assessments', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchAssessmentMeta(token: string) {
  return request<{ exists: boolean; scheme: string; language: Lang; crisis: boolean; createdAt: string }>(
    `/assessments/${encodeURIComponent(token)}/meta`
  )
}

export function unlockAssessment(token: string, password: string) {
  return request<UnlockResponse>(`/assessments/${encodeURIComponent(token)}/unlock`, {
    method: 'POST',
    body: JSON.stringify({ password })
  })
}
