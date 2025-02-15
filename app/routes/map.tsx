import React, { useRef, useEffect, useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css';

import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import { BookOpenIcon, CheckCircleIcon, ClockIcon, FolderOpenIcon, GroupIcon, MapIcon, PlusCircleIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useFetcher } from '@remix-run/react';
import { loader } from './search';


export default function MapComponent() {
    const mapContainerRef = useRef()
    const mapRef = useRef()
    const markers = [
        { lng: 5.244122, lat: 52.086500 },
    ]
    const [visibleSpots, setVisibleSpots] = useState<Spot[]>([{
        title: "Food Truck", description: "This is an amazing food truck", location: {
            lng: 5.244122, lat: 52.086500
        }
    }]);

    return (
        <>
            {/* <div id='map-container' ref={mapContainerRef} /> */}
            <Search setVisibleSpots={setVisibleSpots} />
            <Logo />
            <SideBar />
            <AddSpot />
            <Map
                mapboxAccessToken="pk.eyJ1Ijoic2Vwa2V1Y2hlbml1cyIsImEiOiJjbTZ6aGk0NjQwNDFrMnNzODczazlsOXpqIn0.iOGt8AgxCQeelSz9XKWw5g"
                initialViewState={{
                    longitude: 5.244122,
                    latitude: 52.086500,
                    zoom: 14
                }}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                {visibleSpots.map((spot)=>{
                    <MapSpot spot={spot} />
                })}


            </Map>
        </>
    )
}

function MapSpot({spot}: {spot: Spot}) {
    const popupRef = useRef<any>();
    const [showPopup, setShowPopup] = useState(true)
    return <>

        <Popup longitude={spot.location.lng}
            ref={popupRef}
            style={{ borderRadius: '10px' }}
            latitude={spot.location.lat}
            onClose={() => { setShowPopup(false) }}
        >
            <div className='bg-slate-800 rounded text-white flex flex-col p-4' style={{ width: '300px', height: '400px' }}>
                <h1 className='text-xl font-bold '>Century old Oak</h1>
            </div>
        </Popup>

        <Marker
            longitude={spot.location.lng} popup={popupRef.current}
            latitude={spot.location.lat} onClick={() => { setShowPopup(true) }} />

    </>

}

function Search({setVisibleSpots}: {setVisibleSpots: any}) {
    const searchFetcher = useFetcher<typeof loader>();
    const [searchResults, setSearchResults] = useState<Spot[]>([]);
    const [showResults, setShowResults] = useState(false);
    React.useEffect(() => {
        searchFetcher.data && setSearchResults(searchFetcher.data) && setVisibleSpots(searchFetcher.data);
    }, [searchFetcher]);
    React.useEffect(()=>{
        setVisibleSpots(searchResults);
    }, [searchResults]);
    return (
        <div className='absolute z-10 w-full flex flex-col justify-center top-2 items-center' onMouseLeave={() => { setShowResults(false) }} onClick={() => { setShowResults(true) }}>
            <searchFetcher.Form onSubmit={() => { setShowResults(true) }} className='p-4 w-1/2 flex justify-center items-center relative' method='get' action='/search'>
                <input type='text' placeholder='Search for a spot...' className='w-full mx-auto p-4 text-xl rounded-xl border bg-slate-800 border-slate-300 rounded text-white' />
                <SearchIcon color='white' className='absolute right-10' />
            </searchFetcher.Form>
            <SearchResults results={searchResults} showResults={showResults} />
        </div>
    )
}


function SearchResults({ results, showResults }: { results: Spot[], showResults: boolean }) {
    return (
        results.length > 0 && showResults ?
            <>
                <Filters />
                <div className=' z-10 w-1/2 flex flex-col justify-center items-center bg-slate-400 rounded'>
                    {results.map((result) => <SearchResult {...result} />)}
                </div>
            </>
            : null

    )
}

function Filters() {
    return (
        <div className='flex flex-row w-1/2 justify-right gap-1 items-center p-4'>
            <button className='bg-slate-400 text-white p-2 rounded-xl flex flex-row gap-2'><BookOpenIcon />Open Now</button>
            <button className='bg-slate-400 text-white p-2 rounded-xl flex flex-row gap-2'><ClockIcon /> Recent</button>
            <button className='bg-slate-400 text-white p-2 rounded-xl flex flex-row gap-2'><CheckCircleIcon /> Confirmed</button>
        </div>
    )
}

function Logo() {
    return (
        <div className='p-3 absolute z-10 flex justify-left top-2 left-2 rounded-xl'>
            <h1 className='text-3xl font-bold text-slate-800 flex flex-row items-center gap-3'>
                <MapIcon /> Spotter
            </h1>
        </div>
    )
}

function SideBar() {
    return (
        <div className=' h-full absolute left-0 top-0 bg-slate-100 z-10 flex flex-col p-3 justify-between' style={{ width: 300 }}>
            <Logo />
            .
            <div className='mt-40 flex flex-col align-end items-bottom gap-2'>
                <SidebarButton><MapIcon />Map</SidebarButton>
                <SidebarButton><GroupIcon />Groups</SidebarButton>
                <SidebarButton>Pages</SidebarButton>
                <SidebarButton>Login</SidebarButton>

            </div>

        </div>
    )
}

function AddSpot() {
    return <div className='absolute bottom-10 right-10 z-10'>
        <div className='bg-slate-200 rounded-full p-5 flex flex-col items-center justify-center'>
            <PlusIcon />
        </div>

    </div>
}

function SidebarButton({ children }: { children: any }) {
    return <div className='p-2 border-slate-300 border rounded hover:bg-slate-400 cursor-pointer flex flex-row gap-2'>{children}</div>
}

export interface Spot {
    title: string,
    description: string,
    location: {
        lat: number,
        lng: number
    }
}

function SearchResult(result: Spot) {
    return (
        <>
        <div className='bg-slate-400 hover:bg-slate-600 text-white flex flex-row p-4 w-full cursor-pointer justify-between items-center rounded'>
            <div className='flex flex-col justify-between'>
                <h1 className='text-xl font-bold '>{result.title}</h1>
                <p>{result.description}</p>
            </div>
            <FolderOpenIcon />
        </div>
        </>
    )

}