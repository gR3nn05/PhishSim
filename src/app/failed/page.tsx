export default async function FailedPage({
    searchParams,
}: {
    searchParams: Promise<{ email: string }>
}) {
    const { email } = await searchParams
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 p-4 transition-colors">
            <div className="max-w-md text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-red-700 dark:text-red-500 mb-2">Phishing Simulation</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    This was a simulated phishing attack. You successfully entered your credentials on a fake page.
                </p>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-red-200 dark:border-red-800 transition-colors">
                    <p className="font-semibold text-gray-900 dark:text-white">Did you know?</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Always check the URL before entering your password. The URL you visited was not Microsoft.
                    </p>
                    {email && (
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                            Recorded for training purposes: {decodeURIComponent(email)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
