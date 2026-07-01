import { create } from "zustand";

type BottomSheetState = {
  /** Whether any bottom sheet is currently open */
  isOpen: boolean;
  /** Optional ID to distinguish multiple sheets */
  sheetId: string | null;
  /** Open a bottom sheet (optionally by ID) */
  open: (id?: string) => void;
  /** Close the active bottom sheet */
  close: () => void;
};

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isOpen: false,
  sheetId: null,
  open: (id) => set({ isOpen: true, sheetId: id ?? null }),
  close: () => set({ isOpen: false, sheetId: null }),
}));
