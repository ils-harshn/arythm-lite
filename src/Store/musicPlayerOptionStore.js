import { create } from "zustand";

export const GET_MUSIC_OPTIONS = {
  NULL: null,
  RANDOM: "random",
  REPEAT: "repeat",
};

const musicPlayerOptionStore = create((set) => ({
  get_music_option: GET_MUSIC_OPTIONS.NULL,
  set_music_option: (value) => set({ get_music_option: value }),
}));

export default musicPlayerOptionStore;
