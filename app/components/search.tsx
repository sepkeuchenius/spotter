import React, { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { SearchIcon, BookOpenIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';
import type { Spot } from '~/interfaces/spot';

interface SearchProps {
    onResultsChange?: (results: Spot[]) => void;
    showFilters?: boolean;
    className?: string;
    placeholder?: string;
}

export function Search({ onResultsChange, showFilters = true, className = '', placeholder = 'Search for a spot...' }: SearchProps) {
    const searchFetcher = useFetcher();
    const [searchResults, setSearchResults] = useState<Spot[]>([]);
    const [showResults, setShowResults] = useState(false);

    React.useEffect(() => {
        if (searchFetcher.data && searchFetcher.data.length > 0) {
            setSearchResults(searchFetcher.data);
            onResultsChange?.(searchFetcher.data);
        }
    }, [searchFetcher, onResultsChange]);

    return (
        <div 
            className={`w-full flex flex-col justify-center items-center ${className}`} 
            onMouseLeave={() => setShowResults(false)} 
            onClick={() => setShowResults(true)}
        >
            <searchFetcher.Form 
                onSubmit={() => setShowResults(true)} 
                className='p-4 w-full max-w-2xl flex justify-center items-center relative' 
                method='get' 
                action='/search'
            >
                <SearchInput name="search" placeholder={placeholder} />
                <SearchIcon color='white' className='absolute right-10' />
            </searchFetcher.Form>

            {searchResults.length > 0 && showResults && (
                <>
                    {showFilters && <Filters />}
                    <div className='w-full max-w-2xl flex flex-col justify-center items-center bg-slate-400 rounded'>
                        {searchResults.map((result) => (
                            <SearchResult key={result.id} {...result} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function Filters() {
    return (
        <div className='flex flex-row w-full max-w-2xl justify-end gap-1 items-center p-4'>
            <button className='bg-slate-400 text-white p-2 rounded-xl flex flex-row gap-2'>
                <BookOpenIcon />Open Now
            </button>
            <button className='bg-slate-400 text-white p-2 rounded-xl flex flex-row gap-2'>
                <ClockIcon /> Recent
            </button>
            <button className='bg-slate-400 text-white p-2 rounded-xl flex flex-row gap-2'>
                <CheckCircleIcon /> Confirmed
            </button>
        </div>
    );
}

function SearchResult(result: Spot) {
    return (
        <div className='bg-slate-400 hover:bg-slate-600 text-white flex flex-row p-4 w-full cursor-pointer justify-between items-center rounded'>
            <div className='flex flex-col justify-between'>
                <h1 className='text-xl font-bold'>{result.title}</h1>
                <p>{result.description}</p>
            </div>
            <SearchIcon />
        </div>
    );
} 

export function SearchInput({ name, placeholder }: { name: string, placeholder: string }) {
    return (
        <input type='text' name={name} placeholder={placeholder} 
        className='w-full mx-auto p-3 text-xl rounded border bg-slate-800 border-slate-300 text-white dark:bg-slate-200 dark:border-slate-400 dark:text-slate-700' />
    )
}