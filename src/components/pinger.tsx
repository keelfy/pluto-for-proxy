"use client";

import { pingProxyServer } from "@/app/actions";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function Pinger() {
    const [isPending, startTransition] = React.useTransition();
    const [isOnline, setIsOnline] = React.useState<boolean>();

    React.useEffect(() => {
        ping();
    }, []);

    const ping = async () => startTransition(async () => {
        try {
            const res = await pingProxyServer();
            setIsOnline(res);
        } catch (error) {
            setIsOnline(false);
        }
    });

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size='icon' onClick={() => ping()}>
                        {isPending ? <LoadingSpinner type="short" /> : isOnline ? <CheckIcon className="w-4 h-4 text-green-500" /> : <XIcon className="w-4 h-4 text-red-500" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isPending ? "Проверка состояния сервера..." : isOnline ? "Сервер доступен" : "Сервер недоступен"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}