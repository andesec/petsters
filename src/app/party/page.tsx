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
            <h2 className="text-2xl font-bold mb-4">Your Current Party</h2>
            <p className="mb-4">You can drag the cards to reorder your party.</p>

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

            <button
                className="mt-5 bg-[#3f51b5] text-white border-none px-[20px] py-[10px] rounded-[10px] cursor-pointer hover:bg-[#303f9f] shadow-md text-[15px]"
                onClick={saveParty}
            >
                Save Party
            </button>
        </div>
    );
}
