import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })

    const supabase = createClient(url, key)

    // Get latest campaign
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, group_id')
        .order('created_at', { ascending: false })
        .limit(1)

    if (!campaigns || campaigns.length === 0) return NextResponse.json({ error: 'No campaigns' }, { status: 404 })

    const campaign = campaigns[0]

    // Get a target
    const { data: targets } = await supabase
        .from('targets')
        .select('email')
        .eq('group_id', campaign.group_id)
        .limit(1)

    const email = targets?.[0]?.email || 'test@example.com'

    return NextResponse.json({
        success: true,
        campaignId: campaign.id,
        email: email,
        testLink: `http://localhost:3000/r/${campaign.id}/${encodeURIComponent(email)}`
    })
}
