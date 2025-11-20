import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BattleService from "@/services/BattleService";

interface BattleEndProps {
    battle: any;
    t: string;
}

export default function BattleEnd({ battle, t }: BattleEndProps) {
    const [finalData, setFinalData] = useState<any>({});
    const router = useRouter();

    useEffect(() => {
        async function endBattle() {
            console.log("ending battle now");
            const data = await BattleService.continueBattle(t, { cs: 9 });
            setFinalData(data);
        }
        endBattle();
    }, [t]);

    const goBackToMap = () => {
        router.push('/map');
    };

    return (
        <div className="text-center">
            <h4 className="text-xl font-bold mb-4">{battle.m}</h4>
            <br />
            {finalData.ts?.map((text: string, index: number) => (
                <p key={index} className="mb-2">{text}</p>
            ))}
            <br />
            <button
                onClick={goBackToMap}
                className="bg-[#3f51b5] text-white border-none px-[20px] py-[10px] rounded-[10px] cursor-pointer hover:bg-[#303f9f]"
            >
                Back to Map
            </button>
        </div>
    );
}
