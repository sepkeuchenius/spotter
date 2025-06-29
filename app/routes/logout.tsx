import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr"
import { getSupabase } from "~/utils/supabase.server"

export async function loader({ request }: ActionFunctionArgs) {
    const headers = new Headers()
    const supabase = await getSupabase(request, headers)

    await supabase.auth.signOut();

    return redirect('/login', {
        headers
    })
}