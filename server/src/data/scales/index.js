import { phq9 } from './phq9.js'

// Scale registry. Additional scales (phq2, sds, cesd, bdii, dsm5) are added in M3.
const scales = [phq9]

const byId = new Map(scales.map((s) => [s.id, s]))

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
      scoring: s.scoring,
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
