import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function LandingPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: page } = await supabase
        .from('landing_pages')
        .select('html_content')
        .eq('url_slug', slug)
        .single()

    if (!page) {
        notFound()
    }

    return (
        <div dangerouslySetInnerHTML={{ __html: page.html_content }} />
    )
}
