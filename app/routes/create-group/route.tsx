import { FetcherWithComponents, useFetcher } from "@remix-run/react"
import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { getUser } from "~/server/user"
import { ComponentIcon, ArrowLeftIcon } from "lucide-react"
import { Spinner } from "~/components/spinner"
import { prisma } from "~/utils/db.server"
import { useNavigate } from "@remix-run/react"

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const name = formData.get("name")
    const description = formData.get("description")
    const user = await getUser(request)
    if (!user) {
        return redirect("/login")
    }
    const group = await prisma.group.create({ data: { name: name as string, description: description as string, createdById: user.id, admins: { connect: { id: user.id } } } })
    return redirect(`/group/${group.id}`)
}

function Input({ name, label, required = false }: { name: string, label: string, required?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-slate-700 dark:text-gray-300">
                {label}
            </label>
            <input 
                type="text" 
                name={name} 
                id={name}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200" 
                required={required} 
            />
        </div>
    )
}

function BigInput({ name, label, required = false }: { name: string, label: string, required?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-slate-700 dark:text-gray-300">
                {label}
            </label>
            <textarea 
                name={name} 
                id={name}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 resize-vertical" 
                required={required} 
            />
        </div>
    )
}

export function Button({ children, fetcher, onClick }: { children: React.ReactNode, fetcher?: FetcherWithComponents<typeof action>, onClick?: () => void }) {
    return (
        <button 
            type="submit" 
            className="group flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={onClick}
            disabled={fetcher?.state === "submitting"}
        >
            {fetcher?.state === "submitting" ? (
                <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Creating...</span>
                </div>
            ) : (
                children
            )}
        </button>
    )
}

export default function GroupsCreate() {
    const createGroupFetcher = useFetcher<typeof action>()
    const navigate = useNavigate()

    return (
        <div className="h-screen flex flex-col w-full text-slate-800 dark:text-gray-100 bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 border-b border-slate-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-row items-center gap-4">
                        <button
                            onClick={() => navigate("/groups")}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                        </button>
                        <div className="flex flex-row items-center gap-3">
                            <ComponentIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Create Group</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                                Group Information
                            </h2>
                            <p className="text-slate-600 dark:text-gray-400">
                                Create a new group to collaborate with others
                            </p>
                        </div>
                        
                        <createGroupFetcher.Form method="post" className="flex flex-col gap-6">
                            <Input label="Group Name" name="name" required />
                            <BigInput label="Description" name="description" required />
                            
                            <div className="flex items-center gap-4 pt-4">
                                <Button fetcher={createGroupFetcher}>
                                    Create Group
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/groups")}
                                    className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </createGroupFetcher.Form>
                    </div>
                </div>
            </div>
        </div>
    )
}