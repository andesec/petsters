'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '@/services/ApiService';
import UXService from '@/services/UXService';
import ImageService from '@/services/ImageService';
import eventBus from '@/eventBus';

const typeStyles: Record<string, string> = {
    Normal: "border-[#a8a878] bg-[#f8f8f0]",
    Fire: "border-[#f08030] bg-[#fddfdf]",
    Water: "border-[#6890f0] bg-[#def3fd]",
    Grass: "border-[#78c850] bg-[#e0f8d0]",
    Electric: "border-[#f8d030] bg-[#fff8dc]",
    Ice: "border-[#98d8d8] bg-[#f0ffff]",
    Fighting: "border-[#c03028] bg-[#fdd5d5]",
    Poison: "border-[#a040a0] bg-[#f8d4f8]",
    Ground: "border-[#e0c068] bg-[#f8e0b8]",
    Flying: "border-[#a890f0] bg-[#eef1fa]",
    Psychic: "border-[#f85888] bg-[#ffe6ed]",
    Bug: "border-[#a8b820] bg-[#f8ffd0]",
    Rock: "border-[#b8a038] bg-[#f8e8d0]",
    Ghost: "border-[#705898] bg-[#e8d8f8]",
    Dragon: "border-[#7038f8] bg-[#ece0ff]",
    Dark: "border-[#705848] bg-[#e8d8c8]",
    Steel: "border-[#b8b8d0] bg-[#f0f0f8]",
    Fairy: "border-[#ee99ac] bg-[#ffe3f3]",
};

export default function GymsPage() {
    const [gyms, setGyms] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchGyms() {
            try {
                const data = await ApiService.makeRequest("/gym");
                setGyms(data);
            } catch (error) {
                UXService.error("an error occurred while fetching gyms.", error);
            }
        }
        fetchGyms();
    }, []);

    const getGymClass = (type: string) => {
        return typeStyles[type] || "border-[#ccc] bg-[#f9f9f9]";
    };

    const startGymBattle = (gi: string) => {
        console.log('startGymBattle called with:', gi);
        setTimeout(() => {
            console.log("emitting");
            eventBus.emit("bd", { ci: gi, ai: 8, t: 'trainer' });
        }, 1000);

        router.push("/battle");
    };

    return (
        <div>
            <h2 className="text-base md:text-xl font-bold mb-2 md:mb-3">Gyms</h2>
            <div className="flex flex-wrap gap-2 md:gap-3 mt-2 md:mt-3 flex-col md:flex-row">
                {gyms.map((gym) => (
                    <div
                        key={gym.i}
                        className={`flex-1 min-w-[250px] md:min-w-[300px] border-2 rounded-lg overflow-hidden shadow-md cursor-pointer ${getGymClass(gym.t)}`}
                        onClick={() => startGymBattle(gym.gi)}
                    >
                        <div className="flex items-center justify-between p-2 md:p-3">
                            <div className="flex flex-col items-center text-center flex-1 p-2">
                                <img
                                    src={ImageService.getImageURLForGymMedal(gym.m)}
                                    alt={gym.m}
                                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full mb-2"
                                />
                                <div className="text-center">
                                    <h3 className="m-0 text-xs md:text-sm text-[#333] font-bold">{gym.m} Badge</h3>
                                    <br />
                                    <h4 className="m-1 md:m-2 text-[#666] text-xs">{gym.l}</h4>
                                    <h5 className="m-1 md:m-2 text-[#666] text-xs">{gym.g}</h5>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-2">
                                <img
                                    src={ImageService.getImageURLForGymMaster(gym.g)}
                                    alt={gym.g}
                                    className="w-auto h-24 md:h-32 lg:h-40 object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
