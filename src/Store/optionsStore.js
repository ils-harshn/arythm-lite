import { create } from "zustand";

const useOptionsStore = create((set) => ({
  is_songslist_visible: true,
  set_songslist_visible: (value) => set({ is_songslist_visible: value }),

  is_filter_visible: false,
  set_filter_visible: (value) => set({ is_filter_visible: value }),
}));

export default useOptionsStore;
