import { create } from "zustand";

type MediaStore = {
  isMovie: boolean;
  setIsMovie: (isMovie: boolean) => void;
};

export const useMediaStore = create<MediaStore>(
  (set) => ({
    isMovie: true,
    setIsMovie(isMovie) {
      set((state) => ({
        ...state,
        isMovie,
      }));
    },
  }),
);
