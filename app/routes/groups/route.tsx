import { Group } from "@prisma/client"
import { Form, useLoaderData, useNavigate } from "@remix-run/react"
import { SearchInput } from "~/components/search"
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { getUser } from "~/server/user"
import { Button } from "../create-group/route"
import { prisma } from "~/utils/db.server"
import { GroupIcon, PlusIcon, UsersIcon } from "lucide-react"

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const name = formData.get("name")
    const description = formData.get("description")
    const user = await getUser(request)
    if (!user) {
        return redirect("/login")
    }
    const group = await prisma.group.create({ data: { name: name as string, description: description as string, createdById: user.id, admins: { connect: { id: user.id } } } })
    return redirect(`/groups/${group.id}`)
}

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await getUser(request)
    if (!user) {
        return redirect("/login")
    }
    const query = new URL(request.url).searchParams
    const search = query.get("search")
    const groups = await prisma.group.findMany({ where: { name: { contains: search ?? "" } } })
    return { groups }
}

export default function Groups() {
    const { groups } = useLoaderData<typeof loader>()
    const navigate = useNavigate()

    return (
        <div className="h-screen flex flex-col w-full text-slate-800 dark:text-gray-100 bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 border-b border-slate-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-3">
                            <GroupIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Groups</h1>
                        </div>
                        <Button onClick={() => navigate("/create-group")}>
                            <PlusIcon className="w-4 h-4" />
                            Create Group
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Search Section */}
                    <div className="mb-8">
                        <Form method="get" action="." className="max-w-md">
                            <SearchInput name="search" placeholder="Search for a group..." />
                        </Form>
                    </div>

                    {/* Groups Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groups.map((group) => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </div>

                    {/* Empty State */}
                    {groups.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <GroupIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No groups found</h3>
                            <p className="text-gray-500 dark:text-gray-500 mb-6">Create your first group to get started</p>
                            <Button onClick={() => navigate("/create-group")}>
                                <PlusIcon className="w-4 h-4" />
                                Create Group
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function GroupCard({ group }: { group: Group }) {
    const navigate = useNavigate()
    
    return (
        <button 
            className="w-full text-left bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-600"
            onClick={() => navigate(`/group/${group.id}`)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/groups/${group.id}`)
                }
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <GroupIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{group.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created {new Date(group.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            
            <p className="text-slate-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {group.description || "No description provided"}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <UsersIcon className="w-4 h-4" />
                <span>0 members</span>
            </div>
        </button>
    )
}