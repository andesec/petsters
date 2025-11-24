'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import PetsterService from '@/services/PetsterService';
import SortablePetCard from '@/components/party/SortablePetCard';

export default function PartyPage() {
    const [pets, setPets] = useState<any[]>([]);
    const [originalSequence, setOriginalSequence] = useState<any[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        async function fetchParty() {
            const data = await PetsterService.fetchCurrentParty();
            if (data) {
                setPets(data);
                const sequence = data.map((pet: any) => pet.i);
                for (let i = sequence.length + 1; i <= 6; i++) {
                    sequence.push(null);
                }
                setOriginalSequence(sequence);
            }
        }
        fetchParty();
    }, []);

    const currentSequence = useMemo(() => {
        const sequence = pets.map((pet) => pet.i);
        for (let i = sequence.length + 1; i <= 6; i++) {
            sequence.push(null);
        }
        return sequence;
    }, [pets]);

    const sequenceChanged = useMemo(() => {
        if (currentSequence.length !== originalSequence.length) return true;
        for (let i = 0; i < 6; i++) {
            if (currentSequence[i] !== originalSequence[i]) {
                return true;
            }
        }
        return false;
    }, [currentSequence, originalSequence]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPets((items) => {
                const oldIndex = items.findIndex((item) => item.i === active.id);
                const newIndex = items.findIndex((item) => item.i === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const removePet = (index: number) => {
        const newPets = [...pets];
        newPets.splice(index, 1);
        setPets(newPets);
    };

    const saveParty = async () => {
        if (!sequenceChanged) {
            alert("No changes to save!");
            return;
        }
        await PetsterService.saveCurrentParty(currentSequence);
        // Update original sequence after save
        setOriginalSequence([...currentSequence]);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Your Current Party</h2>
            <p className="mb-4 text-muted-foreground">You can drag the cards to reorder your party.</p>

            <div className="flex flex-col gap-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={pets.map(p => p.i)}
                        strategy={verticalListSortingStrategy}
                    >
                        {pets.map((p, index) => (
                            <SortablePetCard
                                key={p.i}
                                pet={p}
                                index={index}
                                onRemove={removePet}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Desktop Save Button */}
            <button
                className="hidden md:block mt-5 bg-primary text-primary-foreground border-none px-6 py-3 rounded-lg cursor-pointer hover:bg-primary/90 shadow-md hover:shadow-lg text-[15px] font-medium transition-all duration-200"
                onClick={saveParty}
            >
                Save Party
            </button>

            {/* Mobile Floating Save Button */}
            <button
                className="md:hidden fixed bottom-4 right-4 z-[90] bg-primary text-primary-foreground border-none p-4 rounded-full cursor-pointer hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-2xl hover:shadow-xl font-medium"
                onClick={saveParty}
                aria-label="Save Party"
            >
                <i className="fas fa-save text-lg"></i>
            </button>
        </div>
    );
}
