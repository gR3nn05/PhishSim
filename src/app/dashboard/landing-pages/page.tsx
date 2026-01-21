import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function LandingPagesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: pages } = await supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Landing Pages</h1>
                <Link
                    href="/dashboard/landing-pages/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Create Landing Page
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-colors">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pages?.map((page) => (
                        <li key={page.id}>
                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                        {page.name}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                            /{page.url_slug}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            Created on {new Date(page.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {(!pages || pages.length === 0) && (
                        <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No landing pages found. Create one to get started.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
