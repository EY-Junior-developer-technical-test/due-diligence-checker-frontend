import { useEffect, useRef, useState } from 'react'
import { FiLogOut, FiMoreVertical, FiUser } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

import { LanguageSwitch } from './LanguageSwitch'

const MENU_ANIMATION_MS = 200

type UserMenuCardProps = {
  fullName: string
  currentLanguage: string
  onLanguageChange: (language: string) => void
  onLogout: () => void
}

export function UserMenuCard({
  fullName,
  currentLanguage,
  onLanguageChange,
  onLogout,
}: UserMenuCardProps) {
  const { t } = useTranslation('home')
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuMounted, setIsMenuMounted] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const updateMenuPosition = () => {
    const triggerRect = triggerRef.current?.getBoundingClientRect()

    if (!triggerRect) {
      return
    }

    setMenuPosition({
      top: triggerRect.bottom + 12,
      right: Math.max(12, window.innerWidth - triggerRect.right),
    })
  }

  const openMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setIsMenuMounted(true)
    requestAnimationFrame(() => {
      updateMenuPosition()
      setIsOpen(true)
    })
  }

  const closeMenu = () => {
    setIsOpen(false)

    closeTimerRef.current = window.setTimeout(() => {
      setIsMenuMounted(false)
      closeTimerRef.current = null
    }, MENU_ANIMATION_MS)
  }

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedTrigger = containerRef.current?.contains(target)
      const clickedMenu = menuRef.current?.contains(target)

      if (isOpen && !clickedTrigger && !clickedMenu) {
        closeMenu()
      }
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onEscape)
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-semibold text-slate-100 shadow-[0_10px_20px_rgba(3,8,19,0.25)] backdrop-blur-md transition duration-200 hover:border-yellow-200/55 hover:bg-white/18 hover:shadow-[0_0_0_1px_rgba(255,230,0,0.34),0_0_24px_rgba(255,230,0,0.28)]"
        onClick={() => {
          if (isOpen) {
            closeMenu()
            return
          }

          openMenu()
        }}
        aria-label={t('user.options')}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-slate-100">
          <FiUser className="h-4 w-4" />
        </span>
        <span className="max-w-36 truncate">{fullName}</span>
        <FiMoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      {isMenuMounted ? (
        createPortal(
          <div
            ref={menuRef}
            className={`fixed z-[1200] w-44 origin-top-right p-1 transition-all duration-200 ${
              isOpen
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
            }`}
            style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
          >
            <div className="rounded-2xl border border-white/18 bg-white/[0.06] p-1.5 shadow-[0_14px_30px_rgba(2,8,18,0.42)] backdrop-blur-xl">
              <LanguageSwitch
                className="w-full justify-center"
                value={currentLanguage}
                options={[
                  { value: 'es', label: 'ES' },
                  { value: 'en', label: 'EN' },
                ]}
                onChange={onLanguageChange}
              />
            </div>

            <button
              type="button"
              className="mt-1.5 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-white/18 bg-white/[0.07] px-3 py-2 text-sm font-semibold text-slate-100 shadow-[0_14px_30px_rgba(2,8,18,0.42)] backdrop-blur-xl transition duration-200 hover:border-yellow-200/45 hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_rgba(255,230,0,0.18),0_14px_30px_rgba(2,8,18,0.42)]"
              onClick={() => {
                closeMenu()
                onLogout()
              }}
            >
              <FiLogOut className="h-4 w-4" aria-hidden="true" />
              {t('user.exit')}
            </button>
          </div>,
          document.body,
        )
      ) : null}
    </div>
  )
}
