import { Shift } from '../types'

interface Props {
  shifts: Shift[]
}

const ShiftDisplay = ({ shifts }: Props) => {
  return (
    <div>
      <h2>確定シフト</h2>
      {shifts.map((shift, i) => (
        <div key={i}>
          <strong>{shift.date}</strong>：{shift.members.join(', ')}
        </div>
      ))}
    </div>
  )
}

export default ShiftDisplay
