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
                <h2 className="text-xl font-bold mb-4 text-foreground">Battle Updates</h2>
                <p className="text-sm text-muted-foreground">No battle updates yet...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-foreground">Battle Updates</h2>
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
                    border-top: 1px solid hsl(var(--border));
                    color: hsl(var(--foreground));
                }

                .update-item {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: transform 0.2s, background-color 0.2s;
                    color: hsl(var(--foreground));
                }

                .update-item:hover {
                    transform: scale(1.03);
                }

                .update-fainted {
                    background-color: hsl(var(--destructive) / 0.15);
                    border: 1px solid hsl(var(--destructive));
                }

                .update-sent-out {
                    background-color: rgba(34, 197, 94, 0.15);
                    border: 1px solid rgb(34, 197, 94);
                }

                .update-used {
                    background-color: hsl(var(--primary) / 0.15);
                    border: 1px solid hsl(var(--primary));
                }

                .update-burned {
                    background-color: rgba(249, 115, 22, 0.15);
                    border: 1px solid rgb(249, 115, 22);
                }

                .update-poisoned {
                    background-color: rgba(168, 85, 247, 0.15);
                    border: 1px solid rgb(168, 85, 247);
                }

                .update-frozen {
                    background-color: rgba(6, 182, 212, 0.15);
                    border: 1px solid rgb(6, 182, 212);
                }

                .update-asleep {
                    background-color: hsl(var(--muted));
                    border: 1px solid hsl(var(--muted-foreground));
                }

                .update-paralyzed {
                    background-color: rgba(234, 179, 8, 0.15);
                    border: 1px solid rgb(234, 179, 8);
                }

                .update-dodged {
                    background-color: hsl(var(--secondary));
                    border: 1px solid hsl(var(--secondary-foreground));
                }

                .update-default {
                    background-color: hsl(var(--accent));
                    border: 1px solid hsl(var(--accent-foreground) / 0.3);
                }

                .new-update {
                    animation: highlight 1s ease-out;
                }

                @keyframes highlight {
                    from {
                        background-color: hsl(var(--primary) / 0.5);
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
