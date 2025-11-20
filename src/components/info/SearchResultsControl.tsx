import UXService from "@/services/UXService";

interface SearchResultsControlProps {
    searchResults: {
        t: string;
        r: Array<{ i: string | number; n: string }>;
    };
}

export default function SearchResultsControl({ searchResults }: SearchResultsControlProps) {
    return (
        <div>
            <ul>
                {searchResults.r.map((sr, index) => (
                    <li key={index} className="list-none">
                        <p
                            className="cursor-pointer hover:text-[#3e3ee3] hover:underline"
                            onClick={() => UXService.showInfo(searchResults.t, sr.i)}
                        >
                            - {sr.n}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
