import { create } from "zustand";

interface DeleteIncomeState {
    isOpen: boolean;
    incomeId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteIncome = create<DeleteIncomeState>((set) => ({
    isOpen: false,
    incomeId: "",
    onOpen: (id: string) => set({ isOpen: true, incomeId: id }),
    onClose: () => set({ isOpen: false, incomeId: "" }),
}));

interface DeleteManyIncomeState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyIncome = create<DeleteManyIncomeState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));