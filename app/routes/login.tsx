import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useNavigation, Form, redirect, useNavigate } from "@remix-run/react";
import { getSupabase } from "~/utils/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const supabase = await getSupabase(request, request.headers)
    
    const { data: { user } } = await supabase.auth.getUser()

    const { data: { session } } = await supabase.auth.getSession()
    if(user) {
        return redirect('/')
    }

    console.log(session);
  
    return new Response('...', {
      headers: request.headers,
    })
  
}

export async function action({ request }: ActionFunctionArgs) {
    const supabase = await getSupabase(request, request.headers)


    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string
    })

    if (error) {
        return Response.json({ error: error.message }, { status: 400 })
    }

    return redirect('/', {
        headers: request.headers,
    })
    
}

export default function Login() {
    const actionData = useActionData<typeof action>()
    const navigation = useNavigation()
    const isSubmitting = navigation.state === "submitting"
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <button 
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => navigate('/signup')}
                        >
                            create a new account
                        </button>
                    </p>
                </div>

                {actionData?.error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                        {actionData.error}
                    </div>
                )}

                <Form 
                    id="loginForm"
                    method="post" 
                    className="mt-8 space-y-6"
                >
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    )
}