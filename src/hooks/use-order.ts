import { ORDER_STATUS, ORDER_STATUS_SR, PAYMENT_STATUS, ROLE } from "@/constant";
import { create } from "zustand";

interface DeleteOrderState {
    isOpen: boolean;
    orderId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteOrder = create<DeleteOrderState>((set) => ({
    isOpen: false,
    orderId: "",
    onOpen: (id: string) => set({ isOpen: true, orderId: id }),
    onClose: () => set({ isOpen: false, orderId: "" }),
}));

interface DeleteManyOrderState {
    isOpen: boolean;
    ids: string[];
    onOpen: (ids: string[]) => void;
    onClose: () => void;
}

export const useDeleteManyOrder = create<DeleteManyOrderState>((set) => ({
    isOpen: false,
    ids: [],
    onOpen: (ids: string[]) => set({ isOpen: true, ids }),
    onClose: () => set({ isOpen: false, ids: [] }),
}));


interface OrderStatusSrState {
    isOpen: boolean;
    orderId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useOrderStatusSr = create<OrderStatusSrState>((set) => ({
    isOpen: false,
    orderId: "",
    onOpen: (id: string) => set({ isOpen: true, orderId: id }),
    onClose: () => set({ isOpen: false, orderId: "", }),
}));

interface OrderStatusState {
    isOpen: boolean;
    orderId: string;
    status: ORDER_STATUS;
    onOpen: (id: string, status: ORDER_STATUS) => void;
    onClose: () => void;
}

export const useOrderStatus = create<OrderStatusState>((set) => ({
    isOpen: false,
    orderId: "",
    status: ORDER_STATUS.Pending,
    onOpen: (id: string, status: ORDER_STATUS) => set({ isOpen: true, orderId: id, status }),
    onClose: () => set({ isOpen: false, orderId: "", status: ORDER_STATUS.Pending }),
}));

interface PyamentStatusState {
    isOpen: boolean;
    orderId: string;
    status: PAYMENT_STATUS;
    onOpen: (id: string, status: PAYMENT_STATUS) => void;
    onClose: () => void;
}

export const usePaymentStatus = create<PyamentStatusState>((set) => ({
    isOpen: false,
    orderId: "",
    status: PAYMENT_STATUS.Unpaid,
    onOpen: (id: string, status: PAYMENT_STATUS) => set({ isOpen: true, orderId: id, status }),
    onClose: () => set({ isOpen: false, orderId: "", status: PAYMENT_STATUS.Unpaid }),
}));

interface PyamentStatusAdminState {
    isOpen: boolean;
    orderId: string;
    status: PAYMENT_STATUS;
    onOpen: (id: string, status: PAYMENT_STATUS) => void;
    onClose: () => void;
}

export const usePaymentStatusAdmin = create<PyamentStatusAdminState>((set) => ({
    isOpen: false,
    orderId: "",
    status: PAYMENT_STATUS.Unpaid,
    onOpen: (id: string, status: PAYMENT_STATUS) => set({ isOpen: true, orderId: id, status }),
    onClose: () => set({ isOpen: false, orderId: "", status: PAYMENT_STATUS.Unpaid }),
}));