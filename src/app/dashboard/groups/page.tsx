import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function GroupsPage() {
    const supabase = await createClient()
    const { data: groups } = await supabase
        .from('groups')
        .select('*, targets(count)')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Target Groups</h1>
                <Link
                    href="/dashboard/groups/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Create Group
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-colors">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {groups?.map((group) => (
                        <li key={group.id}>
                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <Link href={`/dashboard/groups/${group.id}`} className="block hover:underline">
                                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                            {group.name}
                                        </p>
                                    </Link>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            {group.targets[0]?.count || 0} Targets
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            Created on {new Date(group.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {(!groups || groups.length === 0) && (
                        <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No groups found. Create one to get started.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
