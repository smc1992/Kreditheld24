'use client'
import React, { Suspense } from 'react'
import KreditanfrageForm from './KreditanfrageForm'

function KreditanfrageFormContent() {
  return <KreditanfrageForm />
}

export default function KreditanfrageFormWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-8">Formular wird geladen...</div>}>
      <KreditanfrageFormContent />
    </Suspense>
  )
}