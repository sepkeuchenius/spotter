import { MapIcon } from "lucide-react";

export function Logo() {
    return (
        <div className='p-3 absolute z-10 flex justify-left top-2 left-2 rounded-xl'>
            <h1 className='text-3xl font-bold text-slate-800 flex flex-row items-center gap-3'>
                <MapIcon /> Spotter
            </h1>
        </div>
    )
}