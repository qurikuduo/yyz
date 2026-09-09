import { phq9 } from './phq9.js'
import { phq2 } from './phq2.js'
import { sds } from './sds.js'
import { cesd } from './cesd.js'
import { bdii } from './bdii.js'
import { dsm5 } from './dsm5.js'

// Scale registry.
const scales = [phq2, phq9, sds, cesd, bdii, dsm5]

const byId = new Map(scales.map((s) => [s.id, s]))

// The comprehensive battery: quantitative severity scales + the DSM-5 categorical module.
// Quantitative scales contribute to the integrated severity; DSM-5 provides the diagnostic anchor.
export const comprehensiveBattery = {
  id: 'comprehensive',
  order: 100,
  name: { zh: '综合评估（多量表整合）', en: 'Comprehensive assessment (multi-scale integration)' },
  shortName: { zh: '综合评估', en: 'Comprehensive' },
  description: {
    zh: '一次完成 PHQ-9、SDS、CES-D、BDI-II 四个循证量表并按 DSM-5 标准整合：给出加权整合严重度、跨量表一致性、DSM-5 映射与整合叙述。',
    en: 'Complete PHQ-9, SDS, CES-D and BDI-II in one pass, integrated against DSM-5: yields a weighted integrated severity, cross-scale concordance, DSM-5 mapping and an integrated narrative.'
  },
  quantitative: ['phq9', 'sds', 'cesd', 'bdii'],
  categorical: ['dsm5']
}

export function listScales() {
  return scales
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => ({
      id: s.id,
      name: s.name,
      shortName: s.shortName,
      description: s.description,
      itemCount: s.items.length,
      scoring: { type: s.scoring.type, totalRange: s.scoring.totalRange },
      copyright: s.copyright,
      reference: s.reference
    }))
}

export function getScale(id) {
  return byId.get(id) || null
}

export function allScales() {
  return scales
}

/** Full definitions for every scale in the comprehensive battery, in order. */
export function comprehensiveScales() {
  return [...comprehensiveBattery.quantitative, ...comprehensiveBattery.categorical]
    .map((id) => byId.get(id))
    .filter(Boolean)
}
