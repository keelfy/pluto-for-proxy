"use client";

import { getConfigWithTunnelingByClientUUID, getLinkWithTunnelingByClientUUID } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftRightIcon, ListIcon, PowerIcon, RefreshCwIcon, UserIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AndroidIcon from "./icons/android";
import AppleIcon from "./icons/apple";
import WindowsIcon from "./icons/windows";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
    clientUUID: z.string()
        .min(1, { message: "Пожалуйста, введите ваш уникальный идентификатор" })
        .uuid({ message: "Неверный формат UUID" }),
    platform: z.enum(["windows", "android", "apple"], {
        required_error: "Пожалуйста, выберите операционную систему",
    }),
    tunneling: z.boolean(),
    includeAntizapret: z.boolean(),
});

type Props = {
    platform: "windows" | "android" | "apple" | undefined;
    className?: string;
}

export default function ConfigGenerator({ platform, className }: Props) {
    const [isPending, startTransition] = React.useTransition();

    const defaultValues = React.useMemo(() => ({
        platform: platform ?? "windows",
        clientUUID: "",
        tunneling: true,
        includeAntizapret: true,
    }), [platform]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    React.useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues]);

    const handleSubmit = form.handleSubmit((values) => {
        if (values.platform === "apple") {
            handleLinkSubmit(values);
        } else {
            handleFileSubmit(values);
        }
    });

    const handleFileSubmit = (values: z.infer<typeof formSchema>) => startTransition(async () => {
        try {
            const config = await getConfigWithTunnelingByClientUUID(values.clientUUID, values.includeAntizapret);
            const blob = new Blob([config], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "config.json";
            a.click();
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Возникла ошибка",
                description: error.message ?? "Возникла ошибка при получении конфигурации",
                variant: "destructive",
            });
        }
    });

    const handleLinkSubmit = (values: z.infer<typeof formSchema>) =>
        startTransition(async () => {
            try {
                const link = await getLinkWithTunnelingByClientUUID(values.clientUUID);
                window.open(link, "_blank");
            } catch (error: any) {
                console.error(error);
                toast({
                    title: "Возникла ошибка",
                    description: error.message ?? "Возникла ошибка при получении ссылки",
                    variant: "destructive",
                });
            }
        });

    const handleReset = () => {
        form.reset(defaultValues);
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)}>
                <FormField
                    control={form.control}
                    name="clientUUID"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                Ваш уникальный идентификатор
                            </FormLabel>
                            <FormDescription>
                                Это ваш уникальный идентификатор. Вы можете запросить его у&nbsp;
                                <span className="font-bold"><a href="https://t.me/keelfy" target="_blank" rel="noopener noreferrer">@keelfy</a></span>.
                            </FormDescription>
                            <FormControl>
                                <Input placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" autoComplete="uuid" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!platform && (
                    <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <PowerIcon className="w-4 h-4" />
                                    Операционная система
                                </FormLabel>
                                <FormDescription>
                                    Выберите операционную систему, на которую вы устанавливаете клиент.
                                </FormDescription>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите платформу" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="windows">
                                            <div className="flex items-center gap-2">
                                                <WindowsIcon className="w-4 h-4" />
                                                Windows
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="android">
                                            <div className="flex items-center gap-2">
                                                <AndroidIcon className="w-4 h-4" />
                                                Android
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="apple">
                                            <div className="flex items-center gap-2">
                                                <AppleIcon className="w-4 h-4" />
                                                iOS / macOS
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {["windows", "android", undefined].includes(platform) && (
                    <>
                        <FormField
                            control={form.control}
                            name="tunneling"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 gap-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel className="flex items-center gap-2">
                                            <ArrowLeftRightIcon className="w-4 h-4" />
                                            Раздельное туннелирование
                                        </FormLabel>
                                        <FormDescription className="max-w-md">
                                            <span className="font-bold">Рекомендуется оставить включенным.</span> <br />
                                            Используйте этот параметр, если у вас есть
                                            проблемы с подключением со включенным туннелированием.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={form.watch("platform") === "apple" ? true : field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={form.watch("platform") === "apple"}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="includeAntizapret"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 gap-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel className="flex items-center gap-2">
                                            <ListIcon className="w-4 h-4" />
                                            Список антизапрета
                                        </FormLabel>
                                        <FormDescription className="max-w-md">
                                            Отключите этот параметр, если у вас не работают какие-либо сервисы со включенным VPN.
                                            Такое пока что было замечено только с League of Legends.
                                            Это сузит список сайтов, которые будут доступны в VPN, так что <span className="font-bold">рекомендуется оставить включенным</span>.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={form.watch("platform") === "apple" ? true : field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={form.watch("platform") === "apple"}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <div className="flex gap-2 items-center justify-end">
                    <Button type="reset" variant="secondary" onClick={handleReset}>
                        <RefreshCwIcon />
                        Очистить
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Генерация..." : "Получить конфигурацию"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
