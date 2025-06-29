import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Spot } from "./_index";
import { PrismaClient } from "@prisma/client";
import { getUser } from "../server/user";
import { prisma } from "~/utils/db.server";

export async function action(args: ActionFunctionArgs) {
    const user = await getUser(args.request)
    console.log("user", user)
    if (!user) {
        return {'success': false, 'error': 'User not found'}
    }
    if (args.request.body) {
        const data = await args.request.formData()
        const dbSpots = await prisma.spot.create({
            data: {
                name: data.get('name') as string,
                description: data.get('description') as string,
                lng: parseFloat(data.get('lng') as string),
                lat: parseFloat(data.get('lat') as string),
                authorId: user.id
            }
        });
        return redirect(`/spot/${dbSpots.id}`)
    }

}