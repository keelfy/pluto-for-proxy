import { cn } from "@/lib/utils";

type Props = {
    separateTunnelingOption?: boolean;
    className?: string;
}

export default function AnyIssues({ separateTunnelingOption = true, className }: Props) {
    return (
        <div className={cn("flex flex-col gap-6 mb-20", className)}>
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">
                    Нужно ли выключать VPN?
                </h2>
                <div className="text-sm text-muted-foreground">
                    {separateTunnelingOption ?
                        <>
                            Если <span className="font-semibold">раздельное туннелирование</span> <span className="underline">включено</span> (вы выбирали это при генерации конфигурации),
                            то отключать VPN нет смысла, потому что он не будет замедлять ваш интернет.
                            VPN сам будет активироваться только тогда, когда вы заходите на заблокированный сайт.
                            В случае посещения, например, госуслуг — VPN сам деактивируется, чтобы не замедлять соединение с сайтом.
                            <div className="my-1" />
                            Если <span className="font-semibold">раздельное туннелирование</span> <span className="underline">отключено</span> (вы выбирали это при генерации конфигурации),
                            то следите за тем, чтобы VPN был включен только тогда, когда вы заходите на заблокированный ресурс.
                        </> : <>
                            Отключать VPN нет смысла, потому что он не будет замедлять ваш интернет.
                            VPN сам будет активироваться только тогда, когда вы заходите на заблокированный сайт.
                            В случае посещения, например, госуслуг — VPN сам деактивируется, чтобы не замедлять соединение с сайтом.
                        </>
                    }
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">
                    Возникли проблемы?
                </h2>
                <p className="text-sm text-muted-foreground">
                    Если у вас возникли проблемы с установкой или использованием клиента, пожалуйста, обратитесь к&nbsp;
                    <span className="font-bold"><a href="https://t.me/keelfy" target="_blank" rel="noopener noreferrer">@keelfy</a></span>.
                </p>
            </div >
        </div >
    )
}