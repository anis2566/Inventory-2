import {
    LayoutGrid,
    LucideIcon,
    List,
    PlusCircle,
    DollarSign,
    School,
    BookOpen,
    Layers3,
    ClipboardPen,
    CreditCard,
    NotebookPen,
    HandCoins,
    NotebookText,
    WavesLadder,
    Cable,
    Megaphone,
    Ribbon,
    Package,
    Users,
    ShoppingBag,
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getAdminMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    active: pathname === "/dashboard",
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Main ",
            menus: [
                {
                    href: "",
                    label: "Brand",
                    active: pathname.includes("/dashboard/brand"),
                    icon: Ribbon,
                    submenus: [
                        {
                            href: "/dashboard/brand/new",
                            label: "New",
                            active: pathname === "/dashboard/brand/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/brand",
                            label: "List",
                            active: pathname === "/dashboard/brand",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Category",
                    active: pathname.includes("/dashboard/category"),
                    icon: Layers3,
                    submenus: [
                        {
                            href: "/dashboard/category/new",
                            label: "New",
                            active: pathname === "/dashboard/category/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/category",
                            label: "List",
                            active: pathname === "/dashboard/category",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Product",
                    active: pathname.includes("/dashboard/product"),
                    icon: Package,
                    submenus: [
                        {
                            href: "/dashboard/product/new",
                            label: "New",
                            active: pathname === "/dashboard/product/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/product",
                            label: "List",
                            active: pathname === "/dashboard/product",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Employee",
                    active: pathname.includes("/dashboard/employee"),
                    icon: Users,
                    submenus: [
                        {
                            href: "/dashboard/employee/new",
                            label: "New",
                            active: pathname === "/dashboard/employee/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/employee",
                            label: "List",
                            active: pathname === "/dashboard/employee",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Shop",
                    active: pathname.includes("/dashboard/shop"),
                    icon: Users,
                    submenus: [
                        {
                            href: "/dashboard/shop/new",
                            label: "New",
                            active: pathname === "/dashboard/shop/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/shop",
                            label: "List",
                            active: pathname === "/dashboard/shop",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Order",
                    active: pathname.includes("/dashboard/order"),
                    icon: ShoppingBag,
                    submenus: [
                        {
                            href: "/dashboard/order/new",
                            label: "New",
                            active: pathname === "/dashboard/order/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/order",
                            label: "List",
                            active: pathname === "/dashboard/order",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Plan & Pricing ",
            menus: [
                {
                    href: "",
                    label: "Credit",
                    active: pathname.includes("/dashboard/plan/credit"),
                    icon: DollarSign,
                    submenus: [
                        {
                            href: "/dashboard/plan/credit/new",
                            label: "New",
                            active: pathname === "/dashboard/plan/credit/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/plan/credit",
                            label: "List",
                            active: pathname === "/dashboard/plan/credit",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Exam Plan",
                    active: pathname.includes("/dashboard/plan/exam"),
                    icon: NotebookPen,
                    submenus: [
                        {
                            href: "/dashboard/plan/exam/new",
                            label: "New",
                            active: pathname === "/dashboard/plan/exam/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/plan/exam",
                            label: "List",
                            active: pathname === "/dashboard/plan/exam",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "/dashboard/transaction",
                    label: "Transactions",
                    active: pathname.includes("/dashboard/transaction"),
                    icon: CreditCard,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Others",
            menus: [
                {
                    href: "",
                    label: "Announcement",
                    active: pathname.includes("/dashboard/announcement"),
                    icon: Megaphone,
                    submenus: [
                        {
                            href: "/dashboard/announcement/new",
                            label: "New",
                            active: pathname === "/dashboard/announcement/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/announcement",
                            label: "List",
                            active: pathname === "/dashboard/announcement",
                            icon: List,
                        },
                    ],
                },
            ],
        },
    ];
}

export function getUserMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/user",
                    label: "Dashboard",
                    active: pathname === "/user",
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Main ",
            menus: [
                {
                    href: "/user/exam/new",
                    label: "New Exam",
                    active: pathname === "/user/exam/new",
                    icon: NotebookPen,
                    submenus: [],
                },
                {
                    href: "/user/exam",
                    label: "Exam List",
                    active: pathname === "/user/exam",
                    icon: List,
                    submenus: [],
                },
                {
                    href: "/user/feedback",
                    label: "Feedbacks",
                    active: pathname === "/user/feedback",
                    icon: ClipboardPen,
                    submenus: [],
                },
                {
                    href: "/user/attempt",
                    label: "Attempts",
                    active: pathname === "/user/attempt",
                    icon: WavesLadder,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Plan & Pricing ",
            menus: [
                {
                    href: "/user/plan",
                    label: "Plans",
                    active: pathname === "/user/plan",
                    icon: NotebookText,
                    submenus: [],
                },
                {
                    href: "/user/purchase",
                    label: "Purchases",
                    active: pathname === "/user/purchase",
                    icon: HandCoins,
                    submenus: [],
                },
                {
                    href: "/user/transaction",
                    label: "Transaction",
                    active: pathname === "/user/transaction",
                    icon: DollarSign,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Affiliate Program ",
            menus: [
                {
                    href: "/user/refer",
                    label: "Refers",
                    active: pathname === "/user/refer",
                    icon: Cable,
                    submenus: [],
                },
            ],
        },
    ];
}