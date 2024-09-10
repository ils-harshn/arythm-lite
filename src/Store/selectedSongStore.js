import { create } from "zustand";

const useSelectedSongStore = create((set) => ({
  song: null, 
  set_song: (song) => set({ song: song }),

  show_music_player: true,
  set_show_music_player: (value) => set({ show_music_player: value }),
}));

export default useSelectedSongStore;
