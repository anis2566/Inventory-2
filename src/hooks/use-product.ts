import { OrderSchemaType } from "@/schema/order";
import { UseFormReturn } from "react-hook-form";
import { create } from "zustand";

interface DeleteProductState {
    isOpen: boolean;
    productId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteProduct = create<DeleteProductState>((set) => ({
    isOpen: false,
    productId: "",
    onOpen: (id: string) => set({ isOpen: true, productId: id }),
    onClose: () => set({ isOpen: false, productId: "" }),
}));

interface DeleteManyProductState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyProduct = create<DeleteManyProductState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));

interface ProductModalProps {
    form: UseFormReturn<OrderSchemaType>;
    currentIndex: number;
    isOpen: boolean;
    onOpen: (form: UseFormReturn<OrderSchemaType>, currentIndex: number, isOpen: boolean) => void;
    onClose: () => void;
}

export const useAddProduct = create<ProductModalProps>((set) => ({
    form: {} as UseFormReturn<OrderSchemaType>,
    currentIndex: 0,
    isOpen: false,
    onOpen: (form, currentIndex, isOpen) => set({ form, currentIndex, isOpen }),
    onClose: () => set({ form: {} as UseFormReturn<OrderSchemaType>, currentIndex: 0, isOpen: false }),
}));
