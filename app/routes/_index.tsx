import React, { useRef, useEffect, useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css';

import Map, { MapMouseEvent, Marker, Popup, useMap, MapEvent } from 'react-map-gl/mapbox';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, BookIcon, BookOpenIcon, CheckCircleIcon, CircleDotIcon, ClockIcon, FolderIcon, FolderOpenIcon, GroupIcon, ImageIcon, LibraryIcon, LocateFixedIcon, LogInIcon, MapIcon, MapPinIcon, PinIcon, PlusCircleIcon, PlusIcon, SearchIcon, XCircleIcon } from 'lucide-react';
import { useFetcher, useLoaderData, redirect } from '@remix-run/react';
import { loader as searchLoader } from './search';
import { PrismaClient, Spot, User, Group } from '@prisma/client';
import { Logo } from '~/components/logo';
import { SidebarButton } from '~/components/sidebar';
import { MapSpot } from '~/components/mapspot';
import { Spinner } from '~/components/spinner';
import { getUser } from '~/server/user';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Search } from '~/components/search';
import { prisma } from '~/utils/db.server';

export type SpotWithAuthorAndGroup = Spot & {
    author: User
    group: Group
}

export async function loader({request}: LoaderFunctionArgs){
    const dbSpots = await prisma.spot.findMany({
        take: 20,
        include: {
            author: true,
            group: true
        }
    });
    const user = await getUser(request)
    if(!user) {
        return redirect('/login')
    }
    return {spots: dbSpots, user}
}


export default function MapComponent() {
    const {spots} = useLoaderData<typeof loader>();
    const mapContainerRef = useRef()
    const mapRef = useRef()
    const markers = [
        { lng: 5.244122, lat: 52.086500 },
    ]
    const spot = {
        title: "Food Truck", description: "This is an amazing food truck", location: {
            lng: 5.244122, lat: 52.086500
        }
    }

    const [showAddSpotDialogue, setShowAddSpotDialogue] = useState(false);
    const [spotCoordinates, setSpotCoordinates] = useState({ lng: 0, lat: 0 });
    const [spotDialogCoordinates, setSpotDialogCoordinates] = useState({ x: 0, y: 0 });

    const [addingSpot, setAddingSpot] = useState('idle');

    const addSpot = (e: MapMouseEvent) => {
        // TODO: check if spot has been added
        if (addingSpot == 'choosing' || addingSpot == 'adding') {
            console.log(e)
            setSpotCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });
            setSpotDialogCoordinates({ x: e.point.x, y: e.point.y });
            setShowAddSpotDialogue(true);
            setAddingSpot('adding')
        }
    }


    const [currentSpots, setCurrentSpots] = useState(spots);
    return (
        <>
            <Search 
                onResultsChange={setCurrentSpots} 
                className="absolute z-10 top-2" 
            />
            <AddSpot addingSpot={addingSpot} setAddingSpot={setAddingSpot} />
            {showAddSpotDialogue && addingSpot=='adding' ?
                <AddSpotDialogue lat={spotCoordinates.lat} lng={spotCoordinates.lng} x={spotDialogCoordinates.x} y={spotDialogCoordinates.y} setAddingSpot={setAddingSpot} /> : null
            }
            <Map
                mapboxAccessToken="pk.eyJ1Ijoic2Vwa2V1Y2hlbml1cyIsImEiOiJjbTZ6aGk0NjQwNDFrMnNzODczazlsOXpqIn0.iOGt8AgxCQeelSz9XKWw5g"
                initialViewState={{
                    longitude: 5.244122,
                    latitude: 52.086500,
                    zoom: 14
                }}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onClick={addSpot}
            >
                {currentSpots.map((spot) => { return <MapSpot spot={spot}></MapSpot> })}
                {addingSpot == 'adding' ? <Marker longitude={spotCoordinates.lng} latitude={spotCoordinates.lat} onClick={()=>{console.log('test')}}>
                    <CircleDotIcon color='indigo' className='animate-ping'/>
                </Marker> : null}


            </Map>
        </>
    )
}

function AddSpotDialogue({ lng, lat, x, y, setAddingSpot }: { lng: number, lat: number, x: number, y: number, setAddingSpot:any }) {
    const dialogStates = ['add-name', 'add-description', 'add-category', 'add-images'];
    const [currentDialogState, setCurrentDialogState] = useState(dialogStates[0]);
    const [spotName, setSpotName] = useState('');
    const addSpotFetcher = useFetcher<typeof loader>();
    return (
        <div className='absolute z-10 flex justify-center items-center' style={{ left: x, top: y }}>
            <addSpotFetcher.Form
                method='POST'
                action='/add-spot'
                className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between overflow-hidden' 
                style={{ width: '320px', height: '420px' }}
            >
                <input type='hidden' name='lng' value={lng} />
                <input type='hidden' name='lat' value={lat} />
                <div className='w-full px-6 py-4 bg-blue-600 dark:bg-blue-500 shadow-sm'>
                    <h1 className='text-xl font-semibold text-white flex flex-row gap-2 items-center'>
                        <PlusCircleIcon className="w-5 h-5" />
                        Add a spot
                    </h1>
                </div>
                {addSpotFetcher.state == 'idle' ?
                    <>
                        <AddSpotName currentDialogState={currentDialogState} setCurrentDialogState={setCurrentDialogState} setAddingSpot={setAddingSpot}/>
                        <AddSpotDescription currentDialogState={currentDialogState} setCurrentDialogState={setCurrentDialogState} />
                        <AddSpotCategory currentDialogState={currentDialogState} setCurrentDialogState={setCurrentDialogState} />
                        <AddSpotImages currentDialogState={currentDialogState} setCurrentDialogState={setCurrentDialogState} />
                    </>
                    : <div className='flex flex-row h-full w-full justify-center items-center'><Spinner /></div>
                }
            </addSpotFetcher.Form>
        </div>
    )
}

