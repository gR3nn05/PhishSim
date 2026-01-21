import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ campaignId: string; email: string }> }
) {
    const { campaignId, email } = await params

    // Use Service Role to bypass RLS for tracking
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // Log 'clicked' event
    await supabase.from('events').insert({
        campaign_id: campaignId,
        target_email: decodeURIComponent(email),
        event_type: 'clicked',
        user_agent: userAgent,
        ip_address: ip,
    })

    // Redirect to Fake Login
    // In a real app, you might pass campaignId/email to the fake login to track compromise
    // The prompt says: "Target enters credentials -> System tracks 'Compromised'"
    // So we likely need to pass context to the fake login page.
    // I'll append query params.
    const fakeLoginUrl = new URL('/fake-login', request.url)
    fakeLoginUrl.searchParams.set('campaignId', campaignId)
    fakeLoginUrl.searchParams.set('email', email)

    return NextResponse.redirect(fakeLoginUrl, 307)
}
