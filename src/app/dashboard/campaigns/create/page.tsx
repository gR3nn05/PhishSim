import { createClient } from '@/lib/supabase/server'
import { launchCampaign } from '../actions'

export default async function CreateCampaignPage() {
    const supabase = await createClient()

    // Fetch Templates
    const { data: templates } = await supabase
        .from('email_templates')
        .select('id, name')
        .order('created_at', { ascending: false })

    // Fetch Groups
    const { data: groups } = await supabase
        .from('groups')
        .select('id, name')
        .order('created_at', { ascending: false })

    // Fetch Landing Pages
    const { data: customLandingPages } = await supabase
        .from('landing_pages')
        .select('name, url_slug')
        .order('created_at', { ascending: false })

    const landingPages = [
        { url: '/fake-login', name: 'Fake Microsoft Login' },
        ...((customLandingPages || []).map(p => ({
            url: `/l/${p.url_slug}`,
            name: p.name
        })))
    ]

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Launch New Campaign</h1>

            <form action={launchCampaign} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Campaign Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. Q4 Phishing Test"
                    />
                </div>

                <div>
                    <label htmlFor="templateId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Email Template
                    </label>
                    <select
                        name="templateId"
                        id="templateId"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">-- Select Template --</option>
                        {templates?.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Target Group
                    </label>
                    <select
                        name="groupId"
                        id="groupId"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">-- Select Group --</option>
                        {groups?.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="landingPageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Landing Page
                    </label>
                    <select
                        name="landingPageUrl"
                        id="landingPageUrl"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">-- Select Landing Page --</option>
                        {landingPages.map((p) => (
                            <option key={p.url} value={p.url}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 font-bold flex items-center transition-colors"
                    >
                        🚀 Launch Campaign
                    </button>
                </div>
            </form>
        </div>
    )
}
