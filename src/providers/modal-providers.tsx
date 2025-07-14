"use client";

import { Suspense } from "react";

import { DeleteManyBrandModal } from "@/modules/brand/ui/modal/delete-many-modal";
import { DeleteBrandModal } from "@/modules/brand/ui/modal/delete-modal";
import { DeleteManyCategoryModal } from "@/modules/category/ui/modal/delete-many-modal";
import { DeleteCategoryModal } from "@/modules/category/ui/modal/delete-modal";

export const ModalProvider = () => {
    return (
        <Suspense fallback={null}>
            <DeleteCategoryModal />
            <DeleteManyCategoryModal />
            <DeleteBrandModal />
            <DeleteManyBrandModal />
        </Suspense>
    )
}