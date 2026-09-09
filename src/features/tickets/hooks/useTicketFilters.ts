import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRIORITY_VALUES, STATUS_VALUES } from '@/lib/constants'
import type { Priority, Status } from '@/types/ticket'

export type SortOption = 'newest' | 'oldest' | 'priority'

export interface TicketFilters {
  q: string
  status: Status | 'all'
  priority: Priority | 'all'
  sort: SortOption
}

export type FilterKey = keyof TicketFilters

const SORT_OPTIONS: readonly SortOption[] = ['newest', 'oldest', 'priority']
const SEARCH_DEBOUNCE = 250

function isStatus(value: string): value is Status {
  return (STATUS_VALUES as readonly string[]).includes(value)
}

function isPriority(value: string): value is Priority {
  return (PRIORITY_VALUES as readonly string[]).includes(value)
}

function isSort(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value)
}

/**
 * Filters live in the URL, not the store: they are view state, so they should be
 * shareable, survive a reload and answer to the back button.
 */
export function useTicketFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Unrecognised values fall back to the default, so a hand-edited URL cannot
  // put the list into a state the controls can't represent.
  const filters = useMemo<TicketFilters>(() => {
    const status = searchParams.get('status') ?? ''
    const priority = searchParams.get('priority') ?? ''
    const sort = searchParams.get('sort') ?? ''

    return {
      q: searchParams.get('q') ?? '',
      status: isStatus(status) ? status : 'all',
      priority: isPriority(priority) ? priority : 'all',
      sort: isSort(sort) ? sort : 'newest',
    }
  }, [searchParams])

  const setFilter = useCallback(
    (key: FilterKey, value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          // Defaults are dropped rather than written, so a clean view has a clean URL.
          if (!value || value === 'all' || (key === 'sort' && value === 'newest')) {
            next.delete(key)
          } else {
            next.set(key, value)
          }
          return next
        },
        // replace, so typing does not push a history entry per keystroke.
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const hasActiveFilters =
    filters.q !== '' || filters.status !== 'all' || filters.priority !== 'all'

  return { filters, setFilter, clearFilters, hasActiveFilters }
}

/**
 * Owns the search box's own state so typing stays instant, and syncs it to the
 * URL 250ms later. Call this from one component only: two copies would diverge.
 */
export function useSearchInput() {
  const { filters, setFilter } = useTicketFilters()
  const urlQuery = filters.q

  const [value, setValue] = useState(urlQuery)
  const [syncedQuery, setSyncedQuery] = useState(urlQuery)

  // When the URL query changes from outside this box (Clear filters, the back
  // button), snap the input to it during render. Doing this in an effect would
  // paint the stale value first and cost an extra render.
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery)
    setValue(urlQuery)
  }

  useEffect(() => {
    if (value === urlQuery) return
    const timer = setTimeout(() => setFilter('q', value), SEARCH_DEBOUNCE)
    return () => clearTimeout(timer)
  }, [value, urlQuery, setFilter])

  return { value, setValue }
}
