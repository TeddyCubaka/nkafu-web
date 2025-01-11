import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  setIsOpen: (data: boolean) => void;
};

export const sidebarState = create<SidebarState>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => {
    return set({ isOpen });
  },
}));
