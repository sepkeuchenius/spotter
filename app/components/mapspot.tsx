import { Spot, User, Group } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { CircleDotIcon, ExternalLinkIcon } from "lucide-react";
import { useRef, useState } from "react";
import Map, { MapMouseEvent, Marker, Popup, useMap, MapEvent } from 'react-map-gl/mapbox';
import { SpotWithAuthorAndGroup } from "~/routes/_index";

export function MapSpot({ spot }: { spot: SpotWithAuthorAndGroup }) {
    const popupRef = useRef<any>();
    const [showPopup, setShowPopup] = useState(false)

    return <div className='z-10'>
        <Popup longitude={spot.lng}
            ref={popupRef}
            style={{ borderRadius: '10px' }}
            latitude={spot.lat}
            className="bg-transparent"
            onClose={() => { console.log("test2") }}
        >
            {showPopup ? <SpotPopup spot={spot} /> : null}
        </Popup>
        <Marker
            longitude={spot.lng} popup={popupRef.current}
            latitude={spot.lat} onClick={(e) => { e.originalEvent.preventDefault(); console.log('test'); setShowPopup(true) }}
            color='green'
        >
            <CircleDotIcon className='animate-bounce' fill='green' stroke='white' size={30} />

        </Marker>

    </div>
}

function SpotPopup({ spot }: { spot: SpotWithAuthorAndGroup }) {
    const navigate = useNavigate();

    return (
        <div className='bg-slate-400 border-1 text-whtie border-slate-500 rounded-lg shadow-lg p-4 flex flex-col gap-4' style={{ width: '300px' }}>
            <div>
                <h1 className='text-xl font-bold text-gray-50 mb-2'>{spot.name}</h1>
                <div className="flex flex-row gap-2">
                    <div className='flex items-center flex-row gap-2'>
                        <span>Added by </span>
                        <span className='text-indigo-600 font-medium'>{spot.author.name}</span>
                        at
                        <div className='text-indigo-600'>
                            {new Date(spot.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <p className='text-gray-50 text-sm line-clamp-3'>{spot.description}</p>
            </div>

            <div className='flex flex-col gap-2 text-sm text-gray-50'>
                {spot.group && (
                    <div className='flex items-center gap-2 text-indigo-600'>
                        <span className='font-medium'>{spot.group.name}</span>
                    </div>
                )}

            </div>

            <button
                onClick={() => navigate(`/spot/${spot.id}`)}
                className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2'
            >
                <ExternalLinkIcon size={16} />
                View Details
            </button>
        </div>
    );
}