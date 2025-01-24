import AnyIssues from "@/components/any-issues";
import ConfigGenerator from "@/components/config-generator";
import WindowsIcon from "@/components/icons/windows";
import { Button } from "@/components/ui/button";
import { Timeline, TimelinePoint } from "@/components/ui/timeline";
import { ArrowRightIcon, CheckIcon, DownloadIcon, FileIcon, HardDriveIcon, KeyIcon, PowerIcon, SettingsIcon } from "lucide-react";
import Image from "next/image";

export default function WindowsGuidePage() {
    return (
        <div className="flex flex-col gap-4 max-w-xl md:mt-20">
            <h1 className="text-2xl font-bold flex items-center gap-4">
                <WindowsIcon className="w-8 h-8" />
                Инструкция для Windows
            </h1>

            <Timeline className="py-6">
                <TimelinePoint
                    icon={<DownloadIcon className="w-4 h-4" />}
                    title="Загрузка"
                    description={(<>Скачайте клиент qsing-box по ссылке на <a href="https://github.com/nextincn/qsing-box/releases" target="_blank" className="underline font-semibold">GitHub Releases</a></>)}
                >
                    <a href="https://github.com/nextincn/qsing-box/releases/download/v1.0.1/qsing-box.exe" className="w-fit">
                        <Button>
                            <DownloadIcon className="w-4 h-4" /> Скачать .exe
                        </Button>
                    </a>
                </TimelinePoint>
                <TimelinePoint
                    icon={<HardDriveIcon className="w-4 h-4" />}
                    title="Установка"
                    description="Установите клиент qsing-box, следуя инструкциям на экране"
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9FPPNqrxIWPGxjdpDgzaThLVAofFcMZOY45wN"
                        alt="Установка клиента"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<ArrowRightIcon className="w-4 h-4" />}
                    title="Запуск"
                    description="Запустите клиент qsing-box из меню Пуск"
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9DQtcRnoMiTcElUjnvRspuzqQI4XgK3mAFe5d"
                        alt="Запуск клиента"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<SettingsIcon className="w-4 h-4" />}
                    title="Настройка"
                    description={<>В открывшемся окне нажмите кнопку <span className="font-semibold">Settings</span> и поставьте галочки у пунктов <span className="font-semibold">Auto run</span> и <span className="font-semibold">Run as administrator</span>. Благодаря чему, ваш VPN будет автоматически запускаться вместе с системой.</>}
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9QhhdUseAkmXR8li1IBZVwavbsfYNtxhJKyGp"
                        alt="Настройка клиента"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<KeyIcon className="w-4 h-4" />}
                    title="Получение доступа"
                >
                    <ConfigGenerator platform="windows" className="mt-2" />
                </TimelinePoint>
                <TimelinePoint
                    icon={<FileIcon className="w-4 h-4" />}
                    title="Добавление конфига"
                    description={<>
                        Нажмите на кнопку <span className="font-semibold">Import</span> и выберите файл <span className="font-semibold">config.json</span>, полученный в предыдущем шаге.
                    </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9ecBMTVt3C7ESbFDHK6yGLnqdtX1ZYNAJwrM8"
                        alt="Добавление конфига"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<CheckIcon className="w-4 h-4" />}
                    title="Подтверждение"
                    description={<>
                        У вас появится новое окно с редактором. Просто нажмите <span className="font-semibold">Save</span>.
                    </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9P5BCHasW8hk6HaYvnFKVTs4ryALE15DUpflg"
                        alt="Подтверждение"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<PowerIcon className="w-4 h-4" />}
                    title="Использование"
                    description={<>
                        Включать и выключать VPN можно через трей (правый угол панели управления). Нажимаете на иконку клиента правой кнопкой мыши и выбираете <span className="font-semibold">Enable proxy</span> для включения или <span className="font-semibold">Disable proxy</span> для выключения.
                    </>}
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT93f0BjxWBoculjsvZTqXPAUN8w0RkS9Cf47hO"
                        alt="Использование"
                        width={600}
                        height={600}
                        className="rounded-lg"
                    />
                </TimelinePoint>
            </Timeline>

            <AnyIssues />
        </div>
    )
}