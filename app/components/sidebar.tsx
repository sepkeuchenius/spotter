import { BookIcon, GroupIcon, LogInIcon, LogOutIcon, MapIcon, MenuIcon, XIcon } from "lucide-react";
import { Logo } from "./logo";
import { useNavigate, useLocation } from "@remix-run/react";
import { ReactNode, useState, Dispatch, SetStateAction } from "react";
import { User as PrismaUser } from "@prisma/client";

export function SideBar({ 
    isMobileOpen, 
    setIsMobileOpen,
    user
}: { 
    isMobileOpen: boolean
    setIsMobileOpen: Dispatch<SetStateAction<boolean>>
    user: PrismaUser | null
}) {
    const navigate = useNavigate()
    const location = useLocation()
    const [isCollapsed, setIsCollapsed] = useState(false)
    
    const navigationItems = [
        { path: '/', icon: <MapIcon size={20} />, label: 'Map', description: 'Explore spots' },
        { path: '/groups', icon: <GroupIcon size={20} />, label: 'Groups', description: 'Manage groups' },
        { path: '/pages', icon: <BookIcon size={20} />, label: 'Pages', description: 'Documentation' },
    ]
    
    const toggleSidebar = () => setIsCollapsed(!isCollapsed)
    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen)
    
    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <button 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileMenu}
                    aria-label="Close sidebar"
                    type="button"
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed lg:relative h-full left-0 top-0 bg-white dark:bg-gray-900 justify-between border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col shadow-lg transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-20' : 'w-72'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header with Logo and Toggle */}
                <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                    {!isCollapsed && <Logo />}
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={toggleSidebar}
                            className='hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors'
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <MenuIcon size={16} />
                        </button>
                        <button
                            onClick={toggleMobileMenu}
                            className='lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors'
                            aria-label="Close sidebar"
                        >
                            <XIcon size={16} />
                        </button>
                    </div>
                </div>
                
                {/* Navigation Section */}
                <div className='p-4  overflow-y-auto'>
                    <div className='mb-6'>
                        {!isCollapsed && (
                            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3'>
                                Navigation
                            </h3>
                        )}
                        <nav className='space-y-1'>
                            {navigationItems.map((item) => (
                                <SidebarButton 
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path)
                                        setIsMobileOpen(false)
                                    }}
                                    isActive={location.pathname === item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    description={item.description}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </nav>
                    </div>
                    
                    {/* Account Section */}
                    <div className='mb-6'>
                        {!isCollapsed && (
                            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3'>
                                Account
                            </h3>
                        )}
                        <nav className='space-y-1'>
                            {user ? (
                                <SidebarButton 
                                    key={'/logout'}
                                    onClick={() => {
                                        navigate('/logout')
                                        setIsMobileOpen(false)
                                    }}
                                    isActive={location.pathname === '/logout'}
                                    icon={<LogOutIcon size={20} />}
                                    label={'Logout'}
                                    description={'Sign out'}
                                    isCollapsed={isCollapsed}
                                />
                            ) : (
                                <SidebarButton 
                                    key={'/login'}
                                    onClick={() => {
                                        navigate('/login')
                                        setIsMobileOpen(false)
                                    }}
                                    isActive={location.pathname === '/login'}
                                    icon={<LogInIcon size={20} />}
                                    label={'Login'}
                                    description={'Sign in to your account'}
                                    isCollapsed={isCollapsed}
                                />
                            )}
                                
                            
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}

export function SidebarButton({ 
    children, 
    onClick, 
    type, 
    isActive = false,
    icon,
    label,
    description,
    isCollapsed = false
}: { 
    children?: ReactNode, 
    onClick?: () => void, 
    type?: "submit" | "reset" | "button",
    isActive?: boolean,
    icon?: ReactNode,
    label?: string,
    description?: string,
    isCollapsed?: boolean
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
                title={isCollapsed ? label : undefined}
            >
                <div className={`transition-colors duration-200 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                } ${isCollapsed ? '' : 'mr-3'}`}>
                    {icon}
                </div>
                {!isCollapsed && (
                    <div className='flex-1 text-left'>
                        <div className='font-medium'>{label}</div>
                        {description && (
                            <div className='text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'>
                                {description}
                            </div>
                        )}
                    </div>
                )}
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
