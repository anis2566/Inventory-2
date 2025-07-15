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
                {
                    href: "",
                    label: "User",
                    active: pathname.includes("/dashboard/user"),
                    icon: Users,
                    submenus: [
                        {
                            href: "/dashboard/user/new",
                            label: "New",
                            active: pathname === "/dashboard/user/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/user",
                            label: "List",
                            active: pathname === "/dashboard/user",
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
                    href: "/",
                    label: "Dashboard",
                    active: pathname === "/",
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
                    label: "Order",
                    active: pathname.includes("/order"),
                    icon: ShoppingBag,
                    submenus: [
                        {
                            href: "/order/new",
                            label: "New",
                            active: pathname === "/order/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/order",
                            label: "List",
                            active: pathname === "/order",
                            icon: List,
                        },
                    ],
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