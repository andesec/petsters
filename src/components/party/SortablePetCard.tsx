import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageService from '@/services/ImageService';
import UXService from '@/services/UXService';
import TypeService from '@/services/TypeService';

interface SortablePetCardProps {
    pet: any;
    index: number;
    onRemove: (index: number) => void;
}

export default function SortablePetCard({ pet, index, onRemove }: SortablePetCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: pet.i });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex mb-[10px] h-auto min-h-[120px] justify-between items-center bg-white dark:bg-[#1a1f2e] border-2 border-border rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="flex w-[5%] justify-center items-center bg-muted h-[120px] rounded-l-lg text-foreground text-[18px] p-[10px] cursor-grab active:cursor-grabbing">
                {index + 1}
            </div>

            <div className="flex flex-row justify-evenly items-center w-full">
                <img
                    src={ImageService.getImageURLForPokemon(pet.o)}
                    alt={pet.n}
                    className="flex m-[10px] max-w-[100px] max-h-[100px] cursor-pointer"
                    onClick={() => UXService.showInfo('p', pet.o)}
                />

                <div className="flex flex-col">
                    <h3
                        className="cursor-pointer hover:text-primary hover:underline font-bold text-foreground dark:text-white"
                        onClick={() => UXService.showInfo('pe', pet.i)}
                    >
                        {pet.n}
                    </h3>
                    <p className="text-[13px] text-muted-foreground">Level: {pet.l}</p>

                    <div className="flex gap-[5px] my-[5px]">
                        {pet.ty?.map((type: string, i: number) => (
                            <div
                                key={i}
                                className="text-white text-[13px] px-[9px] py-[5px] rounded-[8px] inline-block text-center"
                                style={{ backgroundColor: TypeService.getTypeColor(type) }}
                                title={type}
                            >
                                {type}
                            </div>
                        ))}
                    </div>

                    <div className="overflow-hidden my-[5px] flex items-center w-full">
                        <div className="bg-muted rounded-[10px] w-[150px] h-[15px] flex">
                            <div
                                className={`rounded-[10px] h-full ${UXService.getHPBarClass(pet.h, pet.t)['hp-critical'] ? 'bg-destructive' :
                                    UXService.getHPBarClass(pet.h, pet.t)['hp-warn'] ? 'bg-yellow-500' :
                                        'bg-green-600'
                                    }`}
                                style={UXService.getHPBarStyle(pet.h, pet.t)}
                            ></div>
                        </div>
                        <span className="text-[13px] text-foreground text-center w-[60px]">{pet?.h}/{pet?.t}</span>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col items-center text-center ml-[10%]">
                    <h4 className="font-bold text-foreground">Learned Moves:</h4>
                    <br />
                    {pet.a?.map((action: any) => (
                        <div key={action.i} className="cursor-pointer hover:text-primary hover:underline text-foreground">
                            {action.a}
                        </div>
                    ))}
                </div>
            </div>

            {/* Remove button */}
            <div className="text-[18px] flex w-[5%] justify-center items-center bg-destructive h-[120px] rounded-r-lg text-destructive-foreground cursor-pointer hover:bg-destructive/80 transition-colors"
                onClick={() => onRemove(index)}>
                ✕
            </div>
        </div>
    );
}
