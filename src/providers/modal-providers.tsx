"use client";

import { Suspense } from "react";

import { DeleteManyBrandModal } from "@/modules/dashboard/brand/ui/modal/delete-many-modal";
import { DeleteBrandModal } from "@/modules/dashboard/brand/ui/modal/delete-modal";
import { DeleteManyCategoryModal } from "@/modules/dashboard/category/ui/modal/delete-many-modal";
import { DeleteCategoryModal } from "@/modules/dashboard/category/ui/modal/delete-modal";
import { DeleteProductModal } from "@/modules/dashboard/product/ui/modal/delete-modal";
import { DeleteManyProductModal } from "@/modules/dashboard/product/ui/modal/delete-many-modal";
import { DeleteManyEmployeeModal } from "@/modules/dashboard/employee/ui/modal/delete-many-modal";
import { DeleteBrandEmployee } from "@/modules/dashboard/employee/ui/modal/delete-modal";
import { DeleteShopModal } from "@/modules/dashboard/shop/ui/modal/delete-modal";
import { DeleteManyShopModal } from "@/modules/dashboard/shop/ui/modal/delete-many-modal";
import { UserRoleModal } from "@/modules/dashboard/user/ui/modal/role-modal";
import { CreateShopModal } from "@/modules/home/order/ui/modal/create-shop-modal";
import { DeleteOutgoingModal } from "@/modules/dashboard/outgoing/ui/modal/delete-modal";
import { DeleteManyOutgoingModal } from "@/modules/dashboard/outgoing/ui/modal/delete-many-modal";
import { PaymentStatusModal } from "@/modules/home/order/ui/modal/payment-status-modal";
import { PaymentStatusAdminModal } from "@/modules/dashboard/order/ui/modal/payment-status-modal";
import { StatusModal } from "@/modules/dashboard/order/ui/modal/status-modal";
import { DeleteOrderModal } from "@/modules/dashboard/order/ui/modal/delete-modal";
import { DeleteManyOrderModal } from "@/modules/dashboard/order/ui/modal/delete-many-modal";
import { OrderStatusSrModal } from "@/modules/home/order/ui/modal/return-status-modal";
import { DeleteIncomeModal } from "@/modules/dashboard/income/ui/modal/delete-modal";
import { DeleteManyIncomeModal } from "@/modules/dashboard/income/ui/modal/delete-many-modal";
import { DeleteExpenseModal } from "@/modules/dashboard/expense/ui/modal/delete-modal";
import { DeleteManyExpenseModal } from "@/modules/dashboard/expense/ui/modal/delete-many-modal";
import { DeliverAllOrderModal } from "@/modules/dashboard/order/ui/modal/delivery-all-modal";

export const ModalProvider = () => {
    return (
        <Suspense fallback={null}>
            <DeleteCategoryModal />
            <DeleteManyCategoryModal />
            <DeleteBrandModal />
            <DeleteManyBrandModal />
            <DeleteProductModal />
            <DeleteManyProductModal />
            <DeleteBrandEmployee />
            <DeleteManyEmployeeModal />
            <DeleteShopModal />
            <DeleteManyShopModal />
            <UserRoleModal />
            <CreateShopModal />
            <DeleteOutgoingModal />
            <DeleteManyOutgoingModal />
            <PaymentStatusModal />
            <PaymentStatusAdminModal />
            <StatusModal />
            <DeleteOrderModal />
            <DeleteManyOrderModal />
            <OrderStatusSrModal />
            <DeleteIncomeModal />
            <DeleteManyIncomeModal />
            <DeleteExpenseModal />
            <DeleteManyExpenseModal />
            <DeliverAllOrderModal />
        </Suspense>
    )
}