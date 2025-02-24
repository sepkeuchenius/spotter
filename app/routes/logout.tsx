import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr"

export async function action({ request }: ActionFunctionArgs) {
    const headers = new Headers()
    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return parseCookieHeader(request.headers.get('Cookie') ?? '')
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
                )
            },
        }
    })

    await supabase.auth.signOut();
    console.log('signed out');

    return redirect('/login', {
        headers
    })
}