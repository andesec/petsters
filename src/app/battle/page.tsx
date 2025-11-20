'use client';

import { useState, useEffect } from 'react';
import BattleService from "@/services/BattleService";
import UXService from "@/services/UXService";
import eventBus from "@/eventBus";
import SelectPet from "@/components/battle/SelectPet";
import BattleMain from "@/components/battle/BattleMain";
import BattleEnd from "@/components/battle/BattleEnd";

export default function BattlePage() {
    const [loading, setLoading] = useState(true);
    const [cs, setCs] = useState<string | null>(null); // 'SELECT_PET', 'SELECT_ACTION', 'END_BATTLE'
    const [battle, setBattle] = useState<any>(null);
    const [ci, setCi] = useState<string | null>(null);
    const [ai, setAi] = useState<number | null>(null);
    const [t, setT] = useState<string | null>(null);

    useEffect(() => {
        console.log("Battle created");

        const initiateBattle = async (bd: any) => {
            setCi(bd.ci);
            setAi(bd.ai);
            setT(bd.t);
            setLoading(true);
            console.log("Initiating battle");

            try {
                const response = await BattleService.initiateBattle(bd.t, { cs: null, ci: bd.ci, ai: bd.ai });
                processBattleResponse(response);
            } catch (error) {
                UXService.error("an error occurred while starting the battle.", error);
            } finally {
                setLoading(false);
            }
        };

        eventBus.on('bd', initiateBattle);

        return () => {
            eventBus.off('bd', initiateBattle);
        };
    }, []);

    const processBattleResponse = (response: any) => {
        setBattle(response);
        if (response.ns === 1 || response.ns === 6) {
            setCs("SELECT_PET");
        } else if (response.ns === 2 || response.ns === 7) {
            setCs("SELECT_ACTION");
        } else if (response.ns === 5 || response.ns === 9) {
            setCs("END_BATTLE");
        } else {
            UXService.warn("Unexpected battle state: " + response.ns);
        }
    };

    const handlePokemonSelected = async (pokemon: any) => {
        if (!t) return;
        try {
            setLoading(true);
            const response = await BattleService.continueBattle(t, { cs: 6, oi: pokemon.i });
            console.log(response);
            eventBus.emit('battle-update', response.ts);
            processBattleResponse(response);
        } catch (error) {
            UXService.error("an error occurred while selecting the pokemon.", error);
        } finally {
            setLoading(false);
        }
    };

    const handleActionSelected = async (action: any) => {
        if (!t) return;
        try {
            setLoading(true);
            const response = await BattleService.continueBattle(t, { cs: 7, oi: action.item });
            console.log(response);
            eventBus.emit('battle-update', response.ts);
            processBattleResponse(response);
        } catch (error) {
            UXService.error("an error occurred while performing the action.", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Battle</h2>
            {loading ? (
                <div className="text-[18px] text-[#555]">Loading...</div>
            ) : (
                <div>
                    {cs === 'SELECT_PET' && battle && (
                        <SelectPet
                            m={battle.m}
                            os={battle.os}
                            onPokemonSelected={handlePokemonSelected}
                        />
                    )}
                    {cs === 'SELECT_ACTION' && battle && (
                        <BattleMain
                            battle={battle}
                            onActionSelected={handleActionSelected}
                        />
                    )}
                    {cs === 'END_BATTLE' && battle && t && (
                        <BattleEnd
                            battle={battle}
                            t={t}
                        />
                    )}
                    {!cs && !loading && <div>Waiting for battle to start...</div>}
                </div>
            )}
        </div>
    );
}
