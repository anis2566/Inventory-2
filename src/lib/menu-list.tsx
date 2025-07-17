import {
    LayoutGrid,
    LucideIcon,
    List,
    PlusCircle,
    Layers3,
    NotebookText,
    Ribbon,
    Package,
    Users,
    ShoppingBag,
    NotepadText,
    LogOut,
    Store,
    LogIn,
    NotepadTextDashed,
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
                    icon: Store,
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
                        {
                            href: "/dashboard/order/summary",
                            label: "Summary",
                            active: pathname === "/dashboard/order/summary",
                            icon: NotebookText,
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
        {
            groupLabel: "Warehouse",
            menus: [
                {
                    href: "/dashboard/outgoing",
                    label: "Outgoing",
                    active: pathname === "/dashboard/outgoing",
                    icon: LogOut,
                    submenus: [],
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
                        {
                            href: "/order/summary",
                            label: "Summary",
                            active: pathname === "/summary",
                            icon: NotepadText,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Warehouse",
            menus: [
                {
                    href: "",
                    label: "Stock Out",
                    active: pathname.includes("/outgoing"),
                    icon: LogOut,
                    submenus: [
                        {
                            href: "/outgoing/new",
                            label: "New",
                            active: pathname === "/outgoing/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/outgoing",
                            label: "List",
                            active: pathname === "/outgoing",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Stock In",
                    active: pathname.includes("/incoming"),
                    icon: LogIn,
                    submenus: [
                        {
                            href: "/incoming/new",
                            label: "New",
                            active: pathname === "/incoming/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/incoming",
                            label: "List",
                            active: pathname === "/incoming",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Report",
            menus: [
                {
                    href: "",
                    label: "Sales",
                    active: pathname.includes("/report"),
                    icon: ShoppingBag,
                    submenus: [
                        {
                            href: "/report/daily",
                            label: "Daily",
                            active: pathname === "/report/daily",
                            icon: NotepadTextDashed,
                        },
                        {
                            href: "/report",
                            label: "Overview",
                            active: pathname === "/report",
                            icon: NotepadTextDashed,
                        },
                    ],
                },
            ],
        },
    ];
}