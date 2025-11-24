import { useState, useEffect } from 'react';
import PokemonService from "@/services/PokemonService";
import ImageService from "@/services/ImageService";
import TypeService from "@/services/TypeService";
import UXService from "@/services/UXService";
import TypePreset from "@/components/presets/TypePreset";

interface PokemonInfoComponentProps {
    id: string | number;
}

export default function PokemonInfoComponent({ id }: PokemonInfoComponentProps) {
    const [p, setP] = useState<any>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await PokemonService.loadPokemonInfo(id);
                setP(data);
            } catch (error) {
                console.error("Error loading Pokemon info:", error);
            }
        }
        if (id) {
            loadData();
        }
    }, [id]);

    if (!p) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-1.5">
            <h2 className="text-base md:text-lg font-bold">#{p.i} - {p.n}</h2>
            <img
                src={ImageService.getImageURLForPokemon(p.i)}
                alt={p.n}
                className="w-[80%] max-h-[250px] md:max-h-[350px] my-2 md:my-4 self-center"
            />
            <p className="text-xs md:text-sm">{p.f}</p>

            <h3 className="font-bold mt-1.5 text-sm md:text-base">Type:</h3>
            {p.t && <TypePreset types={p.t} />}

            <h3 className="font-bold mt-1.5 text-sm md:text-base">Abilities:</h3>
            <div className="flex flex-col">
                {p.a?.map((ability: any, index: number) => (
                    <div key={index}>
                        <p
                            style={{ cursor: 'pointer' }}
                            title={ability.d}
                            className="hover:text-[#3e3ee3] hover:underline text-xs md:text-sm"
                            onClick={() => UXService.showInfo('a', ability.i)}
                        >
                            - {ability.t}
                        </p>
                    </div>
                ))}
            </div>

            <h3 className="font-bold mt-1.5 text-sm md:text-base">Moves:</h3>
            <table className="w-full border-collapse text-xs md:text-sm">
                <thead>
                    <tr>
                        <th className="border border-[#ddd] p-1 md:p-2 text-left bg-[#f4f4f4] font-bold">Move</th>
                        <th className="border border-[#ddd] p-1 md:p-2 text-left bg-[#f4f4f4] font-bold">At Level</th>
                        <th className="border border-[#ddd] p-1 md:p-2 text-left bg-[#f4f4f4] font-bold">Power</th>
                    </tr>
                </thead>
                <tbody>
                    {p.ac?.map((action: any, index: number) => (
                        <tr
                            key={index}
                            title={'Type: ' + action.t}
                            style={{ backgroundColor: TypeService.getTypeColor(action.t), color: 'white' }}
                        >
                            <td
                                className="border border-[#ddd] p-1 md:p-2 cursor-pointer hover:underline"
                                onClick={() => UXService.showInfo('m', action.i)}
                            >
                                {action.a}
                            </td>
                            <td className="border border-[#ddd] p-1 md:p-2">{action.l}</td>
                            <td className="border border-[#ddd] p-1 md:p-2">{action.p}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
