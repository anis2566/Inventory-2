import { create } from "zustand";

interface DeleteShopState {
    isOpen: boolean;
    shopId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteShop = create<DeleteShopState>((set) => ({
    isOpen: false,
    shopId: "",
    onOpen: (id: string) => set({ isOpen: true, shopId: id }),
    onClose: () => set({ isOpen: false, shopId: "" }),
}));

interface DeleteManyShopState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyShop = create<DeleteManyShopState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));