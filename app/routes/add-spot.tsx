import { ActionFunctionArgs } from "@remix-run/node";
import { Spot } from "./map";
import { PrismaClient } from "@prisma/client";

export async function action(args: ActionFunctionArgs) {
    console.log('poseted')
    if (args.request.body) {
        const data = await args.request.formData()
        const prisma = new PrismaClient();
        const dbSpots = await prisma.spot.create({
            data: {
                name: data.get('name') as string,
                description: data.get('description') as string,
                lng: parseFloat(data.get('lng') as string),
                lat: parseFloat(data.get('lat') as string)
            }
        });
        return {'success': true}
    }

}