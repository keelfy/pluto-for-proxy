import ConfigGenerator from "@/components/config-generator";

export default function ConfigGeneratorPage() {

    return (
        <div className="flex flex-col justify-center h-full gap-6">
            <div className="text-2xl font-bold max-w-sm md:max-w-2xl">
                Генератор конфигурации клиента
            </div>
            <ConfigGenerator platform={undefined} className="max-w-sm md:max-w-2xl"/>
        </div>
    );
}
