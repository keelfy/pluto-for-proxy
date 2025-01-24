"use client"

import { Check, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Переключить тему</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Светлая
                    </div>
                    <Check className={cn("w-4 h-4", theme === "light" ? "opacity-100" : "opacity-0")} />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Темная
                    </div>
                    <Check className={cn("w-4 h-4", theme === "dark" ? "opacity-100" : "opacity-0")} />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4" />
                        Системная
                    </div>
                    <Check className={cn("w-4 h-4", theme === "system" ? "opacity-100" : "opacity-0")} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
