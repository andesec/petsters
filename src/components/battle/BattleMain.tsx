import { useState } from 'react';
import ImageService from "@/services/ImageService";
import TypeService from "@/services/TypeService";
import UXService from "@/services/UXService";

interface BattleMainProps {
    battle: any;
    onActionSelected: (action: any) => void;
    loading?: boolean;
}

export default function BattleMain({ battle, onActionSelected, loading = false }: BattleMainProps) {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const canContinue = (selectedAction || selectedItem) && !loading && !isProcessing;

    const handleContinue = () => {
        setIsProcessing(true);

        const action = selectedAction
            ? { type: "action", item: selectedAction }
            : { type: "medicine", item: selectedItem };

        onActionSelected(action);

        // Reset processing after a timeout if parent doesn't unmount/update fast enough
        // But ideally parent handles loading state
        setTimeout(() => {
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className={`p-[20px] font-sans ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
            <div className="flex justify-around mb-[20px]">
                {/* Trainer's Pokemon */}
                <div className="relative w-[45%] text-center">
                    <div className="flex justify-center items-center gap-[10px]">
                        <h3 className="font-bold text-lg">{"Your " + battle.cps?.n}</h3>
                        <i className="fa fa-info-circle text-[14px] cursor-pointer text-[#007bff] hover:text-[#0056b3]" onClick={() => UXService.showInfo('pk', battle.cps?.o)}></i>
                    </div>
                    <img src={ImageService.getImageURLForPokemon(battle.cps?.o)} alt="Your Pokemon" className="w-auto h-[120px] mb-[10px] mx-auto" />
                    <div className="w-full bg-[#f0f0f0] rounded-[10px] overflow-hidden my-[5px] flex items-center gap-[5px]">
                        <div className="bg-[#28a745] h-[15px] rounded-[5px] transition-all duration-500" style={{ width: battle.cps ? (battle.cps.h / battle.cps.th) * 100 + '%' : '0%' }}></div>
                        <span className="text-[13px] text-[#333] px-1">{battle.cps?.h}/{battle.cps?.th}</span>
                    </div>
                    <p>Level {battle.cps?.l}</p>
                    <div className="flex justify-center gap-[5px] mt-1">
                        {battle.cps?.ty?.map((type: string, i: number) => (
                            <div key={i} style={{ backgroundColor: TypeService.getTypeColor(type) }} className="text-white text-[12px] px-[6px] py-[2px] rounded-[4px]" title={type}>{type}</div>
                        ))}
                    </div>
                </div>

                {/* Opponent's Pokemon */}
                <div className="relative w-[45%] text-center">
                    <div className="flex justify-center items-center gap-[10px]">
                        <h3 className="font-bold text-lg">{battle.op + "'s " + battle.ops?.n}</h3>
                        <i className="fa fa-info-circle text-[14px] cursor-pointer text-[#007bff] hover:text-[#0056b3]" onClick={() => UXService.showInfo('pk', battle.ops?.o)}></i>
                    </div>
                    <img src={ImageService.getImageURLForPokemon(battle.ops?.o)} alt="Opponent Pokemon" className="w-auto h-[120px] mb-[10px] mx-auto" />
                    <div className="w-full bg-[#f0f0f0] rounded-[10px] overflow-hidden my-[5px] flex items-center gap-[5px]">
                        <div className="bg-[#28a745] h-[15px] rounded-[5px] transition-all duration-500" style={{ width: battle.ops ? (battle.ops.h / battle.ops.th) * 100 + '%' : '0%' }}></div>
                        <span className="text-[13px] text-[#333] px-1">{battle.ops?.h}/{battle.ops?.th}</span>
                    </div>
                    <p>Level {battle.ops?.l}</p>
                    <div className="flex justify-center gap-[5px] mt-1">
                        {battle.ops?.ty?.map((type: string, i: number) => (
                            <div key={i} style={{ backgroundColor: TypeService.getTypeColor(type) }} className="text-white text-[12px] px-[6px] py-[2px] rounded-[4px]" title={type}>{type}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Battle Message */}
            <h4 className="text-left font-bold mb-4">{battle.m}</h4>

            {/* Actions and Items Section */}
            <div className="flex flex-col md:flex-row justify-between gap-[20px] my-[20px]">
                {/* Actions Section */}
                <div className="flex-1 flex flex-col">
                    <p className="text-left font-bold mb-2">Use an action:</p>
                    {battle.os?.map((action: any) => (
                        <div key={action.i} className="relative m-[10px] mx-[15%]">
                            <input
                                type="radio"
                                id={action.i}
                                value={action.i}
                                checked={selectedAction === action.i}
                                onChange={() => { setSelectedAction(action.i); setSelectedItem(null); }}
                                name="action"
                                className="hidden peer"
                                disabled={loading || isProcessing}
                            />
                            <label
                                htmlFor={action.i}
                                className={`block text-white p-[10px_20px] rounded-[10px] shadow-md cursor-pointer text-center transition-all duration-200 border-[3px] border-transparent 
                                peer-checked:bg-opacity-95 peer-checked:border-white peer-checked:shadow-lg peer-checked:ring-4 peer-checked:ring-blue-400/50`}
                                style={{ backgroundColor: TypeService.getTypeColor(action.t) }}
                            >
                                <span>{action.n}</span>
                                <i className="fa fa-info-circle absolute right-[10px] top-[10px] text-[12px] text-[#dcdedf] hover:text-[#96989a]" onClick={(e) => { e.preventDefault(); UXService.showInfo('m', action.i); }}></i>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Medicine Section */}
                <div className="flex-1 flex flex-col">
                    <p className="text-left font-bold mb-2">Use an item:</p>
                    {battle.im?.map((item: any) => (
                        <div key={item.i} className="relative m-[10px] mx-[15%]">
                            <input
                                type="radio"
                                id={'item-input' + item.i}
                                value={item.i}
                                checked={selectedItem?.i === item.i}
                                onChange={() => { setSelectedItem(item); setSelectedAction(null); }}
                                disabled={!!selectedAction || loading || isProcessing}
                                name="item"
                                className="hidden peer"
                            />
                            <label
                                htmlFor={'item-input' + item.i}
                                className={`block bg-gray-500 text-white p-[10px_20px] rounded-[10px] shadow-md cursor-pointer text-center transition-all duration-200 border-[3px] border-transparent 
                                peer-checked:bg-gray-700 peer-checked:border-white peer-checked:shadow-lg peer-checked:ring-4 peer-checked:ring-blue-400/50`}
                            >
                                {item.n}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Continue Button */}
            <button
                disabled={!canContinue}
                onClick={handleContinue}
                className="bg-[#3f51b5] text-white border-none px-[20px] py-[10px] rounded-[10px] cursor-pointer hover:bg-[#303f9f] disabled:bg-gray-400 disabled:cursor-not-allowed block mx-auto"
            >
                {loading || isProcessing ? 'Processing...' : 'Continue'}
            </button>
        </div>
    );
}
