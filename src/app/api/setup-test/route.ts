import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Create a Test User (or use existing) to own the campaign
    // We'll just grab the first user we find to be the owner
    const { data: users } = await supabase.auth.admin.listUsers()
    const userId = users.users?.[0]?.id

    if (!userId) {
        return NextResponse.json({ error: 'No users found to assign campaign to' }, { status: 500 })
    }

    // 2. Create Landing Page
    const slug = 'test-lp-' + Date.now()
    const { data: lp, error: lpError } = await supabase.from('landing_pages').insert({
        user_id: userId,
        name: 'Test LP ' + Date.now(),
        url_slug: slug,
        html_content: '<h1>Hello Victim</h1><p>This is a phishing page.</p>'
    }).select().single()

    if (lpError) return NextResponse.json({ error: 'LP Create Failed', details: lpError }, { status: 500 })

    // 3. Create Campaign
    const campaignTitle = 'TestCampaign-' + Date.now()
    const { data: campaign, error: campError } = await supabase.from('campaigns').insert({
        user_id: userId,
        title: campaignTitle,
        status: 'draft', // or sent
    }).select().single()

    if (campError) return NextResponse.json({ error: 'Campaign Create Failed', details: campError }, { status: 500 })

    // 4. Construct URL
    // Route: /[campaignName]/[groupName]/[slug]
    // Group Name can be anything since we don't strictly validate it in the code yet, 
    // but strict validation might be good later.
    const groupName = 'target-group'
    const targetEmail = 'victim@example.com'

    // Encode components
    const url = `http://localhost:3000/${encodeURIComponent(campaignTitle)}/${groupName}/${slug}?t=${encodeURIComponent(targetEmail)}`

    return NextResponse.json({
        success: true,
        url,
        campaignId: campaign.id,
        lpId: lp.id,
        checkEventsInfo: {
            campaign_id: campaign.id,
            email: targetEmail
        }
    })
}
