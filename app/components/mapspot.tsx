import { useNavigate } from "@remix-run/react";
import { CircleDotIcon, ExternalLinkIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Marker, Popup } from 'react-map-gl/mapbox';
import { SpotWithAuthorAndGroup } from "~/routes/_index";

export function MapSpot({ spot }: { spot: SpotWithAuthorAndGroup }) {
    const popupRef = useRef<any>(null);
    const [showPopup, setShowPopup] = useState(false)

    return <div className='z-10'>
        <Popup longitude={spot.lng}
            ref={popupRef}
            style={{ borderRadius: '12px' }}
            latitude={spot.lat}
            className="bg-transparent"
            onClose={() => { console.log("test2") }}
        >
            {showPopup ? <SpotPopup spot={spot} /> : null}
        </Popup>
        <Marker
            longitude={spot.lng}
            popup={popupRef.current}
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
        <div className='bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg p-6 flex flex-col gap-4' style={{ width: '320px' }}>
            <div>
                <h1 className='text-xl font-bold text-slate-800 dark:text-white mb-3'>{spot.name}</h1>
                <div className="flex flex-row gap-2 mb-3">
                    <div className='flex items-center flex-row gap-2 text-sm text-slate-600 dark:text-gray-300'>
                        <span>Added by </span>
                        <span className='text-blue-600 dark:text-blue-400 font-medium'>{spot.author.name}</span>
                        <span>at</span>
                        <div className='text-blue-600 dark:text-blue-400'>
                            {new Date(spot.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <p className='text-slate-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed'>{spot.description}</p>
            </div>

            {spot.group && (
                <div className='flex items-center gap-2 text-sm'>
                    <div className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                        <span className='font-medium'>{spot.group.name}</span>
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate(`/spot/${spot.id}`)}
                className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
            >
                <ExternalLinkIcon size={16} />
                View Details
            </button>
        </div>
    );
}