'use client'

export default function Custom500() {
  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>500</h1>
        <p className="mb-4">Ein Serverfehler ist aufgetreten.</p>
      </div>
      <a href="/" className="text-primary hover:underline">
        Zurück zur Startseite
      </a>
    </div>
  )
}
