'use client'

import { useState, useRef, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
import { playSound } from '@/utils/sounds'
import styles from './CameraRecorder.module.css'

interface CameraRecorderProps {
  challenge: Challenge
  onVideoRecorded: (blob: Blob) => void
  onCancel: () => void
}

export default function CameraRecorder({ challenge, onVideoRecorded, onCancel }: CameraRecorderProps) {
  const { t } = useLanguage()
  const [isRecording, setIsRecording] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(challenge.duration)
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [encouragementMessage, setEncouragementMessage] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const encouragementTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const motionLevelRef = useRef<number>(0)
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null)
  const MOTION_THRESHOLD = 2.5

  useEffect(() => {
    initializeCamera()
    return () => {
      cleanup()
    }
  }, [])

  // When we have a stream and the video element is in the DOM, attach and play
  useEffect(() => {
    if (cameraStatus !== 'ready' || !streamRef.current) return
    const stream = streamRef.current
    const attach = () => {
      if (!videoRef.current) return
      const video = videoRef.current
      if (video.srcObject === stream) return
      video.srcObject = stream
      video.muted = true
      video.playsInline = true
      video.play().catch((e) => console.error('Video play error:', e))
    }
    // Ref may not be set until after paint
    requestAnimationFrame(() => {
      attach()
      if (!videoRef.current) setTimeout(attach, 100)
    })
  }, [cameraStatus])

  // Simple motion detection: sample video frames and compare to previous
  useEffect(() => {
    if (!isRecording || !videoRef.current || videoRef.current.readyState < 2) return
    const video = videoRef.current
    let canvas = canvasRef.current
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 48
      canvasRef.current = canvas
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const interval = setInterval(() => {
      if (!video || video.readyState < 2) return
      try {
        ctx.drawImage(video, 0, 0, canvas!.width, canvas!.height)
        const data = ctx.getImageData(0, 0, canvas!.width, canvas!.height).data
        if (prevFrameRef.current && prevFrameRef.current.length === data.length) {
          let sum = 0
          for (let i = 0; i < data.length; i += 4) {
            sum += Math.abs(data[i] - prevFrameRef.current[i]) + Math.abs(data[i + 1] - prevFrameRef.current[i + 1]) + Math.abs(data[i + 2] - prevFrameRef.current[i + 2])
          }
          const meanDiff = sum / (data.length / 4) / 3
          motionLevelRef.current = meanDiff
        }
        prevFrameRef.current = data.slice(0)
      } catch {
        // ignore
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [isRecording])

  useEffect(() => {
    if (isRecording && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1
          const hasGoodMotion = motionLevelRef.current >= MOTION_THRESHOLD

          const positiveMessages = [
            { time: challenge.duration - 3, msg: 'Great start! Keep going! 💪', sound: 'encourage' as const },
            { time: Math.floor(challenge.duration * 0.7), msg: "You're doing great! 🌟", sound: 'encourage' as const },
            { time: Math.floor(challenge.duration * 0.5), msg: 'Halfway there! Keep it up! 🔥', sound: 'encourage' as const },
            { time: Math.floor(challenge.duration * 0.3), msg: "You're amazing! 💪", sound: 'encourage' as const },
            { time: 5, msg: 'Almost there! 5 more seconds! ⏱️', sound: 'countdown' as const },
            { time: 3, msg: '3... Keep it up! 🔥', sound: 'countdown' as const },
            { time: 2, msg: '2... Almost done! 🎯', sound: 'countdown' as const },
            { time: 1, msg: '1... Last second! 🚀', sound: 'countdown' as const },
          ]
          const lowMotionMessages = [
            { time: challenge.duration - 3, msg: "Let's see those moves! Get moving! 💪", sound: 'encourage' as const },
            { time: Math.floor(challenge.duration * 0.7), msg: 'Keep moving! Show us your best! 🏃', sound: 'encourage' as const },
            { time: Math.floor(challenge.duration * 0.5), msg: 'Keep going! Move your body! 🔥', sound: 'encourage' as const },
            { time: Math.floor(challenge.duration * 0.3), msg: 'Almost there — keep moving! 💪', sound: 'encourage' as const },
            { time: 5, msg: '5 seconds left — give it your all! ⏱️', sound: 'countdown' as const },
            { time: 3, msg: '3... Keep moving! 🔥', sound: 'countdown' as const },
            { time: 2, msg: '2... Push through! 🎯', sound: 'countdown' as const },
            { time: 1, msg: '1... Last second! 🚀', sound: 'countdown' as const },
          ]

          const messages = hasGoodMotion ? positiveMessages : lowMotionMessages
          const encouragement = messages.find(e => e.time === newTime)
          if (encouragement) {
            showEncouragement(encouragement.msg, encouragement.sound)
          }

          if (newTime === 0) {
            showEncouragement(hasGoodMotion ? 'Awesome! You did it! 🎉' : 'Done! Keep practicing to earn more stars! 🌟', 'complete')
            playSound('complete')
            stopRecording()
            return 0
          }

          return newTime
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (encouragementTimeoutRef.current) {
        clearTimeout(encouragementTimeoutRef.current)
      }
    }
  }, [isRecording, timeRemaining, challenge.duration])

  const showEncouragement = (message: string, soundType: 'encourage' | 'countdown' | 'complete' = 'encourage') => {
    setEncouragementMessage(message)
    playSound(soundType)
    
    // Clear message after 2 seconds
    if (encouragementTimeoutRef.current) {
      clearTimeout(encouragementTimeoutRef.current)
    }
    encouragementTimeoutRef.current = setTimeout(() => {
      setEncouragementMessage(null)
    }, 2000)
  }

  const initializeCamera = async () => {
    try {
      setCameraStatus('loading')
      setError(null)

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      })
      
      streamRef.current = stream
      // Attach to video immediately (video element exists in loading state)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        videoRef.current.playsInline = true
        videoRef.current.play().catch((e) => console.error('Video play error:', e))
      }
      setCameraStatus('ready')
      setError(null)
    } catch (err: any) {
      console.error('Error accessing camera:', err)
      setCameraStatus('error')
      const errorMessage = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
        ? 'Camera permission was denied. Please allow camera access in your browser settings and try again.'
        : err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'
        ? 'No camera found. Please connect a camera and try again.'
        : 'Could not access camera. Please check your camera permissions and try again.'
      setError(errorMessage)
    }
  }

  const startRecording = () => {
    if (!streamRef.current) {
      setError('Camera not available')
      return
    }

    try {
      // Try different MIME types for better browser compatibility
      const options = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ]
      
      let mediaRecorder: MediaRecorder | null = null
      for (const mimeType of options) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          try {
            mediaRecorder = new MediaRecorder(streamRef.current, { mimeType })
            break
          } catch (e) {
            continue
          }
        }
      }
      
      if (!mediaRecorder) {
        mediaRecorder = new MediaRecorder(streamRef.current)
      }

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: chunksRef.current[0]?.type || 'video/webm' 
        })
        onVideoRecorded(blob)
        cleanup()
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setTimeRemaining(challenge.duration)
      setError(null)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording. Please try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  if (cameraStatus === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>{t('Requesting camera access...')}</div>
        <div className={styles.loadingSubtext}>{t('Please allow camera access when prompted')}</div>
        {/* Video element must exist so ref is set when stream arrives */}
        <video ref={videoRef} autoPlay playsInline muted className={styles.videoHidden} />
      </div>
    )
  }

  if (cameraStatus === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Camera access denied'}</p>
          <button className={styles.button} onClick={initializeCamera}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎥 Recording Your Challenge</h2>
      
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={styles.video}
        />
        
        {/* Game HUD Overlay */}
        {isRecording && (
          <>
            <div className={styles.recordingIndicator}>
              <span className={styles.recordingDot}></span>
              REC
            </div>
            <div className={styles.timerOverlay}>
              <span className={styles.timerValue}>{timeRemaining}</span>
            </div>
            {encouragementMessage && (
              <div className={styles.encouragementMessage}>
                {encouragementMessage}
              </div>
            )}
            <div className={styles.progressBarOverlay}>
              <div 
                className={styles.progressBarFill}
                style={{ width: `${((challenge.duration - timeRemaining) / challenge.duration) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.controls}>
        {!isRecording ? (
          <button className={styles.recordButton} onClick={startRecording}>
            ▶️ Start Recording
          </button>
        ) : (
          <p className={styles.recordingHint}>{t('Recording… Complete the challenge to finish.')}</p>
        )}
      </div>

      <div className={styles.instructions}>
        <p>💡 Tips:</p>
        <ul>
          <li>Make sure you're in a well-lit area</li>
          <li>Stay in frame during the entire exercise</li>
          <li>Follow the exercise instructions carefully</li>
        </ul>
      </div>
    </div>
  )
}
