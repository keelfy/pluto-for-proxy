import AnyIssues from "@/components/any-issues";
import ConfigGenerator from "@/components/config-generator";
import AndroidIcon from "@/components/icons/android";
import { Button } from "@/components/ui/button";
import { Timeline, TimelinePoint } from "@/components/ui/timeline";
import { ArrowRightIcon, CheckIcon, DownloadIcon, FileIcon, KeyIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AndroidGuidePage() {
    return (
        <div className="flex flex-col gap-4 max-w-xl md:mt-20">
            <h1 className="text-2xl font-bold flex items-center gap-4">
                <AndroidIcon className="w-8 h-8" />
                Инструкция для Android
            </h1>

            <Timeline className="py-6">
                <TimelinePoint
                    icon={<KeyIcon className="w-4 h-4" />}
                    title="Получение доступа"
                >
                    <ConfigGenerator platform="android" className="mt-2" />
                </TimelinePoint>
                <TimelinePoint
                    icon={<DownloadIcon className="w-4 h-4" />}
                    title="Загрузка"
                    description={(
                        <>
                            Установите приложение <span className="font-semibold"><a href="https://play.google.com/store/apps/details?id=io.nekohasekai.sfa" target="_blank" rel="noopener noreferrer">sing-box</a></span> из Google Play.
                            Альтернативно, можете скачать <span className="font-semibold">.apk</span> файл из <span className="font-semibold"><a href="https://github.com/SagerNet/sing-box/releases" target="_blank" rel="noopener noreferrer">официального GitHub репозитория</a></span>.
                        </>
                    )}
                >
                    <div className="flex gap-4 items-start w-fit">
                        <a href="https://play.google.com/store/apps/details?id=io.nekohasekai.sfa" target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9dFnHwrzVvaBzKGYex4DLql0U2frITZuNOm1b"
                                alt="Google Play"
                                className="w-30 h-10"
                            />
                        </a>
                        <a href="https://github.com/SagerNet/sing-box/releases/download/v1.11.0-beta.24/SFA-1.11.0-beta.24-universal.apk" target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" className="w-fit w-30 h-10">
                                Скачать .apk
                            </Button>
                        </a>
                    </div>
                </TimelinePoint>
                <TimelinePoint
                    icon={<ArrowRightIcon className="w-4 h-4" />}
                    title="Начало"
                    description={
                        <>
                            Откройте установленное приложение и перейдите во вкладку <span className="font-semibold">Profiles</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9icsUf0GPAaBprYbR2xjUlkDqQIJV5gdXZ8SE"
                        alt="Начало"
                        width={300}
                        height={300}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<PlusIcon className="w-4 h-4" />}
                    title="Создание профиля"
                    description={
                        <>
                            Нажмите кнопку добавления профиля справа снизу и выберите пункт <span className="font-semibold">Create Manually</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9D3iNRloMiTcElUjnvRspuzqQI4XgK3mAFe5d"
                        alt="Добавление профиля"
                        width={300}
                        height={300}
                        className="rounded-lg"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<FileIcon className="w-4 h-4" />}
                    title="Добавление конфигурации"
                    description={
                        <>
                            У вас появится окно создания профиля.<br />
                            - В поле <span className="font-semibold">Name</span> укажите любое название.<br />
                            - В поле <span className="font-semibold">Type</span> выберите <span className="font-semibold">Local</span>.<br />
                            - В поле <span className="font-semibold">Source</span> должно быть значение <span className="font-semibold">Import</span>.<br />
                            У вас появится кнопка <span className="font-semibold">Import File</span> — найдите на телефоне файл <span className="font-semibold">config.json</span>, полученный в первом шаге.<br />
                            Нажмите кнопку <span className="font-semibold">Create</span>.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT9SNI0Q3h15hv2NZwcSkPenUjbdKGFX6MaOYsp"
                        alt="Создание профиля"
                        width={400}
                        height={400}
                        className="rounded-lg mt-2"
                    />
                </TimelinePoint>
                <TimelinePoint
                    icon={<CheckIcon className="w-4 h-4" />}
                    title="Проверка"
                    description={
                        <>
                            Перейдите во вкладку <span className="font-semibold">Dashboard</span> (самая левая), где у вас должен был появиться профиль, названный вами в предыдущем пункте.
                        </>
                    }
                />
                <TimelinePoint
                    icon={<CheckIcon className="w-4 h-4" />}
                    title="Запуск"
                    description={
                        <>
                            Справа снизу нажимайте кнопку запуска VPN.
                        </>
                    }
                >
                    <Image
                        src="https://8bslhl87ch.ufs.sh/f/Gim6IoWu5wT98yiVn3O6QdkcRUXKzYSNi3wu4npO2seET9V1"
                        alt="Запуск"
                        width={300}
                        height={300}
                        className="rounded-lg"
                    />
                </TimelinePoint>
            </Timeline>

            <AnyIssues />
        </div >
    )
}