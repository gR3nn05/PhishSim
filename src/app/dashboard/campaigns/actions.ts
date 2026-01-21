'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/lib/email'

export async function launchCampaign(formData: FormData) {
    const title = formData.get('title') as string
    const templateId = formData.get('templateId') as string
    const groupId = formData.get('groupId') as string
    const landingPageUrl = formData.get('landingPageUrl') as string

    if (!title || !templateId || !groupId || !landingPageUrl) {
        throw new Error('All fields are required')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // 1. Create Campaign
    const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
            title,
            user_id: user.id,
            template_id: templateId,
            group_id: groupId,
            landing_page_url: landingPageUrl,
            status: 'sent', // Auto-launching for now
        })
        .select()
        .single()

    if (campaignError || !campaign) {
        console.error('Error creating campaign:', campaignError)
        throw new Error('Failed to create campaign')
    }

    // 2. Fetch Targets AND Group Name
    const { data: group } = await supabase
        .from('groups')
        .select('name, targets(*)')
        .eq('id', groupId)
        .single()

    const targets = group?.targets

    if (!targets || targets.length === 0) {
        // No targets, but campaign created.
        redirect('/dashboard')
    }

    // 3. Fetch Template
    const { data: template } = await supabase
        .from('email_templates')
        .select('subject, body_html')
        .eq('id', templateId)
        .single()

    if (!template) {
        console.error('Template not found')
        throw new Error('Template not found')
    }

    // 4. Send Emails and Log Events
    const eventsToInsert = []

    // Determine Base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://phish-sim-khaki.vercel.app'

    // Extract Slug from landingPageUrl (e.g. "/l/my-slug" -> "my-slug", "/fake-login" -> "fake-login")
    let slug = landingPageUrl.replace(/^\//, '') // remove leading slash
    if (slug.startsWith('l/')) {
        slug = slug.substring(2)
    }

    // We'll send emails sequentially for now
    for (const target of targets) {
        // Construct the custom link: /CampaignName/GroupName/Slug?t=targetEmail
        const trackingPath = `/${encodeURIComponent(title)}/${encodeURIComponent(group!.name)}/${slug}`
        const trackingLink = `${baseUrl}${trackingPath}?t=${encodeURIComponent(target.email)}`

        const pixelLink = `${baseUrl}/api/track/${campaign.id}/${encodeURIComponent(target.email)}/pixel`

        // Replace variables
        let htmlBody = template.body_html.replace(/{{link}}/g, trackingLink)

        // Add tracking pixel
        htmlBody += `<img src="${pixelLink}" alt="" width="1" height="1" style="display:none;" />`

        try {
            const result = await sendEmail({
                to: target.email,
                subject: template.subject,
                html: htmlBody
            })

            if (result.success) {
                eventsToInsert.push({
                    campaign_id: campaign.id,
                    target_email: target.email,
                    event_type: 'sent',
                })
            } else {
                console.error(`Failed to send to ${target.email}:`, result.error)
            }
        } catch (err) {
            console.error(`Exception sending to ${target.email}:`, err)
        }
    }

    if (eventsToInsert.length > 0) {
        const { error: eventsError } = await supabase
            .from('events')
            .insert(eventsToInsert)

        if (eventsError) {
            console.error('Error logging sent events:', eventsError)
        }
    }

    redirect('/dashboard')
}

export async function deleteCampaign(campaignId: string) {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    // Delete campaign (cascade should handle events, but let's be safe)
    // Assuming foreign keys are set to cascade delete. If not, we'd need to delete events first.
    // For this prototype, we'll assume cascade or just delete campaign.
    const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('user_id', user.id) // Security: ensure user owns campaign

    if (error) {
        console.error('Error deleting campaign:', error)
        throw new Error('Failed to delete campaign')
    }

    redirect('/dashboard')
}
