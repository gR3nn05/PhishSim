import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)] bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-4">
            Phish<span className="text-indigo-600 dark:text-indigo-400">Sim</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A professional Phishing Simulation Platform. Test your organization's security awareness with realistic campaigns.
          </p>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row mt-8">
          <Link
            href="/dashboard"
            className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center text-base font-medium h-12 px-8 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center text-base font-medium h-12 px-8"
          >
            Login
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} PhishSim. All rights reserved.
      </footer>
    </div>
  )
}
