import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface PanelProps {
  /** id of the element naming this dialog, for aria-labelledby. */
  labelledBy: string
  onClose: () => void
  children: ReactNode
}

/**
 * Generic dialog shell: scrim, Escape, a Tab loop and focus restoration.
 * Knows nothing about tickets.
 */
export default function Panel({ labelledBy, onClose, children }: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Whatever had focus when the panel opened gets it back on close - normally
    // the row that was activated.
    const trigger = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    return () => {
      if (trigger && document.contains(trigger)) trigger.focus()
    }
  }, [])

  useEffect(() => {
    // The page behind a modal must not scroll. Replacing the scrollbar's width
    // with padding keeps the layout from jumping sideways as it disappears.
    const { body, documentElement } = document
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'Tab' || !panelRef.current) return

    // aria-modal claims focus is confined here, so Tab has to wrap rather than
    // walk out into the list behind the scrim.
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="animate-scrim-in fixed inset-0 z-40 bg-ink/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={[
          'fixed z-50 flex flex-col bg-surface shadow-xl',
          // Bottom sheet on mobile, right-hand panel from md up.
          'inset-x-0 bottom-0 top-0 animate-sheet-in',
          'md:inset-y-0 md:left-auto md:right-0 md:w-[440px] md:animate-panel-in',
        ].join(' ')}
      >
        {children}
      </div>
    </>
  )
}
