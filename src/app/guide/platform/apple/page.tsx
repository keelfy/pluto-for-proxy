import AnyIssues from "@/components/any-issues";
import ConfigGenerator from "@/components/config-generator";
import AppleIcon from "@/components/icons/apple";
import BufferButton from "@/components/ui/buffer-button";
import { Timeline, TimelinePoint } from "@/components/ui/timeline";
import { ArrowRightIcon, CheckIcon, DownloadIcon, FileIcon, KeyIcon, MonitorCogIcon, PlusIcon, PowerIcon, Settings, SettingsIcon } from "lucide-react";
import Image from "next/image";

export default function AppleGuidePage() {
    return (
        <div className="flex flex-col gap-4 max-w-xl md:mt-20">
            <h1 className="text-2xl font-bold flex items-center gap-4">
                <AppleIcon className="w-8 h-8" />
                Инструкция для iOS или macOS
            </h1>

            <Timeline className="py-6">
                <TimelinePoint
                    icon={<DownloadIcon className="w-4 h-4" />}
                    title="Shadowrocket"
                    description={
                        <>
                            Покупайте и устанавливайте <span className="font-semibold">Shadowrocket</span> за ±<span className="font-semibold">3$</span>.<br />
                            Пополнить счет Apple можно через баланс номера телефона &mdash; из России это работает нормально.
                        </>
                    }
                >
                    <a href="https://apps.apple.com/app/shadowrocket/id932747118" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT93Gl0hMWBoculjsvZTqXPAUN8w0RkS9Cf47hO"
                            alt="AppStore"
                            className="w-36 h-12"
                        />
                    </a>
                </TimelinePoint>
                <TimelinePoint
                    icon={<KeyIcon className="w-4 h-4" />}
                    title="Получение доступа"
                >
                    <ConfigGenerator platform="apple" className="mt-2" />
                </TimelinePoint>
                <TimelinePoint
                    icon={<ArrowRightIcon className="w-4 h-4" />}
                    title="Добавление конфигурации"
                    description={
                        <>
                            После генерации конфигурации, ваше устройство должно предложить вам открыть ссылку в <span className="font-semibold">Shadowrocket</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9PAfKAGYsW8hk6HaYvnFKVTs4ryALE15DUpfl"
                        alt="Добавление конфигурации"
                        width={300}
                        height={300}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<PlusIcon className="w-4 h-4" />}
                    title="Проверка"
                    description={
                        <>
                            Сервер должен появиться на главном экране в списке.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9o9l9UkdXJwUHf9y6zZtgpFBbnS04VvCTPcaL"
                        alt="Проверка"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<FileIcon className="w-4 h-4" />}
                    title="Настройка"
                    description={
                        <>
                            Переходите в окно <span className="font-semibold">Настройка</span>, где перед вами предстанет такой интерфейс
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9uUBaLRMjnwc4hpe15gANUdRtD0aLZobzW9JG"
                        alt="Настройка"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<SettingsIcon className="w-4 h-4" />}
                    title="Настройка работы VPN"
                    description={
                        <>
                            Нажмите на плюсик справа сверху, после чего вам предложат ввести ссылку на конфигурацию, введите:<br />
                            <span className="font-semibold">https://raw.githubusercontent.com/keelfy/shadowrocket-config/master/shadowrocket.conf</span>
                        </>
                    }
                >
                    <BufferButton
                        variant="outline"
                        className="w-full mb-4"
                        text="https://raw.githubusercontent.com/keelfy/shadowrocket-config/master/shadowrocket.conf"
                    >
                        Скопировать ссылку на конфигурацию
                    </BufferButton>
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9h4Dy7zCTR90PoM7OkXNJ1qAtvl24UDVwIEzd"
                        alt="Настройка работы VPN"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<CheckIcon className="w-4 h-4" />}
                    title="Проверка конфигурации"
                    description={
                        <>
                            Нажав <span className="font-semibold">Загрузка</span> у вас появится новая конфигурация — <span className="font-semibold">shadowrocket.conf</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9mdhAcYSpjZJnsvl6d231w97cBqOPTGi5yRzo"
                        alt="Проверка конфигурации"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<MonitorCogIcon className="w-4 h-4" />}
                    title="Активация конфигурации"
                    description={
                        <>
                            Нажмите на неё. Приложение спросит вас действие, выберите <span className="font-semibold">Использовать конфигурацию</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9dBmUOvzVvaBzKGYex4DLql0U2frITZuNOm1b"
                        alt="Активация конфигурации"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<PowerIcon className="w-4 h-4" />}
                    title="Запуск"
                    description={
                        <>
                            Вы можете вернуться в главное окно приложения и, включив переключатель, присоединиться к VPN.<br />
                            Убедитесь, что в параметре <span className="font-semibold">Маршрутизация</span> выбрано <span className="font-semibold">Настройка</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9uJPNswMjnwc4hpe15gANUdRtD0aLZobzW9JG"
                        alt="Запуск"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </TimelinePoint>
            </Timeline>

            <AnyIssues separateTunnelingOption={false} />
        </div >
    )
}