import { WeeklyProgress, WeeklyGoal } from '@/types/weeklyGoal'

export function getCurrentWeekStart(): number {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust to Monday
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.getTime()
}

export function isNewWeek(progress: WeeklyProgress | null): boolean {
  if (!progress) return true
  const currentWeekStart = getCurrentWeekStart()
  return progress.weekStartDate !== currentWeekStart
}

export function resetWeeklyProgress(): WeeklyProgress {
  return {
    weekStartDate: getCurrentWeekStart(),
    starsEarned: 0,
    completed: false,
  }
}

export function addStarsToWeeklyProgress(
  progress: WeeklyProgress,
  stars: number,
  goal: WeeklyGoal
): WeeklyProgress {
  const newStarsEarned = progress.starsEarned + stars
  const completed = newStarsEarned >= goal.starsRequired && !progress.completed

  return {
    ...progress,
    starsEarned: newStarsEarned,
    completed,
    completedDate: completed ? Date.now() : progress.completedDate,
  }
}

export async function sendNotification(goal: WeeklyGoal, childName: string = 'Your child') {
  const message = `${childName} completed their weekly goal! They earned ${goal.starsRequired} stars and deserve ${goal.giftDescription}! 🎉`

  switch (goal.notificationMethod) {
    case 'email':
      if (goal.notificationContact) {
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: goal.notificationContact,
              subject: 'Weekly Goal Completed! 🎉',
              message: message,
            }),
          })

          const result = await response.json()

          if (response.ok) {
            console.log('✅ Email sent successfully:', result)
            // Show success message to user
            if (typeof window !== 'undefined') {
              alert(`✅ Email notification sent to ${goal.notificationContact}!`)
            }
          } else {
            console.error('❌ Failed to send email:', result.error)
            // Fallback to mailto if API fails
            if (typeof window !== 'undefined') {
              const useMailto = confirm(
                `Failed to send email automatically: ${result.error}\n\nWould you like to open your email client instead?`
              )
              if (useMailto) {
                window.open(`mailto:${goal.notificationContact}?subject=Weekly Goal Completed!&body=${encodeURIComponent(message)}`)
              }
            }
          }
        } catch (error) {
          console.error('❌ Error sending email:', error)
          // Fallback to mailto on error
          if (typeof window !== 'undefined') {
            const useMailto = confirm(
              `Error sending email: ${error instanceof Error ? error.message : 'Unknown error'}\n\nWould you like to open your email client instead?`
            )
            if (useMailto) {
              window.open(`mailto:${goal.notificationContact}?subject=Weekly Goal Completed!&body=${encodeURIComponent(message)}`)
            }
          }
        }
      }
      break
    case 'whatsapp':
      if (goal.notificationContact) {
        // WhatsApp link
        const whatsappMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${goal.notificationContact.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`, '_blank')
      }
      break
    case 'push':
      // Browser push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Weekly Goal Completed! 🎉', {
          body: message,
          icon: '/favicon.ico',
        })
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Weekly Goal Completed! 🎉', {
              body: message,
              icon: '/favicon.ico',
            })
          }
        })
      }
      break
    case 'message':
      // Show alert/modal
      alert(message)
      break
  }
}
