import { create } from "zustand";

const useFilterStore = create((set) => ({
  filterData: {
    original_name: "",
    album_title: "",
    album_code: "",
    genre_name: "",
    artist_name: "",
  },
  setFilterData: (data) =>
    set((state) => ({
      filterData: {
        ...state.filterData,
        ...data,
      },
    })),
}));

export default useFilterStore;
