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
                    label: "Brand",
                    active: pathname.includes("/brand"),
                    icon: Ribbon,
                    submenus: [
                        {
                            href: "/brand/new",
                            label: "New",
                            active: pathname === "/brand/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/brand",
                            label: "List",
                            active: pathname === "/brand",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Category",
                    active: pathname.includes("/category"),
                    icon: Layers3,
                    submenus: [
                        {
                            href: "/category/new",
                            label: "New",
                            active: pathname === "/category/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/category",
                            label: "List",
                            active: pathname === "/category",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Subject",
                    active: pathname.includes("/dashboard/subjects"),
                    icon: BookOpen,
                    submenus: [
                        {
                            href: "/dashboard/subject/new",
                            label: "New",
                            active: pathname === "/dashboard/subjects/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/subject",
                            label: "List",
                            active: pathname === "/dashboard/subjects",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Chapter",
                    active: pathname.includes("/dashboard/chapters"),
                    icon: Layers3,
                    submenus: [
                        {
                            href: "/dashboard/chapter/new",
                            label: "New",
                            active: pathname === "/dashboard/chapters/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/chapter",
                            label: "List",
                            active: pathname === "/dashboard/chapters",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "/dashboard/exam",
                    label: "Exams",
                    active: pathname.includes("/dashboard/exam"),
                    icon: NotebookPen,
                    submenus: [],
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