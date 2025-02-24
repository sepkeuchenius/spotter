import { BookIcon, GroupIcon, LogInIcon, LogOutIcon, MapIcon } from "lucide-react";
import { Logo } from "./logo";
import { Form } from "@remix-run/react";

export function SideBar() {
    return (
        <div className=' h-full left-0 top-0 bg-slate-100 z-10 flex flex-col p-3 justify-between' style={{ width: 300 }}>
            <Logo />
            .
            <div className='mt-40 flex flex-col align-end items-bottom gap-2'>
                <SidebarButton><MapIcon />Map</SidebarButton>
                <SidebarButton><GroupIcon />Groups</SidebarButton>
                <SidebarButton><BookIcon /> Pages</SidebarButton>
                <SidebarButton><LogInIcon />Login</SidebarButton>
                <SidebarButton><Form method="post" action="/logout"><button type="submit" className="flex flex-row gap-2"><LogOutIcon />Logout</button></Form></SidebarButton>
            </div>

        </div>
    )
}

export function SidebarButton({ children, onClick, type }: { children: any, onClick?: any, type?: string }) {
    return <button onClick={onClick} type={type} className='p-2 border-slate-300 border rounded hover:bg-slate-400 cursor-pointer flex flex-row gap-2'>{children}</button>
}
