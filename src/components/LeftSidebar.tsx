'use client';

import { useState, useRef, useEffect } from 'react';
import SearchService from '@/services/SearchService';
import SearchResultsControl from '@/components/info/SearchResultsControl';
import PetInfoComponent from '@/components/info/PetInfoComponent';
import PokemonInfoComponent from '@/components/info/PokemonInfoComponent';
import eventBus from '@/eventBus';

export default function LeftSidebar() {
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

    return (
        <>
            <div className={`w-[20%] bg-white border border-slate-400 shadow-md rounded-[10px] p-[10px] overflow-y-auto h-full transition-transform duration-300 ease-in-out
        ${isSidebarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        fixed top-[57px] left-0 m-[0_8px] w-[90.6%] z-[1000] max-h-[90vh] md:static md:translate-y-0 md:opacity-100 md:w-[20%] md:max-h-full md:z-auto md:m-0
      `}>
                <h2 className="text-xl font-bold mb-2">Information Center</h2>
                <div className="flex flex-col gap-2 mb-2">
                    <input
                        ref={searchBarRef}
                        type="text"
                        placeholder="Search"
                        className="border border-slate-400 text-base w-full h-[30px] rounded-[10px] px-2"
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex justify-between gap-2">
                        <select
                            ref={searchTypeDropdownRef}
                            className="border border-slate-400 text-base w-full h-[40px] rounded-[10px]"
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
                        <button onClick={search} className="bg-[#3f51b5] text-white border-none px-5 py-2.5 rounded-[10px] cursor-pointer text-[15px] shadow-md hover:bg-[#303f9f]">
                            Search
                        </button>
                    </div>
                </div>

                {currentView && (
                    <div className="p-[10px] bg-[#eaecec] border border-[#cbcdcd] rounded-[10px] flex flex-col gap-[10px]">
                        <div className="flex justify-end">
                            <i
                                className="fas fa-times text-red-600 cursor-pointer"
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

            <button
                className="md:hidden fixed top-[50px] right-[15px] z-[1300] bg-slate-500 text-white border-none rounded-[55%] cursor-pointer px-2 py-1 shadow-md hover:bg-slate-700"
                onClick={toggleSidebar}
            >
                {isSidebarVisible ? '▲' : '▼'}
            </button>
        </>
    );
}
