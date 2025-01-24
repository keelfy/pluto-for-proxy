import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getDaysAgo(date: Date) {
    const now = new Date();
    if (now.getFullYear() !== date.getFullYear()) {
        return `${now.getFullYear() - date.getFullYear()} лет назад`;
    }
    if (now.getMonth() !== date.getMonth()) {
        return `${now.getMonth() - date.getMonth()} месяцев назад`;
    }
    if (now.getDate() !== date.getDate()) {
        return `${now.getDate() - date.getDate()} дней назад`;
    }
    return "сегодня";
}