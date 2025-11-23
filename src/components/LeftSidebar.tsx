'use client';

import { useState, useRef, useEffect } from 'react';
import SearchService from '@/services/SearchService';
import SearchResultsControl from '@/components/info/SearchResultsControl';
import PetInfoComponent from '@/components/info/PetInfoComponent';
import PokemonInfoComponent from '@/components/info/PokemonInfoComponent';
import eventBus from '@/eventBus';

export default function LeftSidebar() {
    const [currentView, setCurrentView] = useState<string | undefined>(undefined);
    const [dataId, setDataId] = useState<any>(undefined);
    const [searchResults, setSearchResults] = useState<any>({});
    const [selectedSearchType, setSelectedSearchType] = useState('p');
    const searchBarRef = useRef<HTMLInputElement>(null);
    const searchTypeDropdownRef = useRef<HTMLSelectElement>(null);

    // Listen for show-info events
    useEffect(() => {
        const handleShowInfo = (data: { v: string; i: string }) => {
            setDataId(data.i);
            setCurrentView(data.v);
        };

        eventBus.on('show-info', handleShowInfo);

        return () => {
            eventBus.off('show-info', handleShowInfo);
        };
    }, []);



    const search = async () => {
        const searchText = searchBarRef.current?.value || '';
        if (searchText.length < 3) {
            alert('Please enter a search keyword. Keyword should be at least 3 characters long.');
            return;
        }

        const result = await SearchService.searchKeyword(selectedSearchType, searchText);

        if (result.error) {
            alert(result.error);
            return;
        }

        if (result.r.length === 1) {
            setDataId(result.r[0].i);
            setCurrentView(result.t);
            return;
        }

        setCurrentView('r');
        setSearchResults(result);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            search();
        }
    };

    return (
        <div className="h-full flex flex-col gap-3">
            {/* Navigation Links */}
            <div className="flex flex-col gap-1 pb-3 border-b border-border">
                <a href="/map" className="text-xs md:text-sm text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-accent">
                    <i className="fas fa-map mr-2 text-xs"></i> Map
                </a>
                <a href="/profile" className="text-xs md:text-sm text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-accent">
                    <i className="fas fa-user mr-2 text-xs"></i> Profile
                </a>
                <a href="/gyms" className="text-xs md:text-sm text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-accent">
                    <i className="fas fa-dumbbell mr-2 text-xs"></i> Gyms
                </a>
                <a href="/party" className="text-xs md:text-sm text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-accent">
                    <i className="fas fa-paw mr-2 text-xs"></i> Party
                </a>
            </div>

            {/* Search Section */}
            <div className="flex flex-col gap-2">
                <input
                    ref={searchBarRef}
                    type="text"
                    placeholder="Search..."
                    className="bg-background border border-input text-foreground text-xs w-full h-8 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={handleKeyDown}
                />
                <div className="flex gap-2">
                    <select
                        ref={searchTypeDropdownRef}
                        className="bg-background border border-input text-foreground text-xs flex-1 h-8 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-ring"
                        value={selectedSearchType}
                        onChange={(e) => setSelectedSearchType(e.target.value)}
                    >
                        <option value="a">Ability</option>
                        <option value="i">Item</option>
                        <option value="l">Location</option>
                        <option value="m">Move</option>
                        <option value="n">NPC</option>
                        <option value="p">Pokémon</option>
                    </select>
                    <button onClick={search} className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium shadow hover:bg-primary/90 transition-colors">
                        Search
                    </button>
                </div>
            </div>

            {currentView && (
                <div className="p-2 bg-muted/50 border border-border rounded-lg flex flex-col gap-2 flex-1 overflow-y-auto">
                    <div className="flex justify-end">
                        <i
                            className="fas fa-times text-destructive cursor-pointer hover:text-destructive/80 text-sm"
                            onClick={() => {
                                setCurrentView(undefined);
                                setDataId(undefined);
                            }}
                            title="Close"
                        ></i>
                    </div>
                    {currentView === 'r' && searchResults.r && searchResults.r.length > 0 && (
                        <SearchResultsControl searchResults={searchResults} />
                    )}
                    {currentView === 'e' && <PetInfoComponent id={dataId} />}
                    {currentView === 'p' && <PokemonInfoComponent id={dataId} />}
                </div>
            )}
        </div>
    );
}
