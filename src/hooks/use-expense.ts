import { create } from "zustand";

interface DeleteExpenseState {
    isOpen: boolean;
    expenseId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteExpense = create<DeleteExpenseState>((set) => ({
    isOpen: false,
    expenseId: "",
    onOpen: (id: string) => set({ isOpen: true, expenseId: id }),
    onClose: () => set({ isOpen: false, expenseId: "" }),
}));

interface DeleteManyExpenseState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyExpense = create<DeleteManyExpenseState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));