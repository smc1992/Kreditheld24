import Link from 'next/link'

// Force dynamic rendering to prevent useContext errors during static generation
export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Diese Seite wurde nicht gefunden.</p>
        <Link 
          href="/" 
          className="inline-block bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-lg transition-all"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}
