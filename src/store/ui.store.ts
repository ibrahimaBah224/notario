import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  expandedSections: string[]
  toggleSidebar: () => void
  toggleSection: (sectionTitle: string) => void
  expandSection: (sectionTitle: string) => void
  collapseAllSections: () => void
  setExpandedSections: (sections: string[]) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  expandedSections: [],
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleSection: (sectionTitle: string) => {
    const state = get()
    const isExpanded = state.expandedSections.includes(sectionTitle)
    if (isExpanded) {
      set({ expandedSections: state.expandedSections.filter(s => s !== sectionTitle) })
    } else {
      set({ expandedSections: [sectionTitle] })
    }
  },
  expandSection: (sectionTitle: string) => {
    const state = get()
    if (!state.expandedSections.includes(sectionTitle)) {
      set({ expandedSections: [sectionTitle] })
    }
  },
  collapseAllSections: () => set({ expandedSections: [] }),
  setExpandedSections: (sections: string[]) => set({ expandedSections: sections })
}))



