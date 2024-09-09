import { create } from "zustand";

const useSelectedSongStore = create((set) => ({
  song: null, // Initial state can be `null` or an empty string/object depending on your use case
  set_song: (song) => set({ song: song }),
}));

export default useSelectedSongStore;
