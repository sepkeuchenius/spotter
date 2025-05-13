import { Group } from "@prisma/client"
import { FetcherWithComponents, Form, useFetcher } from "@remix-run/react"
import { Search } from "~/components/search"
import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { getUser } from "~/server/user"
import { PrismaClient } from "@prisma/client"
import { ComponentIcon, Loader2Icon } from "lucide-react"
import { Spinner } from "~/components/spinner"

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const name = formData.get("name")
    const description = formData.get("description")
    const user = await getUser(request)
    if (!user) {
        return redirect("/login")
    }
    const prisma = new PrismaClient()
    const group = await prisma.group.create({ data: { name: name as string, description: description as string, createdById: user.id, admins: { connect: { id: user.id } } } })
    return redirect(`/group/${group.id}`)
}


function Input({ name, label, required = false }: { name: string, label: string, required?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name}>{label}</label>
            <input type="text" name={name} className="border-2 border-gray-300 rounded-md p-2" required={required} />
        </div>
    )
}
function BigInput({ name, label, required = false }: { name: string, label: string, required?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name}>{label}</label>
            <textarea name={name} className="border-2 border-gray-300 rounded-md p-2" required={required} />
        </div>
    )
}
export function Button({ children, fetcher, onClick }: { children: React.ReactNode, fetcher?: FetcherWithComponents<typeof action>, onClick?: () => void }) {
    return (
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md flex flex-row justify-center items-center gap-2" onClick={onClick}>
            {fetcher?.state === "submitting" ?  <Spinner /> : children}
        </button>
    )
}
export default function GroupsCreate() {
    const createGroupFetcher = useFetcher<typeof action>()

    return (
        <div className="w-full flex flex-col gap-4 bg-gray-50">
            <div className="w-full h-10 py-8 bg-white border-b border-gray-200 flex items-center justify-left px-5 gap-3">
                <ComponentIcon /><h1 className="text-2xl font-bold">Create Group</h1>
            </div>
            <div className="flex flex-col gap-4 px-5">
                <createGroupFetcher.Form method="post" className="flex flex-col gap-4 w-1/2">
                    <Input label="Name" name="name" required />
                    <BigInput label="Description" name="description" required />
                    <Button fetcher={createGroupFetcher}>Create Group</Button>
                </createGroupFetcher.Form>
            </div>
        </div>
    )
}

function GroupCard({ group }: { group: Group }) {
    return (
        <div>
            <h1>{group.name}</h1>
        </div>
    )
}