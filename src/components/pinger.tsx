"use client";

import { pingProxyServer } from "@/app/actions";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function Pinger() {
    const [isPending, startTransition] = React.useTransition();
    const [status, setStatus] = React.useState<string>();

    React.useEffect(() => {
        ping();
    }, []);

    const ping = async () => startTransition(async () => {
        try {
            const res = await pingProxyServer();
            setStatus(res);
        } catch (error) {
            setStatus("error");
        }
    });

    const statusText = React.useMemo(() => {
        if (isPending) return "Проверка состояния сервера...";
        if (status === "success") return "Сервер доступен";
        if (status === "error") return "Ошибка соединения";
        if (status === "timeout") return "Превышено время ожидания";
        return "Проверка состояния сервера...";
    }, [isPending, status]);

    const statusIcon = React.useMemo(() => {
        if (isPending) return <LoadingSpinner type="short" />;
        if (status === "success") return <CheckIcon className="w-4 h-4 text-green-500" />;
        if (["error", "timeout"].includes(status ?? "")) return <XIcon className="w-4 h-4 text-red-500" />;
        return <LoadingSpinner type="short" />;
    }, [isPending, status]);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size='icon' onClick={() => ping()}>
                        {statusIcon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {statusText}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}