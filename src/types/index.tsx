export interface Participant {
  name: string
  availableDates: string[]
}

export interface Shift {
  date: string
  members: string[]
}
