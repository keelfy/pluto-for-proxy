"use client";

import React from "react";
import { Button, ButtonProps } from "./button";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = ButtonProps & {
    text: string;
}

export default function BufferButton({ children, text, ...props }: Props) {
    const [isCopied, setIsCopied] = React.useState(false);


    React.useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
    }, [isCopied]);

    return (
        <Button
            onClick={() => {
                navigator.clipboard.writeText(text);
                setIsCopied(true);
            }}
            {...props}
        >
            <CheckIcon className={cn("w-4 h-4 text-green-500 opacity-0 transition-opacity duration-200", isCopied && "opacity-100")} />
            {children}
        </Button>
    );
}