import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, LayoutDashboard, Users, FileText, Send, ShieldAlert } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col transition-colors duration-300 border-r dark:border-gray-700">
                <div className="p-6 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <ShieldAlert className="h-8 w-8" />
                        PhishSim
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />}>
                        Overview
                    </NavLink>
                    <NavLink href="/dashboard/campaigns/create" icon={<Send size={20} />}>
                        Launch Campaign
                    </NavLink>
                    <NavLink href="/dashboard/groups" icon={<Users size={20} />}>
                        Target Groups
                    </NavLink>
                    <NavLink href="/dashboard/templates" icon={<FileText size={20} />}>
                        Email Templates
                    </NavLink>
                    <NavLink href="/dashboard/landing-pages" icon={<LayoutDashboard size={20} />}>
                        Landing Pages
                    </NavLink>
                </nav>

                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-4">
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.email}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button
                            className="w-full flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-medium px-2 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors font-medium"
        >
            {icon}
            {children}
        </Link>
    )
}
