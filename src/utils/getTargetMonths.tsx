// src/utils/getTargetMonths.ts
export function getTargetMonths(): { year: number; month: number }[] {
  const today = new Date()
  const result = []

  for (let i = 0; i < 3; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
    result.push({ year: date.getFullYear(), month: date.getMonth() })
  }

  return result
}
