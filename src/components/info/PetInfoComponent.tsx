import { useState, useEffect } from 'react';
import PetsterService from "@/services/PetsterService";

interface PetInfoComponentProps {
    id: string | number;
    pet?: any;
}

export default function PetInfoComponent({ id, pet }: PetInfoComponentProps) {
    const [p, setP] = useState<any>(pet || {});

    useEffect(() => {
        async function loadData() {
            if (pet) {
                setP(pet);
            } else {
                try {
                    const data = await PetsterService.loadPetInfo(id);
                    setP(data);
                } catch (error) {
                    console.error("Error loading Pet info:", error);
                }
            }
        }
        if (id || pet) {
            loadData();
        }
    }, [id, pet]);

    if (!p.n && !p.i) return <div>Loading...</div>;

    return (
        <div>
            <h3 className="font-bold">Details of {id}</h3>
            <h3 className="font-bold">{p.n}</h3>
            <br />
            {/* Add more details as needed based on API response structure */}
        </div>
    );
}
