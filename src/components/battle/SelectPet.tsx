import ImageService from "@/services/ImageService";
import UXService from "@/services/UXService";

interface SelectPetProps {
    m: string;
    os: any[];
    onPokemonSelected: (pokemon: any) => void;
}

export default function SelectPet({ m, os, onPokemonSelected }: SelectPetProps) {
    return (
        <div className="text-center">
            <h4 className="text-lg font-bold mb-4">{m}</h4>
            <div className="flex flex-wrap justify-center gap-4">
                {os.map((o) => (
                    <div key={o.i} className="border border-[#ddd] rounded-[10px] p-[10px] text-center w-[120px]">
                        <img
                            src={ImageService.getImageURLForPokemon(o.o)}
                            alt={o.n}
                            className="w-auto h-[90px] object-contain mx-auto"
                        />
                        <p
                            className="my-[8px] font-bold cursor-pointer hover:text-[#3e3ee3] hover:underline"
                            onClick={() => UXService.showInfo('pk', o.o)}
                        >
                            {o.n}
                        </p>
                        <button
                            onClick={() => onPokemonSelected(o)}
                            className="px-[12px] py-[6px] bg-[#007bff] text-white border-none rounded-[10px] cursor-pointer hover:bg-[#0056b3]"
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
