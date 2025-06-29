import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr"
import { PrismaClient, User } from "@prisma/client"
import { getSupabase } from "~/utils/supabase.server";

export async function getUser(request: Request): Promise<User | null> {
    const supabase = await getSupabase(request, request.headers)
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) {
        return null
    }
    const prisma = new PrismaClient()
    const dbUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    })
    return dbUser
}
