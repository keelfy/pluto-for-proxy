"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

const osList = [
    {
        value: "windows",
        label: "Windows",
    },
    {
        value: "macos",
        label: "macOS",
    },
    {
        value: "linux",
        label: "Linux",
    },
    {
        value: "ios",
        label: "iOS",
    },
    {
        value: "android",
        label: "Android",
    },
];

const formSchema = z.object({
    code: z.string().uuid({
        message: "Неверный формат кода",
    }),
    os: z.enum(["windows", "macos", "linux", "ios", "android"], {
        message: "Неизвестная операционная система",
    }),
});

export default function ConnectionForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            os: "windows",
        },
    });

    return (
        <Form {...form}>
            <form className="flex flex-col space-y-4">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Персональный код</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="os"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Операционная система</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Операционная система" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {osList.map((os) => (
                                        <SelectItem
                                            key={os.value}
                                            value={os.value}
                                        >
                                            {os.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">
                        <Check />
                        Получить настройки
                    </Button>
                </div>
            </form>
        </Form>
    );
}
