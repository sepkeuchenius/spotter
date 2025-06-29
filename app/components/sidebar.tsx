import { BookIcon, GroupIcon, LogInIcon, LogOutIcon, MapIcon, HomeIcon } from "lucide-react";
import { Logo } from "./logo";
import { useNavigate, useLocation } from "@remix-run/react";
import { ReactNode } from "react";

export function SideBar() {
    const navigate = useNavigate()
    const location = useLocation()
    
    const navigationItems = [
        { path: '/', icon: <MapIcon size={20} />, label: 'Map', description: 'Explore spots' },
        { path: '/groups', icon: <GroupIcon size={20} />, label: 'Groups', description: 'Manage groups' },
        { path: '/pages', icon: <BookIcon size={20} />, label: 'Pages', description: 'Documentation' },
    ]
    
    const accountItems = [
        { path: '/login', icon: <LogInIcon size={20} />, label: 'Login', description: 'Sign in to your account' },
        { path: '/logout', icon: <LogOutIcon size={20} />, label: 'Logout', description: 'Sign out' },
    ]
    
    return (
        <div className='h-full left-0 top-0 bg-white dark:bg-gray-900 justify-between border-r border-gray-200 dark:border-gray-700 z-10 flex flex-col shadow-lg' style={{ width: 280 }}>
            {/* Header with Logo */}
            <div className='p-6 border-b border-gray-200 dark:border-gray-700 '>
                <Logo />
            </div>
            
            {/* Navigation Section */}
            <div className=' p-4'>
                <div className='mb-6'>
                    <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3'>
                        Navigation
                    </h3>
                    <nav className='space-y-1'>
                        {navigationItems.map((item) => (
                            <SidebarButton 
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                isActive={location.pathname === item.path}
                                icon={item.icon}
                                label={item.label}
                                description={item.description}
                            />
                        ))}
                    </nav>
                </div>
                
                {/* Account Section */}
                <div className='mb-6'>
                    <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3'>
                        Account
                    </h3>
                    <nav className='space-y-1'>
                        {accountItems.map((item) => (
                            <SidebarButton 
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                isActive={location.pathname === item.path}
                                icon={item.icon}
                                label={item.label}
                                description={item.description}
                            />
                        ))}
                    </nav>
                </div>
            </div>
            
        </div>
    )
}

export function SidebarButton({ 
    children, 
    onClick, 
    type, 
    isActive = false,
    icon,
    label,
    description 
}: { 
    children?: ReactNode, 
    onClick?: () => void, 
    type?: "submit" | "reset" | "button",
    isActive?: boolean,
    icon?: ReactNode,
    label?: string,
    description?: string
}) {
    if (icon && label) {
        return (
            <button 
                onClick={onClick} 
                type={type}
                className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
                <div className={`mr-3 transition-colors duration-200 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`}>
                    {icon}
                </div>
                <div className='flex-1 text-left'>
                    <div className='font-medium'>{label}</div>
                    {description && (
                        <div className='text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'>
                            {description}
                        </div>
                    )}
                </div>
            </button>
        )
    }
    
    // Fallback for legacy usage
    return (
        <button 
            onClick={onClick} 
            type={type} 
            className='w-full p-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 cursor-pointer flex flex-row items-center gap-3'
        >
            {children}
        </button>
    )
}
