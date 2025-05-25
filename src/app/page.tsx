import AndroidIcon from "@/components/icons/android";
import AndroidTVIcon from "@/components/icons/android-tv";
import AppleIcon from "@/components/icons/apple";
import GreetingsIcon from "@/components/icons/greetings";
import WindowsIcon from "@/components/icons/windows";
import Pinger from "@/components/pinger";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { getDaysAgo } from "@/lib/utils";
import { KeyIcon } from "lucide-react";
import Link from "next/link";

function HomeButton({
    children,
    href,
    icon,
}: React.PropsWithChildren<{
    href: string;
    icon: React.ReactNode;
}>) {
    return (
        <Link href={href}>
            <Button
                variant="link"
                className="hover:text-violet-800 hover:dark:text-violet-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 text-md"
            >
                {icon}
                {children}
            </Button>
        </Link>
    );
}

const lastUpdate = new Date(process.env.LAST_UPDATE ?? "2025-01-24");

export default function Home() {
    return (
        <div className="flex flex-col justify-center w-full h-full">
            <div className="flex flex-col gap-4 max-w-sm md:max-w-md">
                <h1 className="text-2xl font-bold flex justify-between items-center gap-2 w-full">
                    <div className="text-violet-800 dark:text-violet-300 flex gap-4 items-center">
                        <GreetingsIcon className="w-8 h-8" />
                        Привет!
                    </div>
                    <div className="flex items-center gap-2">
                        <Pinger />
                        <ThemeSwitcher />
                    </div>
                </h1>
                <h2 className="text-lg font-medium">
                    На какое устройство хочешь установить клиент?
                </h2>
                <div className="flex flex-col gap-1 items-start">
                    <HomeButton
                        href="/guide/platform/windows"
                        icon={<WindowsIcon className="w-6 h-6" />}
                    >
                        Windows
                    </HomeButton>
                    <HomeButton
                        href="/guide/platform/apple"
                        icon={<AppleIcon className="w-6 h-6" />}
                    >
                        iOS / macOS
                    </HomeButton>
                    <HomeButton
                        href="/guide/platform/android"
                        icon={<AndroidIcon className="w-6 h-6" />}
                    >
                        Android
                    </HomeButton>
                    <HomeButton
                        href="/guide/platform/android-tv"
                        icon={<AndroidTVIcon className="w-6 h-6" />}
                    >
                        Android TV
                    </HomeButton>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium">
                        Клиент уже установлен, но нужен новый конфиг?
                    </div>
                    <HomeButton
                        href="/config"
                        icon={<KeyIcon className="w-6 h-6" />}
                    >
                        Генератор конфигурации
                    </HomeButton>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">
                        Сервер:{" "}
                        <span className="font-semibold">Варшава, Польша</span> |
                        ODHcloud
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Последнее обновление:{" "}
                        <span className="font-semibold">
                            {getDaysAgo(lastUpdate)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
