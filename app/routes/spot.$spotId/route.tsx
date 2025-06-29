import { PrismaClient } from "@prisma/client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Map, { Marker } from 'react-map-gl/mapbox';
import { CircleDot, Dot, Navigation, UserIcon } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Accent } from "~/components/accent";
import { prisma } from "~/utils/db.server";


export async function loader(params: LoaderFunctionArgs) {
    const spotId = params.params.spotId;
    if (!spotId) {
        return Response.json({ error: "Spot ID is required" }, { status: 400 });
    }
    const spot = await prisma.spot.findUnique({
        where: {
            id: parseInt(spotId)
        },
        include: {
            author: true
        }
    });
    return { spot }
}

export default function User() {
    const { spot } = useLoaderData<typeof loader>();
    
    if (!spot) {
        return (
            <div className='p-10 bg-white dark:bg-gray-900 min-h-screen'>
                <h1 className='text-2xl font-bold text-red-600 dark:text-red-400'>Spot not found</h1>
            </div>
        );
    }
    
    return (
        <div className='h-screen flex flex-col w-full text-slate-800 dark:text-gray-100 bg-white dark:bg-gray-900'>
            {/* Title bar at the top */}
            <div className='bg-white dark:bg-gray-800 p-4 border-b border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-100'>
            <div className='flex flex-row justify-between items-center'>
                <div className='max-w-4xl'>
                    <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>{spot.name}</h1>
                    <p className='text-slate-600 dark:text-gray-300'>Added by <Accent>{spot.author.name}</Accent> at <Accent>{spot.createdAt.toLocaleString()}</Accent></p>
                </div>
                <div className='rounded-lg bg-slate-200 dark:bg-gray-700 p-4 cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors'>
                <Navigation className='text-slate-800 dark:text-gray-100' />
                </div>
                </div>
            </div>

            {/* Map container with padding */}
            <div className='flex-grow flex  flex-col items-center bg-gray-50 dark:bg-gray-900 gap-4'>
                <div className='w-full h-[400px]'>
                    <Map
                        mapboxAccessToken="pk.eyJ1Ijoic2Vwa2V1Y2hlbml1cyIsImEiOiJjbTZ6aGk0NjQwNDFrMnNzODczazlsOXpqIn0.iOGt8AgxCQeelSz9XKWw5g"
                        initialViewState={{
                            longitude: spot.lng,
                            latitude: spot.lat,
                            zoom: 15
                        }}
                        style={{ width: "100%", height: "100%" }}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                    >
                        <Marker 
                            longitude={spot.lng} 
                            latitude={spot.lat}
                        >
                            <div className=''>
                                <CircleDot className='text-green-800 dark:text-green-400 w-8 h-8 animate-ping absolute top-0 left-0' />
                                <Dot className='text-green-800 dark:text-green-400 w-8 h-8 absolute top-0 left-0' />
                            </div>
                        </Marker>
                    </Map>
                </div>
                <div key={'description'} className='w-full md:w-4/5 p-4 flex flex-row gap-4 items-center border rounded-lg border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800'>
                    {spot.author.avatarUrl ? <img src={spot.author.avatarUrl} alt={spot.name} className='w-12 h-12 rounded-full' /> : 
                    <div className='rounded-full bg-slate-200 dark:bg-gray-700 p-2 w-12 h-12 flex items-center justify-center'>
                        <UserIcon className='w-6 h-6 text-slate-800 dark:text-gray-300' />
                    </div>}
                    <div className='flex flex-col gap-2 '>
                        <p className='text-slate-800 dark:text-white font-bold'>{spot.author.name}</p>
                        <p className='text-slate-800 dark:text-gray-300'>{spot.description}</p>
                    </div>
                </div>
                <div key={'comments'} className='w-full md:w-4/5 p-4 flex flex-col justify-between gap-4 border rounded-lg min-h-[500px] bg-white dark:bg-gray-800 border-slate-300 dark:border-gray-600'>
                    <p className='text-slate-800 dark:text-white font-bold'>Comments</p>
                    <div className='flex flex-col gap-2 rounded-lg relative' >
                        <textarea className='w-full h-24 border bg-white dark:bg-gray-700 rounded-lg border-slate-300 dark:border-gray-600 p-2 text-slate-800 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' placeholder='Add a comment' />
                        <button className='px-4 py-2 text-slate-800 dark:text-gray-100 rounded-lg absolute bottom-3 right-3 bg-slate-200 dark:bg-gray-600 hover:bg-slate-300 dark:hover:bg-gray-500 transition-colors'>Add</button>
                    </div>
                </div>
            </div>

            {/* Info panel at the bottom */}
            <div className='bg-white dark:bg-gray-800 p-4 border-t border-slate-200 dark:border-gray-700'>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex gap-4 text-sm text-gray-600 dark:text-gray-400'>
                        <div>
                            <span className='font-semibold text-gray-700 dark:text-gray-300'>Latitude:</span> {spot.lat}
                        </div>
                        <div>
                            <span className='font-semibold text-gray-700 dark:text-gray-300'>Longitude:</span> {spot.lng}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}