import { create } from 'zustand'

export type ToastTone = 'danger' | 'success'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface UiStore {
  toasts: Toast[]
  pushToast: (message: string, tone?: ToastTone) => void
  dismissToast: (id: number) => void
}

const DISMISS_AFTER = 4000
let nextId = 0

export const useUiStore = create<UiStore>((set, get) => ({
  toasts: [],

  pushToast: (message, tone = 'danger') => {
    const id = nextId++
    set({ toasts: [...get().toasts, { id, message, tone }] })
    setTimeout(() => get().dismissToast(id), DISMISS_AFTER)
  },

  dismissToast: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) })
  },
}))
