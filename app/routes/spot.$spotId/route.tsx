import { PrismaClient } from "@prisma/client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Map, { Marker } from 'react-map-gl/mapbox';
import { MapPinIcon } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

export async function loader(params: LoaderFunctionArgs) {
    const spotId = params.params.spotId;
    if (!spotId) {
        return json({ error: "Spot ID is required" }, { status: 400 });
    }
    const prisma = new PrismaClient();
    const spot = await prisma.spot.findUnique({
        where: {
            id: parseInt(spotId)
        }
    });
    return { spot: spot }
}

export default function User() {
    const { spot } = useLoaderData<typeof loader>();
    
    if (!spot) {
        return (
            <div className='p-10'>
                <h1 className='text-2xl font-bold text-red-600'>Spot not found</h1>
            </div>
        );
    }
    
    return (
        <div className='h-screen flex flex-col w-full'>
            {/* Title bar at the top */}
            <div className='bg-white p-4 border-b'>
                <div className='max-w-4xl'>
                    <h1 className='text-2xl font-bold'>{spot.name}</h1>
                    <p>Added by {spot.author} at {spot.createdAt.toLocaleString()}</p>
                </div>
            </div>

            {/* Map container with padding */}
            <div className='flex-grow flex items-center justify-center bg-gray-50 p-8'>
                <div className='w-full max-w-4xl h-[400px]'>
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
                            <div className='text-indigo-600'>
                                <MapPinIcon />
                            </div>
                        </Marker>
                    </Map>
                </div>
            </div>

            {/* Info panel at the bottom */}
            <div className='bg-white p-4 border-t'>
                <div className='max-w-4xl mx-auto'>
                    <p className='text-gray-600 mb-3'>{spot.description}</p>
                    <div className='flex gap-4 text-sm text-gray-600'>
                        <div>
                            <span className='font-semibold'>Latitude:</span> {spot.lat}
                        </div>
                        <div>
                            <span className='font-semibold'>Longitude:</span> {spot.lng}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}