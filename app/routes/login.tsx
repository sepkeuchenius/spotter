import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useNavigation, Form, redirect } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
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
      },
    })
    
    const { data: { user } } = await supabase.auth.getUser()

    const { data: { session } } = await supabase.auth.getSession()
    if(user) {
        return redirect('/')
    }

    console.log(session);
  
    return new Response('...', {
      headers,
    })
  
}

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

    const { error, data: {user} } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string
    })
    console.log(user)
    console.log(error)
    if(!error && !user) {
        await supabase.auth.signUp({email: email as string, password: password as string})        
    }

    if (error) {
        return json({ error: error.message }, { status: 400 })
    }

    return redirect('/', {
        headers
    })
    
}

export default function Login() {
    const actionData = useActionData<typeof action>()
    const navigation = useNavigation()

    return (
        <div>
            <h1>Login</h1>
            <Form method="post">
                <input type="email" name="email" />
                <input type="password" name="password" />
                <button type="submit">Login</button>
                <button type="submit" formAction="/signup">Signup</button>
            </Form>
        </div>
    )
}