import { useState } from 'react'

type Props = {
  year: number
  month: number
  dates: string[]
  onSubmit: (name: string, selectedDates: string[]) => void
}

const ParticipationForm = ({ year, month, dates, onSubmit }: Props) => {
  const [name, setName] = useState('')
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  const handleCheckboxChange = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 親コンポーネントにデータを渡す
    onSubmit(name, selectedDates)
    setName('')
    setSelectedDates([])
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{year}年{month + 1}月 参加フォーム</h3>

      <div>
        <label>名前：</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <p>参加可能な日を選択してください：</p>
        {dates.map(date => (
          <label key={date}>
            <input
              type="checkbox"
              value={date}
              checked={selectedDates.includes(date)}
              onChange={() => handleCheckboxChange(date)}
            />
            {date}
          </label>
        ))}
      </div>

      <button type="submit">送信</button>
    </form>
  )
}

export default ParticipationForm
