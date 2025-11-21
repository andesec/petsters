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
            <h2 className="text-2xl font-bold mb-4">Gyms</h2>
            <div className="flex flex-wrap gap-4 mt-[15px] flex-col md:flex-row">
                {gyms.map((gym) => (
                    <div
                        key={gym.i}
                        className={`flex-1 min-w-[300px] border-2 rounded-[8px] overflow-hidden shadow-md cursor-pointer ${getGymClass(gym.t)}`}
                        onClick={() => startGymBattle(gym.gi)}
                    >
                        <div className="flex items-center justify-between p-[10px]">
                            <div className="flex flex-col items-center text-center flex-1 p-[10px]">
                                <img
                                    src={ImageService.getImageURLForGymMedal(gym.m)}
                                    alt={gym.m}
                                    className="w-[70px] h-[70px] object-cover rounded-full mb-[10px]"
                                />
                                <div className="text-center">
                                    <h3 className="m-0 text-[16px] text-[#333] font-bold">{gym.m} Badge</h3>
                                    <br />
                                    <h4 className="m-[8px_0_0] text-[#666] text-[14px]">{gym.l}</h4>
                                    <h5 className="m-[8px_0_0] text-[#666] text-[14px]">{gym.g}</h5>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-[10px]">
                                <img
                                    src={ImageService.getImageURLForGymMaster(gym.g)}
                                    alt={gym.g}
                                    className="w-auto h-[180px] object-cover rounded-[8px]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
