"use client";

import { TvIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function AndroidTVIcon({ className }: { className?: string }) {
    const { theme } = useTheme();

    return (
        <TvIcon
            className={className}
            style={{ stroke: theme === "light" ? "black" : "white" }}
        />
    );
}
