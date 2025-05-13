import { Group } from "@prisma/client"
import { Form, useFetcher, useLoaderData, useNavigate } from "@remix-run/react"
import { SearchInput } from "~/components/search"
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { getUser } from "~/server/user"
import { PrismaClient } from "@prisma/client"
import { Button } from "../create-group/route"

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
    return redirect(`/groups/${group.id}`)

}

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await getUser(request)
    if (!user) {
        return redirect("/login")
    }
    const prisma = new PrismaClient()
    const query = new URL(request.url).searchParams
    const search = query.get("search")
    const groups = await prisma.group.findMany({ where: { name: { contains: search ?? "" } } })
    return { groups }
}


export default function Groups() {
    const { groups } = useLoaderData<typeof loader>()
    const searchFetcher = useFetcher();
    const createGroupFetcher = useFetcher<typeof action>()
    const navigate = useNavigate()

    return (
        <div className="p-4 w-full flex flex-col gap-4 bg-gray-50">

            <div className="flex flex-col gap-4 justify-center items-center">
                <Form method="get" action=".">
                    <SearchInput name="search" placeholder="Search for a group" />
                </Form>

            </div>
            <div className="flex flex-row justify-center gap-4">
                    <Button onClick={() => {
                        navigate("/create-group")
                    }}>+ Create Group</Button>
            </div>
            <div className="flex flex-row flex-wrap gap-4">
                {groups.map((group) => (
                    <GroupCard key={group.id} group={group} />
                ))}
            </div>
        </div>
    )
}

function GroupCard({ group }: { group: Group }) {
    return (
        <div className="w-40 h-40 bg-white shadow-md p-4 rounded-md">
            <h1>{group.name}</h1>
            <p>{group.description}</p>
        </div>
    )
}