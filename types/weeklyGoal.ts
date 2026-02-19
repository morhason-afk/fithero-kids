export interface WeeklyGoal {
  starsRequired: number
  giftDescription: string
  notificationMethod: 'email' | 'whatsapp' | 'push' | 'message'
  notificationContact?: string // email, phone, etc.
}

export interface WeeklyProgress {
  weekStartDate: number // Timestamp of Monday of current week
  starsEarned: number
  completed: boolean
  completedDate?: number
}
