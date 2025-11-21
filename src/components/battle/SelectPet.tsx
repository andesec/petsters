import ImageService from "@/services/ImageService";
import UXService from "@/services/UXService";

interface SelectPetProps {
    m: string;
    os: any[];
    onPokemonSelected: (pokemon: any) => void;
    loading?: boolean;
}

export default function SelectPet({ m, os, onPokemonSelected, loading = false }: SelectPetProps) {
    return (
        <div className={`p-[20px] font-sans ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
            <h4 className="text-left font-bold mb-4">{m}</h4>
            <div className="flex flex-wrap justify-center gap-[20px]">
                {os.map((pokemon: any) => (
                    <div
                        key={pokemon.i}
                        className={`w-[150px] bg-white border border-slate-400 rounded-[10px] p-[10px] text-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 ${loading ? 'cursor-not-allowed' : ''}`}
                        onClick={() => !loading && onPokemonSelected(pokemon)}
                    >
                        <img
                            src={ImageService.getImageURLForPokemon(pokemon.o)}
                            alt={pokemon.n}
                            className="w-auto h-[90px] object-contain mx-auto"
                        />
                        <p
                            className="my-[8px] font-bold cursor-pointer hover:text-[#3e3ee3] hover:underline"
                            onClick={(e) => {
                                e.stopPropagation();
                                UXService.showInfo('pk', pokemon.o);
                            }}
                        >
                            {pokemon.n}
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                !loading && onPokemonSelected(pokemon);
                            }}
                            disabled={loading}
                            className="px-[12px] py-[6px] bg-[#007bff] text-white border-none rounded-[10px] cursor-pointer hover:bg-[#0056b3] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
