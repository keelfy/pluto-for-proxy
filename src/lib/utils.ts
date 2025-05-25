import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export async function copyToClipboard(value: string) {
    let useLegacy = false;

    try {
        await navigator!.clipboard.writeText(value)
    } catch {
        useLegacy = true
    }

    if (useLegacy) legacyCopy(value)
}

function legacyCopy(value: string) {
    const ta = document.createElement('textarea')
    ta.value = value ?? ''
    ta.style.position = 'absolute'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
}
