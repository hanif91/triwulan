import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface ActivePageState {
  title : string
  changeTitle : ( by : string) => void
}

export const useActivePage = create<ActivePageState> ()(
  persist(
  (set) => ({
  title: "TES DASH",
  changeTitle: (by) => set(() => ({ title : by})),
  }),{
    name : "titlepagetriwulan"
  }
  )
);