
export enum ROLE {
    User = 'User',
    SR = 'SR',
    Admin = 'Admin'
}

export enum CATEGORY_STATUS {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive'
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 5;
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 40, 50, 100, 200, 500];
export const DEFAULT_SORT_OPTIONS = [
    {
        label: "Newest",
        value: "desc",
    },
    {
        label: "Oldest",
        value: "asc",
    },
];

export enum ORDER_STATUS {
    Pending = 'Pending',
    Placed = 'Placed',
    Shipped = 'Shipped',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled'
}

export enum ORDER_STATUS_SR {
    Damaged = 'Damaged',
    Returned = 'Returned'
}

export enum PAYMENT_STATUS {
    Unpaid = 'Unpaid',
    Due = 'Due',
    Received = 'Received',
    Paid = 'Paid'
}

export enum PRODUCT_CONDITION {
    Good = 'Good',
    Damaged = 'Damaged',
    Returned = 'Returned'
}

export enum MONTHS {
    January = 'January',
    February = 'February',
    March = 'March',
    April = 'April',
    May = 'May',
    June = 'June',
    July = 'July',
    August = 'August',
    September = 'September',
    October = 'October',
    November = 'November',
    December = 'December'
}

export enum INCOME_TYPE {
    Sale = 'Sale',
    Other = 'Other'
}

export enum EXPENSE_TYPE {
    Purchase = 'Purchase',
    Other = 'Other'
}