import { create } from "zustand";

const useOptionsStore = create((set) => ({
  is_songslist_visible: true,
  set_songslist_visible: (value) => set({ is_songslist_visible: value }),
}));

export default useOptionsStore;
