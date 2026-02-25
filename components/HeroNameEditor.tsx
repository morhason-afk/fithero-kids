'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './HeroNameEditor.module.css'

const STORAGE_KEY = 'fithero-hero-name'
export const DEFAULT_HERO_NAME = 'FitHero'
const MAX_LENGTH = 20

export function getStoredHeroName(): string {
  if (typeof window === 'undefined') return DEFAULT_HERO_NAME
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s && s.trim()) return s.trim().slice(0, MAX_LENGTH)
  } catch (_) {}
  return DEFAULT_HERO_NAME
}

export function setStoredHeroName(name: string) {
  try {
    const v = name.trim().slice(0, MAX_LENGTH) || DEFAULT_HERO_NAME
    localStorage.setItem(STORAGE_KEY, v)
    return v
  } catch (_) {
    return name
  }
}

interface HeroNameEditorProps {
  isOpen: boolean
  onClose: () => void
  currentName: string
  onSave: (name: string) => void
}

export default function HeroNameEditor({ isOpen, onClose, currentName, onSave }: HeroNameEditorProps) {
  const [value, setValue] = useState(currentName)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (isOpen) {
      setValue(currentName)
      setError(null)
    }
  }, [isOpen, currentName])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please enter a name.')
      return
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Name must be ${MAX_LENGTH} characters or less.`)
      return
    }
    const saved = setStoredHeroName(trimmed)
    onSave(saved)
    onClose()
  }

  if (!mounted || !isOpen) return null

  const content = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.noiseBg} aria-hidden />
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          <h2 className={styles.title}>Name your hero</h2>
          <p className={styles.subtitle}>Choose a name that appears below your character.</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="hero-name-input">Hero name</label>
              <input
                id="hero-name-input"
                type="text"
                className={styles.input}
                value={value}
                onChange={e => setValue(e.target.value.slice(0, MAX_LENGTH))}
                placeholder={DEFAULT_HERO_NAME}
                maxLength={MAX_LENGTH}
                autoFocus
                aria-invalid={!!error}
                aria-describedby={error ? 'hero-name-error' : undefined}
              />
              <span className={styles.charCount}>{value.length} / {MAX_LENGTH}</span>
              {error && <p id="hero-name-error" className={styles.error}>{error}</p>}
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn} disabled={!value.trim()}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