function AddSpotName({ currentDialogState, setCurrentDialogState, setAddingSpot }: { currentDialogState: string, setCurrentDialogState: any, setAddingSpot: any }) {
    return (
        <div className='flex flex-col gap-6 justify-between p-6 h-full items-stretch' style={currentDialogState === 'add-name' ? undefined : { display: 'none' }}>
            <div className='flex flex-col gap-4 items-center justify-center flex-1'>
                <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                    <MapPinIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white text-center'>
                    Add a name for your spot
                </h2>
            </div>
            <div className='flex flex-col gap-4'>
                <SpotInput placeholder='Name' name='name' />
                <div className='flex flex-row justify-between gap-3'>
                    <button 
                        type='button' 
                        onClick={() => { setAddingSpot('idle') }}
                        className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <XCircleIcon className="w-4 h-4 inline mr-2" />
                        Cancel
                    </button>
                    <button 
                        type='button' 
                        onClick={() => { setCurrentDialogState('add-description') }}
                        className='flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <ArrowRightCircleIcon className="w-4 h-4 inline mr-2" />
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

function AddSpotDescription({ currentDialogState, setCurrentDialogState }: { currentDialogState: string, setCurrentDialogState: any }) {
    return (
        <div className='flex flex-col gap-6 justify-between p-6 h-full items-stretch' style={currentDialogState === 'add-description' ? undefined : { display: 'none' }}>
            <div className='flex flex-col gap-4 items-center justify-center flex-1'>
                <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                    <LibraryIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white text-center'>
                    Add a description for your spot
                </h2>
            </div>
            <div className='flex flex-col gap-4'>
                <SpotInput placeholder='Description' name='description' />
                <div className='flex flex-row justify-between gap-3'>
                    <button 
                        type='button' 
                        onClick={() => { setCurrentDialogState('add-name') }}
                        className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <ArrowLeftCircleIcon className="w-4 h-4 inline mr-2" />
                        Previous
                    </button>
                    <button 
                        type='button' 
                        onClick={() => { setCurrentDialogState('add-category') }}
                        className='flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <ArrowRightCircleIcon className="w-4 h-4 inline mr-2" />
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

function AddSpotCategory({ currentDialogState, setCurrentDialogState }: { currentDialogState: string, setCurrentDialogState: any }) {
    return (
        <div className='flex flex-col gap-6 justify-between p-6 h-full items-stretch' style={currentDialogState === 'add-category' ? undefined : { display: 'none' }}>
            <div className='flex flex-col gap-4 items-center justify-center flex-1'>
                <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                    <FolderIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white text-center'>
                    Add a category for your spot
                </h2>
            </div>
            <div className='flex flex-col gap-4'>
                <SpotInput placeholder='Category' />
                <div className='flex flex-row justify-between gap-3'>
                    <button 
                        type='button' 
                        onClick={() => { setCurrentDialogState('add-description') }}
                        className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <ArrowLeftCircleIcon className="w-4 h-4 inline mr-2" />
                        Previous
                    </button>
                    <button 
                        type='button' 
                        onClick={() => { setCurrentDialogState('add-images') }}
                        className='flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <ArrowRightCircleIcon className="w-4 h-4 inline mr-2" />
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

function AddSpotImages({ currentDialogState, setCurrentDialogState }: { currentDialogState: string, setCurrentDialogState: any }) {
    return (
        <div className='flex flex-col gap-6 justify-between p-6 h-full items-stretch' style={currentDialogState === 'add-images' ? undefined : { display: 'none' }}>
            <div className='flex flex-col gap-4 items-center justify-center flex-1'>
                <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                    <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white text-center'>
                    Add images for your spot
                </h2>
            </div>
            <div className='flex flex-col gap-4'>
                <SpotInput placeholder='Images' />
                <div className='flex flex-row justify-between gap-3'>
                    <button 
                        type='button' 
                        onClick={() => { setCurrentDialogState('add-category') }}
                        className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <ArrowLeftCircleIcon className="w-4 h-4 inline mr-2" />
                        Previous
                    </button>
                    <button 
                        type='submit'
                        className='flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    >
                        <CheckCircleIcon className="w-4 h-4 inline mr-2" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

function SpotInput(props: any) {
    return (
        <input 
            type='text' 
            {...props} 
            className='w-full px-4 py-3 text-base rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-600 transition-all duration-200' 
        />
    )
}



function AddSpot({ addingSpot, setAddingSpot }: { addingSpot: string, setAddingSpot: any }) {
    return addingSpot!='idle' ? null : (
        <div className='absolute bottom-10 right-10 z-10'>
            <button 
                className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900' 
                onClick={() => { setAddingSpot('choosing') }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setAddingSpot('choosing')
                    }
                }}
                aria-label="Add a new spot"
            >
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
    )
}