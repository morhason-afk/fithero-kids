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

const HERO_NAME_STORAGE_KEY = 'fithero-hero-name'

function getChildNameFromStorage(): string {
  if (typeof window === 'undefined') return 'Your child'
  try {
    const s = localStorage.getItem(HERO_NAME_STORAGE_KEY)
    if (s && s.trim()) return s.trim().slice(0, 20)
  } catch (_) {}
  return 'Your child'
}

export async function sendNotification(goal: WeeklyGoal, childName?: string) {
  const name = childName ?? getChildNameFromStorage()
  const message = `${name} completed their weekly goal! They earned ${goal.starsRequired} stars and deserve ${goal.giftDescription}! 🎉`

  switch (goal.notificationMethod) {
    case 'email':
      if (goal.notificationContact) {
        try {
          // Use absolute URL so production (e.g. Netlify) always hits the correct host
          const apiUrl =
            typeof window !== 'undefined'
              ? `${window.location.origin}/api/send-email`
              : '/api/send-email'
          const response = await fetch(apiUrl, {
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
            if (typeof window !== 'undefined') {
              alert(`✅ Email notification sent to ${goal.notificationContact}!`)
            }
          } else {
            const errMsg = result?.error || result?.details || `HTTP ${response.status}`
            console.error('❌ Failed to send email:', errMsg)
            if (typeof window !== 'undefined') {
              const hint =
                response.status === 503
                  ? '\n\nTip: On Netlify, add RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) in Site settings → Environment variables.'
                  : ''
              const useMailto = confirm(
                `Failed to send email: ${errMsg}${hint}\n\nWould you like to open your email client instead?`
              )
              if (useMailto) {
                window.open(`mailto:${goal.notificationContact}?subject=Weekly Goal Completed!&body=${encodeURIComponent(message)}`)
              }
            }
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error'
          console.error('❌ Error sending email:', error)
          if (typeof window !== 'undefined') {
            const useMailto = confirm(
              `Could not reach the email server: ${errMsg}\n\nWould you like to open your email client instead?`
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
