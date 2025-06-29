import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { getUser } from "~/server/user"
import { prisma } from "~/utils/db.server"
import { ArrowLeftIcon, GroupIcon, MapPinIcon, UsersIcon, CrownIcon, CalendarIcon, UserIcon } from "lucide-react"

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await getUser(request)
    if (!user) {
        return redirect("/login")
    }

    const groupId = params.groupId
    if (!groupId) {
        return redirect("/groups")
    }

    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            admins: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            members: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            spots: {
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })

    if (!group) {
        return redirect("/groups")
    }

    return { group, currentUser: user }
}

export default function GroupDetail() {
    const { group, currentUser } = useLoaderData<typeof loader>()
    const navigate = useNavigate()

    const isAdmin = group.admins.some(admin => admin.id === currentUser.id)

    return (
        <div className="h-screen flex flex-col w-full text-slate-800 dark:text-gray-100 bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 border-b border-slate-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-row items-center gap-4">
                        <button
                            onClick={() => navigate("/groups")}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                        </button>
                        <div className="flex flex-row items-center gap-3">
                            <GroupIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{group.name}</h1>
                            {isAdmin && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                                    <CrownIcon className="w-3 h-3" />
                                    Admin
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Group Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Group Description */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">About</h2>
                                <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                                    {group.description || "No description provided"}
                                </p>
                                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Spots Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Spots</h2>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{group.spots.length} spots</span>
                                </div>
                                
                                {group.spots.length > 0 ? (
                                    <div className="space-y-4">
                                        {group.spots.map((spot) => (
                                            <div key={spot.id} className="flex items-center gap-4 p-4 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <MapPinIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-medium text-slate-800 dark:text-white">{spot.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Added by {spot.author.name || 'Unknown'} • {new Date(spot.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <MapPinIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">No spots added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Group Stats */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Group Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Members</span>
                                        <span className="font-medium text-slate-800 dark:text-white">{group.members.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Admins</span>
                                        <span className="font-medium text-slate-800 dark:text-white">{group.admins.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Spots</span>
                                        <span className="font-medium text-slate-800 dark:text-white">{group.spots.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Created By */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Created By</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white">
                                            {group.createdBy.name || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {group.createdBy.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Admins */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CrownIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Admins</h3>
                                </div>
                                <div className="space-y-3">
                                    {group.admins.map((admin) => (
                                        <div key={admin.id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                                <UserIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-white text-sm">
                                                    {admin.name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {admin.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Members */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Members</h3>
                                </div>
                                <div className="space-y-3">
                                    {group.members.length > 0 ? (
                                        group.members.map((member) => (
                                            <div key={member.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800 dark:text-white text-sm">
                                                        {member.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No members yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}