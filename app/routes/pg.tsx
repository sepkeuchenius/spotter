import { PrismaClient } from "@prisma/client";

export async function loader() {
    const prisma = new PrismaClient();
    await prisma.post.create({
        data: {
            title: 'test',
            content: 'test'
        }
    })
    return await prisma.post.findMany({
        take: 20,
    });

}