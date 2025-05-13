import { BookIcon, GroupIcon, LogInIcon, LogOutIcon, MapIcon } from "lucide-react";
import { Logo } from "./logo";
import { Form, useNavigate } from "@remix-run/react";

export function SideBar() {
    const navigate = useNavigate()
    return (
        <div className=' h-full left-0 top-0 bg-slate-100 z-10 flex flex-col p-3 justify-between' style={{ width: 300 }}>
            <Logo />
            .
            <div className='mt-40 flex flex-col align-end items-bottom gap-2'>
                <SidebarButton onClick={() => navigate('/')}><MapIcon />Map</SidebarButton>
                <SidebarButton onClick={() => navigate('/groups')}><GroupIcon />Groups</SidebarButton>
                <SidebarButton onClick={() => navigate('/pages')}><BookIcon /> Pages</SidebarButton>
                <SidebarButton onClick={() => navigate('/login')}><LogInIcon />Login</SidebarButton>
                <SidebarButton onClick={() => navigate('/logout')}><LogOutIcon />Logout</SidebarButton>
            </div>

        </div>
    )
}

export function SidebarButton({ children, onClick, type }: { children: any, onClick?: any, type?: string }) {
    return <button onClick={onClick} type={type} className='p-2 border-slate-300 border rounded hover:bg-slate-400 cursor-pointer flex flex-row gap-2'>{children}</button>
}
