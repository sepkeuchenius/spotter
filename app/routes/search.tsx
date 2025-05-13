import { PrismaClient } from "@prisma/client";
import { Spot } from "./_index";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader(args: LoaderFunctionArgs) {
    const { request, params } = args;
    const queryParams = new URL(request.url).searchParams;
    const searchQuery = queryParams.get('query');
    console.log(searchQuery)
    const client = new PrismaClient();
    return await client.spot.findMany({ take: 20 }).then((spots) => {
        return spots.map((spot) => { return { title: spot.name, description: spot.description, location: { lng: spot.lng, lat: spot.lat } } as Spot }).filter((spot: Spot) => spot.title.includes(searchQuery)|| spot.description.includes(searchQuery));
    })
}