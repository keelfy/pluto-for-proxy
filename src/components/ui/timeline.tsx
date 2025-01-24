import { cn } from "@/lib/utils";
import React from "react";

export type TimelinePointProps = React.PropsWithChildren<{
    icon?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
}>;

export function TimelinePoint({ title, description, children, icon }: TimelinePointProps) {
    return (
        <div className="grid gap-1 text-sm relative">
            <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 dark:bg-gray-50" />
            <div className="font-medium flex items-center gap-2">
                {icon}
                {title}
            </div>
            <div className="text-gray-500 dark:text-gray-400">{description}</div>
            {children && <div className="mt-2">{children}</div>}
        </div>
    )
}

type TimelineProps = React.PropsWithChildren<{
    className?: string;
}>;

export function Timeline({ children, className }: TimelineProps) {
    return (
        <div className={className}>
            <div className="relative pl-6 grid gap-10 after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20">
                {children}
            </div>
        </div>
    )
}
