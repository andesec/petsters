'use client';

import { useState, useRef, useEffect } from 'react';
import SearchService from '@/services/SearchService';
import SearchResultsControl from '@/components/info/SearchResultsControl';
import PetInfoComponent from '@/components/info/PetInfoComponent';
import PokemonInfoComponent from '@/components/info/PokemonInfoComponent';
import eventBus from '@/eventBus';

export default function LeftSidebar({
    isFloating = false,
    toggleFloating
}: {
    isFloating?: boolean;
    toggleFloating?: () => void;
}) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [currentView, setCurrentView] = useState<string | undefined>(undefined);
    const [dataId, setDataId] = useState<any>(undefined);
    const [searchResults, setSearchResults] = useState<any>({});
    const [selectedSearchType, setSelectedSearchType] = useState('p');
    const searchBarRef = useRef<HTMLInputElement>(null);
    const searchTypeDropdownRef = useRef<HTMLSelectElement>(null);

    // Listen for show-info events
    useEffect(() => {
        const handleShowInfo = (data: { v: string; i: string }) => {
            if (!isSidebarVisible) {
                setIsSidebarVisible(true);
            }
            setDataId(data.i);
            setCurrentView(data.v);
        };

        eventBus.on('show-info', handleShowInfo);

        return () => {
            eventBus.off('show-info', handleShowInfo);
        };
    }, [isSidebarVisible]);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

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

    // Dynamic classes based on floating state
    const containerClasses = isFloating
        ? "fixed bottom-4 left-4 z-50 w-[380px] max-h-[calc(100vh-100px)] shadow-2xl"
        : "w-full h-full";

    return (
        <>
            <div className={`bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 overflow-y-auto transition-all duration-300 ease-in-out shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-foreground">Search</h3>
                    {toggleFloating && (
                        <button
                            onClick={toggleFloating}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title={isFloating ? "Dock sidebar" : "Float sidebar"}
                        >
                            <i className={`fas ${isFloating ? 'fa-thumbtack' : 'fa-thumbtack'} rotate-45 text-muted-foreground`}></i>
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-3 mb-4">
                    <input
                        ref={searchBarRef}
                        type="text"
                        placeholder="Search..."
                        className="bg-background border border-input text-foreground text-sm w-full h-9 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-ring"
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex gap-2">
                        <select
                            ref={searchTypeDropdownRef}
                            className="bg-background border border-input text-foreground text-sm flex-1 h-9 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-ring"
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
                        <button onClick={search} className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium shadow hover:bg-primary/90 transition-colors">
                            Search
                        </button>
                    </div>
                </div>

                {currentView && (
                    <div className="p-3 bg-muted/50 border border-border rounded-lg flex flex-col gap-3">
                        <div className="flex justify-end">
                            <i
                                className="fas fa-times text-destructive cursor-pointer hover:text-destructive/80"
                                onClick={() => {
                                    setCurrentView(undefined);
                                    setDataId(undefined);
                                    if (window.innerWidth < 768) {
                                        setIsSidebarVisible(false);
                                    }
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

            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed bottom-6 right-6 z-[1300] bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                onClick={toggleSidebar}
            >
                <i className={`fas ${isSidebarVisible ? 'fa-times' : 'fa-search'}`}></i>
            </button>

            {/* Mobile Backdrop */}
            {isSidebarVisible && (
                <div
                    className="fixed inset-0 bg-black/50 z-[900] md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarVisible(false)}
                ></div>
            )}
        </>
    );
}
