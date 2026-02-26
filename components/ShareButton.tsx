'use client'

import { useRef, useCallback, useState } from 'react'
import { toPng } from 'html-to-image'
import { useHero } from '@/contexts/HeroContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getOutfitById, DEFAULT_OUTFIT_ID } from '@/data/characterOptions'
import styles from './ShareButton.module.css'

const APP_NAME = 'FitHero Kids'
const SHARE_HASHTAG = '#FitHeroKids'

function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then((r) => r.blob())
}

interface ShareButtonProps {
  shareContainerRef: React.RefObject<HTMLDivElement | null>
}

export default function ShareButton({ shareContainerRef }: ShareButtonProps) {
  const { hero } = useHero()
  const { t } = useLanguage()
  const outfitId = hero.cosmetics.characterBuild?.outfitId || DEFAULT_OUTFIT_ID
  const outfit = getOutfitById(outfitId)
  const outfitName = outfit?.name ?? 'My Hero'
  const level = hero.stats.level
  const sharingRef = useRef(false)
  const [sharing, setSharing] = useState(false)

  const getShareText = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    return `Check out my ${APP_NAME} character! I'm Level ${level} with ${outfitName}! 🦸 ${SHARE_HASHTAG}\n\nPlay too: ${url}`
  }, [level, outfitName])

  const handleShare = useCallback(async () => {
    if (sharingRef.current) return
    sharingRef.current = true
    setSharing(true)
    const text = getShareText()
    try {
      const node = shareContainerRef.current
      if (!node) {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
        return
      }
      // Always capture the hero image (character + face)
      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: { margin: '0' },
      })
      const blob = await dataUrlToBlob(dataUrl)
      const file = new File([blob], 'my-fithero-character.png', { type: 'image/png' })

      // Prefer sharing image + text (e.g. WhatsApp gets the character image and message)
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            text,
            files: [file],
            title: `${APP_NAME} – My character`,
          })
        } catch (shareErr) {
          // Some browsers don't support files in share; fallback to text-only WhatsApp link
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
        }
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
      }
    } catch (_err) {
      window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, '_blank', 'noopener,noreferrer')
    } finally {
      sharingRef.current = false
      setSharing(false)
    }
  }, [shareContainerRef, getShareText])

  return (
    <button
      type="button"
      className={styles.shareButton}
      onClick={handleShare}
      disabled={sharing}
      aria-label={t('Share my character image and message on WhatsApp')}
    >
      <span className={styles.icon}>📤</span>
      <span className={styles.label}>{sharing ? t('Preparing…') : t('Share')}</span>
    </button>
  )
}
