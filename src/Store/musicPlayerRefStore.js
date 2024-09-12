import { create } from "zustand";

const useMusicPlayerRefStore = create((set) => ({
  music_player_ref: null,
  set_music_player_ref: (value) => set({ music_player_ref: value }),
}));

export default useMusicPlayerRefStore;
