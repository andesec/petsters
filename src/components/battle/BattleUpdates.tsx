'use client';

import { useState, useEffect } from 'react';
import eventBus from '@/eventBus';

interface TurnSummary {
    isDivider: boolean;
    text?: string;
    isNew?: boolean;
}

export default function BattleUpdates() {
    const [turnSummary, setTurnSummary] = useState<TurnSummary[]>([]);

    useEffect(() => {
        const showBattleUpdates = (newUpdates: string[]) => {
            const updates: TurnSummary[] = [];

            // Add a divider for the new turn
            updates.push({ isDivider: true, isNew: true });

            // Add the updates
            newUpdates.forEach((update) => {
                updates.push({ isDivider: false, text: update, isNew: true });
            });

            setTurnSummary((prev) => [...updates, ...prev]);

            // Remove the `isNew` flag after a short delay to stop the animation
            setTimeout(() => {
                setTurnSummary((prev) => prev.map(u => ({ ...u, isNew: false })));
            }, 1000);
        };

        eventBus.on('battle-update', showBattleUpdates);

        return () => {
            eventBus.off('battle-update', showBattleUpdates);
        };
    }, []);

    const getUpdateClass = (summary: TurnSummary) => {
        if (summary.isDivider) return '';
        const text = summary.text || '';
        if (text.includes('fainted!')) return 'update-fainted';
        if (text.includes('sent out')) return 'update-sent-out';
        if (text.includes('used')) return 'update-used';
        if (text.includes('is burned')) return 'update-burned';
        if (text.includes('is poisoned')) return 'update-poisoned';
        if (text.includes('is frozen')) return 'update-frozen';
        if (text.includes('is asleep')) return 'update-asleep';
        if (text.includes('is paralyzed')) return 'update-paralyzed';
        if (text.includes('dodged')) return 'update-dodged';
        return 'update-default';
    };

    if (turnSummary.length === 0) {
        return (
            <div>
                <h2 className="text-xl font-bold mb-4">Battle Updates</h2>
                <p className="text-sm text-gray-500">No battle updates yet...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Battle Updates</h2>
            <ul className="list-none p-0 m-0">
                {turnSummary.map((summary, index) => (
                    <li
                        key={index}
                        className={`
                            update-item
                            ${getUpdateClass(summary)}
                            ${summary.isNew ? 'new-update' : ''}
                            ${summary.isNew ? 'fade-enter-active' : ''}
                        `}
                    >
                        {summary.isDivider ? (
                            <div className="turn-divider"></div>
                        ) : (
                            <div>{summary.text}</div>
                        )}
                    </li>
                ))}
            </ul>

            <style jsx>{`
                .turn-divider {
                    text-align: center;
                    font-weight: bold;
                    border-top: 1px solid #ccc;
                    color: #333;
                }

                .update-item {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 14px;
                    transition: transform 0.2s, background-color 0.2s;
                }

                .update-item:hover {
                    transform: scale(1.03);
                }

                .update-fainted {
                    background-color: #ffcccc;
                    border: 1px solid #ff0000;
                }

                .update-sent-out {
                    background-color: #ccffcc;
                    border: 1px solid #00b000;
                }

                .update-used {
                    background-color: #cce5ff;
                    border: 1px solid #007bff;
                }

                .update-burned {
                    background-color: #ffe0cc;
                    border: 1px solid #ff6600;
                }

                .update-poisoned {
                    background-color: #e0ccff;
                    border: 1px solid #800080;
                }

                .update-frozen {
                    background-color: #ccf2ff;
                    border: 1px solid #00cccc;
                }

                .update-asleep {
                    background-color: #f5f5dc;
                    border: 1px solid #c2b280;
                }

                .update-paralyzed {
                    background-color: #fffacd;
                    border: 1px solid #ffd700;
                }

                .update-dodged {
                    background-color: #d8d8d8;
                    border: 1px solid #636363;
                }

                .update-default {
                    background-color: #e3f2fd;
                    border: 1px solid #90caf9;
                }

                .new-update {
                    animation: highlight 1s ease-out;
                }

                @keyframes highlight {
                    from {
                        background-color: yellow;
                    }
                    to {
                        background-color: inherit;
                    }
                }

                .fade-enter-active {
                    animation: fadeIn 0.5s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
