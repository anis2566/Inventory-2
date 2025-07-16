import { create } from "zustand";

interface DeleteOutgoingState {
    isOpen: boolean;
    outgoingId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteOutgoing = create<DeleteOutgoingState>((set) => ({
    isOpen: false,
    outgoingId: "",
    onOpen: (id: string) => set({ isOpen: true, outgoingId: id }),
    onClose: () => set({ isOpen: false, outgoingId: "" }),
}));

interface DeleteManyOutgoingState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyOutgoing = create<DeleteManyOutgoingState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));