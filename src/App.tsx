import { useState } from 'react'
import './App.css'
import { getTargetMonths } from './utils/getTargetMonths'
import { getWeekendDates } from './utils/getWeekendDates'
import ParticipationForm from './components/ParticipationForm'

type Participant = {
  name: string
  selectedDates: string[]
}

type MonthData = {
  year: number
  month: number
  participants: Participant[]
  isLocked: boolean
  generatedSchedule: Record<string, string[]> // 追加
}

function App() {
  const months = getTargetMonths()
  const [selectedMonth, setSelectedMonth] = useState(`${months[0].year}-${months[0].month}`)
  const [data, setData] = useState<MonthData[]>([])

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value)
  }

  const [year, month] = selectedMonth.split('-').map(Number)
  const dates = getWeekendDates(year, month)

  const handleFormSubmit = (name: string, selectedDates: string[]) => {
    const newData = [...data]
    let currentMonth = newData.find(d => d.year === year && d.month === month)

    if (!currentMonth) {
      currentMonth = {
        year,
        month,
        participants: [],
        isLocked: false,
        generatedSchedule: {}
      }
      newData.push(currentMonth)
    }

    const alreadySelectedDates = currentMonth.participants
      .filter(p => p.name === name)
      .flatMap(p => p.selectedDates)

    const invalidDates = selectedDates.filter(date => alreadySelectedDates.includes(date))
    if (invalidDates.length > 0) {
      alert(`${name}さんはすでに ${invalidDates.join(', ')} に参加しています。重複を避けてください。`)
      return
    }

    currentMonth.participants.push({ name, selectedDates })

    if (currentMonth.participants.length === 8) {
      currentMonth.isLocked = true
      currentMonth.generatedSchedule = generateShiftSchedule(currentMonth.participants, dates)
    }

    setData(newData)
  }

  const currentMonthData = data.find(d => d.year === year && d.month === month)
  const isFormVisible = currentMonthData ? !currentMonthData.isLocked : true

  const generateShiftSchedule = (participants: Participant[], dates: string[]): Record<string, string[]> => {
    const nameCount: Record<string, number> = {}
    const history: Record<string, string[]> = {} // date => names
    const previousDateMap: Record<string, string> = {}

    // 参加希望者からその人が参加可能な日程のマップを作成
    const availability: Record<string, string[]> = {} // name => dates
    participants.forEach(p => {
      availability[p.name] = p.selectedDates
      nameCount[p.name] = 0
    })

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      const prevDate = dates[i - 1] || ""

      const candidates = participants
        .map(p => p.name)
        .filter(name => {
          const avails = availability[name] || []
          const prev = history[prevDate] || []
          const participatedBefore = Object.values(history).filter(members => members.includes(name)).length

          return (
            avails.includes(date) &&
            !(prev.includes(name)) &&
            participatedBefore < 3
          )
        })

      const combinations: string[][] = getCombinations(candidates, 4)

      let selected: string[] = []
      for (const combo of combinations) {
        const alreadyUsed = Object.values(history).filter(c => {
          return c.length === 4 && c.every(name => combo.includes(name))
        }).length

        if (alreadyUsed < 1) {
          selected = combo
          break
        }
      }

      selected.forEach(name => nameCount[name]++)
      history[date] = selected
    }

    return history
  }

  const getCombinations = (arr: string[], k: number): string[][] => {
    const result: string[][] = []
    const recurse = (path: string[], start: number) => {
      if (path.length === k) {
        result.push([...path])
        return
      }
      for (let i = start; i < arr.length; i++) {
        path.push(arr[i])
        recurse(path, i + 1)
        path.pop()
      }
    }
    recurse([], 0)
    return result
  }

  return (
    <div className="App">
      <h1>麻雀シフト管理アプリ</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>表示する月を選択：</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map(({ year, month }) => (
            <option key={`${year}-${month}`} value={`${year}-${month}`}>
              {`${year}年${month + 1}月`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2>{year}年{month + 1}月の土日</h2>
        <ul>
          {dates.map(date => (
            <li key={date}>{date}</li>
          ))}
        </ul>
      </div>

      {isFormVisible && (
        <ParticipationForm year={year} month={month} dates={dates} onSubmit={handleFormSubmit} />
      )}

      {currentMonthData && currentMonthData.isLocked && (
        <div>
          <h3>各個人の参加日</h3>
          <ul>
            {currentMonthData.participants.map((participant, index) => (
              <li key={index}>
                {participant.name}: {participant.selectedDates.join(', ')}
              </li>
            ))}
          </ul>

          <h3>シフト表 (自動割り当て済み)</h3>
          <ul>
            {dates.map(date => (
              <li key={date}>
                <strong>{date}</strong>: {currentMonthData.generatedSchedule[date]?.join(', ') || '開催なし'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App