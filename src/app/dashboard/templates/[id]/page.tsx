import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function TemplateDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Template Details
    const { data: template, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !template) {
        notFound()
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link
                    href="/dashboard/templates"
                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Templates
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{template.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Subject: <span className="font-medium text-gray-900 dark:text-white">{template.subject}</span>
                        </p>
                    </div>
                    <Link
                        href={`/dashboard/templates/${template.id}/edit`}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                    >
                        Edit Template
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Template Preview
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        This is how the email body looks.
                    </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900 overflow-auto max-h-[600px]">
                        <iframe
                            srcDoc={template.body_html}
                            className="w-full h-[500px] border-0 bg-white"
                            title="Template Preview"
                        />
                    </div>
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">HTML Source</h4>
                        <pre className="bg-gray-100 dark:bg-gray-950 p-4 rounded-md overflow-x-auto text-xs text-gray-800 dark:text-gray-300">
                            {template.body_html}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
