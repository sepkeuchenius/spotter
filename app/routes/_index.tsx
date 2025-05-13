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

export type SpotWithAuthorAndGroup = Spot & {
    author: User
    group: Group
}

export async function loader({request}: LoaderFunctionArgs){
    const prisma = new PrismaClient();
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
            <Logo />
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
    return <div className='absolute z-10 flex justify-center items-center shadow-xl' style={{ left: x, top: y }}>
        <addSpotFetcher.Form
            method='POST'
            action='/add-spot'
            className='bg-slate-100 rounded-l p-0 flex flex-col justify-between add-spot-dialog' style={{ width: '300px', height: '400px' }}>
            <input type='hidden' name='lng' value={lng} />
            <input type='hidden' name='lat' value={lat} />
            <div className='w-full border-1 border-slate-500 px-5 py-4 bg-green-200 shadow'>
                <h1 className='text-xl flex flex-row gap-2'><PlusCircleIcon />Add a spot</h1>
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
}

function AddSpotName({ currentDialogState, setCurrentDialogState, setAddingSpot }: { currentDialogState: string, setCurrentDialogState: any, setAddingSpot: any }) {
    return <div className='flex flex-col gap-5 justify-between p-5 h-full items-stretch' style={currentDialogState === 'add-name' ? undefined : { display: 'none' }}>
        <div className='flex flex-row justify-center items-center h-1/2'>
            <MapPinIcon size={30} />

        </div>
        <div className='flex flex-col gap-5 justify-between' style={currentDialogState === 'add-name' ? undefined : { display: 'none' }}>
            Add a name for your spot
            <SpotInput placeholder='Name' name='name' />
            <div className='flex flex-row justify-between'>
                <SidebarButton type='button' onClick={() => { setAddingSpot('idle') }}><XCircleIcon />Cancel</SidebarButton>
                <SidebarButton type='button' onClick={() => { setCurrentDialogState('add-description') }}><ArrowRightCircleIcon />Next</SidebarButton>
            </div>
        </div>
    </div>
}

function AddSpotDescription({ currentDialogState, setCurrentDialogState }: { currentDialogState: string, setCurrentDialogState: any }) {
    return <div className='flex flex-col gap-5 justify-between p-5 h-full items-stretch' style={currentDialogState === 'add-description' ? undefined : { display: 'none' }}>
        <div className='flex flex-row justify-center items-center h-1/2'>
            <LibraryIcon size={30} />

        </div>
        <div className='flex flex-col gap-5 justify-between'>
            Add a description for your spot
            <SpotInput placeholder='Description' name='description' />
            <div className='flex flex-row justify-between'>
                <SidebarButton type='button' onClick={() => { setCurrentDialogState('add-name') }}><ArrowLeftCircleIcon />Previous</SidebarButton>
                <SidebarButton type='button' onClick={() => { setCurrentDialogState('add-category') }}><ArrowRightCircleIcon />Next</SidebarButton>
            </div>
        </div>
    </div>
}

function AddSpotCategory({ currentDialogState, setCurrentDialogState }: { currentDialogState: string, setCurrentDialogState: any }) {
    return <div className='flex flex-col gap-5 justify-between p-5 h-full items-stretch' style={currentDialogState === 'add-category' ? undefined : { display: 'none' }}>
        <div className='flex flex-row justify-center items-center h-1/2'>
            <FolderIcon size={30} />

        </div>
        <div className='flex flex-col gap-5 justify-between'>
            Add a category for your spot
            <SpotInput placeholder='Category' />
            <div className='flex flex-row justify-between'>
                <SidebarButton type='button' onClick={() => { setCurrentDialogState('add-description') }}><ArrowLeftCircleIcon />Previous</SidebarButton>
                <SidebarButton type='button' onClick={() => { setCurrentDialogState('add-images') }}><ArrowRightCircleIcon />Next</SidebarButton>
            </div>
        </div>
    </div>
}

function AddSpotImages({ currentDialogState, setCurrentDialogState }: { currentDialogState: string, setCurrentDialogState: any }) {
    return <div className='flex flex-col gap-5 justify-between p-5 h-full items-stretch' style={currentDialogState === 'add-images' ? undefined : { display: 'none' }}>
        <div className='flex flex-row justify-center items-center h-1/2'>
            <ImageIcon size={30} />

        </div>
        <div className='flex flex-col gap-5 justify-between'>
            Add images for your spot
            <SpotInput placeholder='Images' />
            <div className='flex flex-row justify-between'>
                <SidebarButton type='button' onClick={() => { setCurrentDialogState('add-category') }}><ArrowLeftCircleIcon />Previous</SidebarButton>
                <SidebarButton type='submit' ><CheckCircleIcon />Add</SidebarButton>
            </div>
        </div>
    </div>
}

function SpotInput(props: any) {
    return <input type='text' {...props} className='px-3 py-1 rounded'></input>
}



function AddSpot({ addingSpot, setAddingSpot }: { addingSpot: string, setAddingSpot: any }) {
    return addingSpot!='idle' ? null : (<div className='absolute bottom-10 right-10 z-10'>
        <div className='bg-green-300 border-white border border-2 rounded-full p-5 flex flex-col items-center justify-center' onClick={() => { setAddingSpot('choosing') }}>
            <PlusIcon />
        </div>
    </div>
    )

}