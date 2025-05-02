export function getWeekendDates(year: number, month: number): string[] {
  const result: string[] = []
  const date = new Date(year, month, 1)

  while (date.getMonth() === month) {
    const day = date.getDay()
    if (day === 0 || day === 6) {
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      result.push(`${yyyy}-${mm}-${dd}`)
    }
    date.setDate(date.getDate() + 1)
  }

  return result
}
