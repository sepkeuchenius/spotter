import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export async function getSupabase(request: Request, headers: Headers) {
    return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
        cookies: {
            async getAll() {
                const cookieHeader = request.headers.get('Cookie') ?? '';
                const cookies = parseCookieHeader(cookieHeader);
                return cookies.map(({name, value}) => ({
                  name,
                  value: value ?? ''
                }));
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
                )
            },
        }
    })
} 