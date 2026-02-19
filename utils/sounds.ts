// Simple sound effects using Web Audio API
export function playSound(type: 'encourage' | 'countdown' | 'complete') {
  if (typeof window === 'undefined') return
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  let frequency = 440
  let duration = 0.1
  
  switch (type) {
    case 'encourage':
      frequency = 600
      duration = 0.15
      break
    case 'countdown':
      frequency = 800
      duration = 0.2
      break
    case 'complete':
      frequency = 523 // C note
      duration = 0.3
      break
  }
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}
