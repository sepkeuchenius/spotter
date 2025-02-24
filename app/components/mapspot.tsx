import { useNavigate } from "@remix-run/react";
import { CircleDotIcon, ExternalLinkIcon } from "lucide-react";
import { useRef, useState } from "react";
import Map, { MapMouseEvent, Marker, Popup, useMap, MapEvent } from 'react-map-gl/mapbox';
import { Spot } from "~/interfaces/spot";

export function MapSpot({ spot }: { spot: Spot }) {
    const popupRef = useRef<any>();
    const [showPopup, setShowPopup] = useState(false)

    return <div className='z-10'>
        <Popup longitude={spot.location.lng}
            ref={popupRef}
            style={{ borderRadius: '10px' }}
            latitude={spot.location.lat}
            onClose={() => { console.log("test2") }}
        >
            {showPopup ? <SpotPopup spot={spot} /> : null}
        </Popup>
        <Marker
            longitude={spot.location.lng} popup={popupRef.current}
            latitude={spot.location.lat} onClick={(e) => { e.originalEvent.preventDefault(); console.log('test'); setShowPopup(true) }}
            color='green'
        >
            <CircleDotIcon className='animate-bounce' fill='green' stroke='white' size={30} />

        </Marker>

    </div>
}

function SpotPopup({spot}: {spot: Spot}) {
    const navigate = useNavigate();
    return <div className='bg-slate-800 rounded text-white flex flex-col p-4 justify-between' style={{ width: '300px', height: '400px' }}>
    <h1 className='text-xl font-bold '>{spot.title}</h1>
    <button className='bg-slate-400 p-2 rounded flex flex-row gap-2 items-center justify-center' onClick={()=>navigate(`/spot/${spot.id}`)}><ExternalLinkIcon></ExternalLinkIcon>View</button>
</div>
}