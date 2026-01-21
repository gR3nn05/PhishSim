'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createLandingPage(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const name = formData.get('name') as string
    const urlSlug = formData.get('urlSlug') as string
    const htmlContent = formData.get('htmlContent') as string

    if (!name || !urlSlug || !htmlContent) {
        throw new Error('Missing required fields')
    }

    // Ensure slug is URL safe
    const safeSlug = urlSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')

    const { error } = await supabase
        .from('landing_pages')
        .insert({
            user_id: user.id,
            name,
            url_slug: safeSlug,
            html_content: htmlContent,
        })

    if (error) {
        console.error('Error creating landing page:', error)
        throw new Error(`Failed to create landing page: ${error.message}`)
    }

    revalidatePath('/dashboard/landing-pages')
    redirect('/dashboard/landing-pages')
}
