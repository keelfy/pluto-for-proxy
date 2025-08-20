"use client";

import { pingProxyServers } from "@/app/actions";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { LoadingSpinner } from "./ui/loading-spinner";

type PingRes = {
    serverName: string;
    status: string;
    text: string;
}

const serverNames = process.env.NEXT_PUBLIC_SERVER_NAMES!.split(";");
const serverLocations = process.env.NEXT_PUBLIC_SERVER_LOCATIONS!.split(";");
const servers = serverNames.map((name, index) => ({
    name: name,
    description: serverLocations[index],
    value: serverNames[index].toLowerCase(),
}));

export default function Pinger() {
    const [isPending, startTransition] = React.useTransition();
    const [statusTexts, setStatusTexts] = React.useState<PingRes[]>([]);

    React.useEffect(() => {
        ping();
    }, []);

    const ping = async () => startTransition(async () => {
        try {
            const res = await pingProxyServers();
            setStatusTexts(res.map(result => ({
                serverName: result.serverName,
                status: result.status,
                text: getStatusText(result.status)
            })));
        } catch (error) {
            setStatusTexts([]);
        }
    });

    const getStatusText = (status: any) => {
        if (status === "success") return "Сервер доступен";
        if (status === "error") return "Ошибка соединения";
        if (status === "timeout") return "Превышено время ожидания";
        return "Проверка состояния сервера...";
    }

    const statusIcon = React.useMemo(() => {
        if (isPending) return <LoadingSpinner type="short" />;
        if (statusTexts.every(status => status.status === "success")) return <CheckIcon className="w-4 h-4 text-green-500" />;
        if (statusTexts.some(status => ["error", "timeout"].includes(status.status))) return <XIcon className="w-4 h-4 text-red-500" />;
        return <LoadingSpinner type="short" />;
    }, [isPending, statusTexts]);

    const getStatusColor = (status: string) => {
        if (status === "success") return "text-green-500";
        if (status === "error") return "text-red-500";
        if (status === "timeout") return "text-yellow-500";
        return "text-muted-foreground";
    }

    return (
        <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
                <Button variant="ghost" size='icon' onClick={() => ping()}>
                    {statusIcon}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="grid gap-3">
                    {servers.map(serv => {
                        const status = statusTexts.find(status => status.serverName === serv.value);
                        return (
                            <div key={serv.value} className="grid gap-1">
                                <p className="text-sm">
                                    {serv.name} &mdash; <span className={getStatusColor(status?.status ?? "")}>{status?.text ?? "Проверка состояния сервера..."}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {serv.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}