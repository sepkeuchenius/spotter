import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

import "./tailwind.css";
import { SideBar } from "./components/sidebar";
import { getUser } from "./server/user";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ height: "100vh", width: "100vw" }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request)
  return { user }
}

export default function App() { 
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-row h-full dark:bg-slate-700">
      {/* Mobile menu toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open sidebar"
      >
        <MenuIcon size={20} />
      </button>
      
      {/* Sidebar with mobile state */}
        <SideBar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} user={user} />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        <Outlet />
      </div>
    </div>
  );
}
