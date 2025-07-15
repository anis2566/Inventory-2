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
        </Suspense>
    )
}