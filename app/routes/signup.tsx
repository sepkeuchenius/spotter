import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr"
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

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
    const username = formData.get('username')
    const { error, data: { user } } = await supabase.auth.signUp({
        email: email as string,
        password: password as string,
        options: {
            data: {
                email_confirm: true,
            }
        }
    })
    if(error) {
        return Response.json({ error: error.message }, { status: 400 })
    }

    const prisma = new PrismaClient()
    if (user) {
        const dbUser = await prisma.user.create({
            data: {
                id: user.id,
                email: email as string,
                name: username as string
            }
        })
        console.log("dbUser", dbUser)
    }
    else {
        return Response.json({ error: "User not found" }, { status: 400 })
    }

    await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string
    })

    return redirect('/', {
        headers
    })
}

export default function Signup() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </a>
                    </p>
                </div>

                {actionData?.error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                        {actionData.error}
                    </div>
                )}

                <Form 
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
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
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
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}