import { ROLE } from "@/constant";
import { create } from "zustand";

interface DeleteUserState {
    isOpen: boolean;
    userId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteUser = create<DeleteUserState>((set) => ({
    isOpen: false,
    userId: "",
    onOpen: (id: string) => set({ isOpen: true, userId: id }),
    onClose: () => set({ isOpen: false, userId: "" }),
}));

interface DeleteManyUserState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyUser = create<DeleteManyUserState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));


interface UserRoleState {
    isOpen: boolean;
    userId: string;
    role: ROLE;
    onOpen: (id: string, role: ROLE) => void;
    onClose: () => void;
}

export const useUserRole = create<UserRoleState>((set) => ({
    isOpen: false,
    userId: "",
    role: ROLE.User,
    onOpen: (id: string, role: ROLE) => set({ isOpen: true, userId: id, role: role }),
    onClose: () => set({ isOpen: false, userId: "", role: ROLE.User }),
}));