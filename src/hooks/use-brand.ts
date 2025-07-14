import { create } from "zustand";

interface DeleteBrandState {
    isOpen: boolean;
    brandId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteBrand = create<DeleteBrandState>((set) => ({
    isOpen: false,
    brandId: "",
    onOpen: (id: string) => set({ isOpen: true, brandId: id }),
    onClose: () => set({ isOpen: false, brandId: "" }),
}));

interface DeleteManyBrandState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyBrand = create<DeleteManyBrandState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));