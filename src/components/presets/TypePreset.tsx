import TypeService from "@/services/TypeService";

interface TypePresetProps {
    types: string[];
}

export default function TypePreset({ types }: TypePresetProps) {
    return (
        <div className="flex gap-[5px]">
            {types.map((type, i) => (
                <div
                    key={i}
                    className="text-white text-[13px] w-[45px] py-[5px] px-[9px] rounded-[8px] inline-block text-center"
                    style={{ backgroundColor: TypeService.getTypeColor(type) }}
                    title={type}
                >
                    {type}
                </div>
            ))}
        </div>
    );
}
