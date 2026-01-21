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

    // Log 'opened' event
    await supabase.from('events').insert({
        campaign_id: campaignId,
        target_email: decodeURIComponent(email),
        event_type: 'opened',
        user_agent: userAgent,
        ip_address: ip,
    })

    // Return 1x1 transparent PNG
    const pixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        'base64'
    )

    return new NextResponse(pixel, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
        },
    })
}
