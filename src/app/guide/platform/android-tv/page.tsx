import AnyIssues from "@/components/any-issues";
import ConfigGenerator from "@/components/config-generator";
import { Timeline, TimelinePoint } from "@/components/ui/timeline";
import {
    CheckIcon,
    DownloadIcon,
    FileIcon,
    KeyIcon,
    NetworkIcon,
    PlusIcon,
    TvIcon
} from "lucide-react";
import Image from "next/image";

export default function AndroidGuidePage() {
    return (
        <div className="flex flex-col gap-4 max-w-sm md:max-w-xl md:mt-20">
            <h1 className="text-2xl font-bold flex items-center gap-4">
                <TvIcon className="w-8 h-8" />
                Инструкция для Android TV
            </h1>

            <Timeline className="py-6">
                <TimelinePoint
                    icon={<DownloadIcon className="w-4 h-4" />}
                    title="Загрузка"
                    description={
                        <>
                            Установите приложение&nbsp;
                            <span className="font-semibold">v2raytun</span> из
                            магазина приложений на телевизоре.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9ftViH5SQiSmMczvjgr7BFOVd603RCG4NZ1u2"
                        alt="Приложение"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<NetworkIcon className="w-4 h-4" />}
                    title="Браузер"
                    description={
                        <>
                            Проверьте, есть ли на вашем телевизоре браузер. Если
                            нет, то установите его из магазина приложений
                            (называется Browser).
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9udLxT5Mjnwc4hpe15gANUdRtD0aLZobzW9JG"
                        alt="Браузер"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<NetworkIcon className="w-4 h-4" />}
                    title="Сайт для получения доступа"
                    description={
                        <>
                            Откройте браузер и введите в поиск{" "}
                            <span className="font-semibold">
                                pluto.keelfy.dev
                            </span>
                            .
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9mJMk4XSpjZJnsvl6d231w97cBqOPTGi5yRzo"
                        alt="Браузер"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9eGB0KEt3C7ESbFDHK6yGLnqdtX1ZYNAJwrM8"
                        alt="Браузер"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<FileIcon className="w-4 h-4" />}
                    title="Форма получение доступа"
                    description={
                        <>
                            <span className="underline">
                                Этот шаг тоже делается с телевизора.
                            </span>{" "}
                            Откройте эту инструкцию и долистайте до следующего
                            шага (
                            <span className="font-semibold">
                                Получение доступа
                            </span>
                            ).
                        </>
                    }
                />
                <TimelinePoint
                    icon={<KeyIcon className="w-4 h-4" />}
                    title="Получение доступа"
                    description={
                        <span className="underline">
                            Этот шаг тоже делается с телевизора.
                        </span>
                    }
                >
                    <ConfigGenerator platform="android-tv" className="mt-2" />
                </TimelinePoint>
                <TimelinePoint
                    icon={<FileIcon className="w-4 h-4" />}
                    title="Конфигурация"
                    description={
                        <>
                            <span className="underline">
                                Этот шаг тоже делается с телевизора.
                            </span>{" "}
                            Заполните ваш уникальный идентификатор с телевизора
                            и нажмите кнопку "Получить конфигурацию".&nbsp; У
                            вас должно всплыть уведомление об успешном
                            копировании конфигурации в буфер обмена.&nbsp;
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT93aRk9gWBoculjsvZTqXPAUN8w0RkS9Cf47hO"
                        alt="Браузер"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<PlusIcon className="w-4 h-4" />}
                    title="Добавление конфигурации"
                    description={
                        <>
                            Откройте приложение{" "}
                            <span className="font-semibold">v2rayTun</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9FIrQ4NRxIWPGxjdpDgzaThLVAofFcMZOY45w"
                        alt="Добавление конфигурации"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<PlusIcon className="w-4 h-4" />}
                    title="Добавление конфигурации. Часть 2"
                    description={
                        <>
                            Нажмите на пункт{" "}
                            <span className="font-semibold">Control</span>
                            &nbsp;в главном меню приложения.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9Q9gPmAeAkmXR8li1IBZVwavbsfYNtxhJKyGp"
                        alt="Добавление конфигурации. Часть 2"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<PlusIcon className="w-4 h-4" />}
                    title="Добавление конфигурации. Часть 3"
                    description={
                        <>
                            Нажмите на пункт{" "}
                            <span className="font-semibold">
                                Import config from Clipboard
                            </span>
                            &nbsp;в открывшемся окне.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9gKOzaGbB1PW37d8zxKVIHTmOcLk6RwUrN0Sl"
                        alt="Добавление конфигурации. Часть 3"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<CheckIcon className="w-4 h-4" />}
                    title="Подключение к VPN"
                    description={
                        <>
                            После добавления конфигурации можете подключаться к
                            VPN нажатием на кнопку посередине главного меню.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9WQGQiRmXDh1GOCUQ9RjkxevH6wmLSi5TNsfF"
                        alt="Подключение к VPN"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
            </Timeline>

            <AnyIssues separateTunnelingOption={false} />
        </div>
    );
}
