'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

import Link from 'next/link'

type Stats = {
    sent: number
    opened: number
    clicked: number
    compromised: number
}

type Campaign = {
    id: string
    title: string
    status: string
    created_at: string
}

export default function DashboardClient({ initialStats, campaigns }: { initialStats: Stats; campaigns: Campaign[] }) {
    const [stats, setStats] = useState<Stats>(initialStats)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('realtime events')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'events' },
                (payload) => {
                    const newEvent = payload.new as { event_type: string }
                    setStats((prev) => {
                        const type = newEvent.event_type as keyof Stats
                        if (prev[type] !== undefined) {
                            return { ...prev, [type]: prev[type] + 1 }
                        }
                        return prev
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Sent" value={stats.sent} color="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" />
                <StatCard title="Opened" value={stats.opened} color="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" />
                <StatCard title="Clicked" value={stats.clicked} color="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" />
                <StatCard title="Compromised" value={stats.compromised} color="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" />
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Campaigns</h2>
                    {campaigns.length > 0 && (
                        <Link
                            href="/dashboard/campaigns/create"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                        >
                            New Campaign
                        </Link>
                    )}
                </div>

                {campaigns.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-dashed border-gray-300 dark:border-gray-700">
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No campaigns</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new phishing simulation.</p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/campaigns/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Start your first campaign
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {campaigns.map((campaign) => (
                                <li key={campaign.id}>
                                    <Link href={`/dashboard/campaigns/${campaign.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                                    {campaign.title}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                        {campaign.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        Created on {new Date(campaign.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 ${color} transition-colors`}>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">{title}</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
        </div>
    )
}
