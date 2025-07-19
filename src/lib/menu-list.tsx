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
    CalendarDays,
    Calendar1,
    DollarSign,
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
                    label: "Stock Out",
                    active: pathname === "/dashboard/outgoing",
                    icon: LogOut,
                    submenus: [],
                },
                {
                    href: "/dashboard/incoming",
                    label: "Stock In",
                    active: pathname === "/dashboard/incoming",
                    icon: LogIn,
                    submenus: [
                        {
                            href: "/dashboard/incoming/new",
                            label: "New",
                            active: pathname === "/dashboard/incoming/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/incoming",
                            label: "List",
                            active: pathname === "/dashboard/incoming",
                            icon: List,
                        },

                    ],
                },
            ],
        },
        {
            groupLabel: "Income & Expense",
            menus: [
                {
                    href: "/dashboard/income",
                    label: "Income",
                    active: pathname === "/dashboard/income",
                    icon: DollarSign,
                    submenus: [
                        {
                            href: "/dashboard/income/new",
                            label: "New",
                            active: pathname === "/dashboard/income/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/income",
                            label: "List",
                            active: pathname === "/dashboard/income",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "/dashboard/expense",
                    label: "Expense",
                    active: pathname === "/dashboard/expense",
                    icon: DollarSign,
                    submenus: [
                        {
                            href: "/dashboard/expense/new",
                            label: "New",
                            active: pathname === "/dashboard/expense/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/expense",
                            label: "List",
                            active: pathname === "/dashboard/expense",
                            icon: List,
                        },
                    ],
                }
            ],
        },
        {
            groupLabel: "Report",
            menus: [
                {
                    href: "/dashboard/report/product",
                    label: "Product",
                    active: pathname.includes("/dashboard/report/product"),
                    icon: Package,
                    submenus: [],
                },
                {
                    href: "/dashboard/report/sale",
                    label: "Sales",
                    active: pathname.includes("/dashboard/report/sale"),
                    icon: ShoppingBag,
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
                    label: "Report",
                    active: pathname.includes("/report"),
                    icon: NotepadText,
                    submenus: [
                        {
                            href: "/report/daily",
                            label: "Daily",
                            active: pathname === "/report/daily",
                            icon: CalendarDays,
                        },
                        {
                            href: "/report",
                            label: "Overview",
                            active: pathname === "/report",
                            icon: Calendar1,
                        },
                    ],
                },
            ],
        },
    ];
}