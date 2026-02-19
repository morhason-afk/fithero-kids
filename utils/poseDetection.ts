import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'

let detector: poseDetection.PoseDetector | null = null
let isInitialized = false

export async function initializePoseDetector(): Promise<poseDetection.PoseDetector> {
  if (detector) {
    return detector
  }

  // Initialize TensorFlow.js backend
  if (!isInitialized) {
    try {
      // Set backend to webgl (more compatible than webgpu)
      await tf.setBackend('webgl')
      await tf.ready()
      isInitialized = true
    } catch (error) {
      console.warn('WebGL backend not available, trying CPU backend:', error)
      try {
        await tf.setBackend('cpu')
        await tf.ready()
        isInitialized = true
      } catch (cpuError) {
        console.error('Failed to initialize TensorFlow.js:', cpuError)
        throw new Error('Failed to initialize TensorFlow.js backend')
      }
    }
  }

  const model = poseDetection.SupportedModels.MoveNet
  detector = await poseDetection.createDetector(model, {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  })

  return detector
}

export async function detectPose(
  detector: poseDetection.PoseDetector,
  video: HTMLVideoElement
): Promise<poseDetection.Pose | null> {
  try {
    const poses = await detector.estimatePoses(video)
    return poses.length > 0 ? poses[0] : null
  } catch (error) {
    console.error('Error detecting pose:', error)
    return null
  }
}

export function getHandPositions(pose: poseDetection.Pose | null): {
  leftWrist: { x: number; y: number } | null
  rightWrist: { x: number; y: number } | null
  leftElbow: { x: number; y: number } | null
  rightElbow: { x: number; y: number } | null
} {
  if (!pose) {
    return {
      leftWrist: null,
      rightWrist: null,
      leftElbow: null,
      rightElbow: null,
    }
  }

  const keypoints = pose.keypoints
  const leftWrist = keypoints.find(kp => kp.name === 'left_wrist')
  const rightWrist = keypoints.find(kp => kp.name === 'right_wrist')
  const leftElbow = keypoints.find(kp => kp.name === 'left_elbow')
  const rightElbow = keypoints.find(kp => kp.name === 'right_elbow')

  return {
    leftWrist: leftWrist && leftWrist.score && leftWrist.score > 0.5 ? { x: leftWrist.x, y: leftWrist.y } : null,
    rightWrist: rightWrist && rightWrist.score && rightWrist.score > 0.5 ? { x: rightWrist.x, y: rightWrist.y } : null,
    leftElbow: leftElbow && leftElbow.score && leftElbow.score > 0.5 ? { x: leftElbow.x, y: leftElbow.y } : null,
    rightElbow: rightElbow && rightElbow.score && rightElbow.score > 0.5 ? { x: rightElbow.x, y: rightElbow.y } : null,
  }
}

export function checkCollision(
  point: { x: number; y: number },
  object: { x: number; y: number; size: number }
): boolean {
  const distance = Math.sqrt(
    Math.pow(point.x - object.x, 2) + Math.pow(point.y - object.y, 2)
  )
  return distance < object.size / 2
}

export function isPunching(
  wrist: { x: number; y: number } | null,
  elbow: { x: number; y: number } | null,
  previousWrist: { x: number; y: number } | null
): boolean {
  if (!wrist || !previousWrist) return false
  
  // Simplified: Check if wrist moved significantly (any direction)
  const movement = Math.sqrt(
    Math.pow(wrist.x - previousWrist.x, 2) + Math.pow(wrist.y - previousWrist.y, 2)
  )
  
  // Lower threshold - any significant hand movement counts
  if (movement > 15) return true
  
  // Also check arm extension if elbow is available
  if (elbow) {
    const armExtension = Math.sqrt(
      Math.pow(wrist.x - elbow.x, 2) + Math.pow(wrist.y - elbow.y, 2)
    )
    // Lower threshold for arm extension
    if (armExtension > 50) return true
  }
  
  return false
}

export function isHandMoving(
  wrist: { x: number; y: number } | null,
  previousWrist: { x: number; y: number } | null,
  threshold: number = 10
): boolean {
  if (!wrist || !previousWrist) return false
  
  const movement = Math.sqrt(
    Math.pow(wrist.x - previousWrist.x, 2) + Math.pow(wrist.y - previousWrist.y, 2)
  )
  
  return movement > threshold
}
