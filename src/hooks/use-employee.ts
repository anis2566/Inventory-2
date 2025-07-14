import { create } from "zustand";

interface DeleteEmployeeState {
    isOpen: boolean;
    employeeId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteEmployee = create<DeleteEmployeeState>((set) => ({
    isOpen: false,
    employeeId: "",
    onOpen: (id: string) => set({ isOpen: true, employeeId: id }),
    onClose: () => set({ isOpen: false, employeeId: "" }),
}));

interface DeleteManyEmployeeState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyEmployee = create<DeleteManyEmployeeState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));