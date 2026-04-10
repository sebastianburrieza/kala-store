import { create } from 'zustand'

interface ToastStore {
  message: string | null
  showToast: (message: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  message: null,

  showToast: (message) => {
    set({ message })                      // 1. show the message
    setTimeout(() => {
      set({ message: null })              // 2. after 3 seconds → hide it
    }, 3000)
  },
}))
