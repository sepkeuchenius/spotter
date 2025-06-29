import { MapIcon } from "lucide-react";

export function Logo() {
    return (
        <div className='flex items-center gap-3'>
            <MapIcon size={24} className="text-blue-600 dark:text-blue-400" />
            <h1 className='text-xl font-bold text-slate-800 dark:text-slate-200'>
                Spotter
            </h1>
        </div>
    )
}