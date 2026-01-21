import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch initial stats
    // We can do this with 4 queries or one group by.
    // Group by is better but Supabase JS simple client might need raw SQL or multiple queries.
    // We'll use multiple count queries for simplicity and readability in this prototype.

    const { count: sent } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'sent')

    const { count: opened } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'opened')

    const { count: clicked } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'clicked')

    const { count: compromised } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'compromised')

    const initialStats = {
        sent: sent || 0,
        opened: opened || 0,
        clicked: clicked || 0,
        compromised: compromised || 0,
    }

    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard Overview</h1>
            <DashboardClient initialStats={initialStats} campaigns={campaigns || []} />
        </div>
    )
}
