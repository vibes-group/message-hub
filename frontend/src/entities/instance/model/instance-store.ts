import { create } from 'zustand'

import type { ConnectedInstance } from '@/shared/types/instance'

const STORAGE_KEY = 'mh:selected-instance:v1'

type InstanceState = {
  selectedInstance: ConnectedInstance | null
  setSelectedInstance: (instance: ConnectedInstance) => void
  clearSelectedInstance: () => void
}

function readStoredInstance() {
  const rawValue = window.localStorage.getItem(STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as ConnectedInstance
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const useInstanceStore = create<InstanceState>((set) => ({
  selectedInstance:
    typeof window === 'undefined' ? null : readStoredInstance(),
  setSelectedInstance: (instance) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(instance))
    set({ selectedInstance: instance })
  },
  clearSelectedInstance: () => {
    window.localStorage.removeItem(STORAGE_KEY)
    set({ selectedInstance: null })
  },
}))
