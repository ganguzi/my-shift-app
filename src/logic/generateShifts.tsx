import { Participant, Shift } from '../types'

function isConsecutive(date: string, lastDate: string | null): boolean {
  if (!lastDate) return false
  const d1 = new Date(date)
  const d2 = new Date(lastDate)
  return (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24) === 1
}

export function generateShifts(participants: Participant[]): Shift[] {
  const dates = [
    '2025-05-03', '2025-05-04',
    '2025-05-10', '2025-05-11',
    '2025-05-17', '2025-05-18',
    '2025-05-24', '2025-05-25'
  ]

  const result: Shift[] = []
  const history = new Map<string, string[]>()
  const count = new Map<string, number>()
  const lastDate = new Map<string, string>()

  for (const date of dates) {
    const available = participants.filter(p =>
      p.availableDates.includes(date) &&
      !isConsecutive(date, lastDate.get(p.name))
    )

    const sorted = available.sort((a, b) =>
      (count.get(a.name) ?? 0) - (count.get(b.name) ?? 0)
    )

    const selected: string[] = []
    for (const p of sorted) {
      if (selected.length >= 4) break
      const comboConflict = result.some(shift =>
        shift.members.includes(p.name) &&
        shift.members.filter(m => selected.includes(m)).length >= 3
      )
      if (comboConflict) continue
      selected.push(p.name)
      lastDate.set(p.name, date)
      count.set(p.name, (count.get(p.name) ?? 0) + 1)
    }

    if (selected.length === 4) {
      result.push({ date, members: selected })
    }
  }

  return result
}
