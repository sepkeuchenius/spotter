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

    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await supabase.auth.signUp({
        email: email as string,
        password: password as string,
        options: {
            data: {
                email_confirm: true
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    return redirect('/', {
        headers
    })
}