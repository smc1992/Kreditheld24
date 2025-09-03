'use client'
import React from 'react'

interface Step {
  id: string
  title: string
  description?: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
  variant?: 'default' | 'compact'
}

export default function ProgressIndicator({ 
  steps, 
  currentStep, 
  className = '',
  variant = 'default'
}: ProgressIndicatorProps) {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'current'
    return 'upcoming'
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white border-b border-gray-200 ${className}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Schritt {currentStep + 1} von {steps.length}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {steps[currentStep]?.title}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
              <div className="w-32 sm:w-40 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Progress Bar */}
      <div className="block md:hidden mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Schritt {currentStep + 1} von {steps.length}
            </span>
            <span className="text-sm font-medium text-green-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% abgeschlossen
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {steps[currentStep]?.title}
            </div>
            <div className="text-sm text-gray-500">
              {steps[currentStep]?.description}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isLast = index === steps.length - 1
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 shadow-sm
                  ${
                    status === 'completed' 
                      ? 'bg-green-600 text-white ring-4 ring-green-100' 
                      : status === 'current'
                      ? 'bg-green-600 text-white ring-4 ring-green-100'
                      : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                  }
                `}>
                  {status === 'completed' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Step Title */}
                <div className="mt-3 text-center max-w-24">
                  <div className={`text-sm font-medium ${
                    status === 'current' ? 'text-green-600' : status === 'completed' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-400 mt-1 leading-tight">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Spacer */}
               {!isLast && (
                 <div className="flex-1 mx-4" />
               )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Vordefinierte Schritte für das Kreditantragsformular
export const kreditanfrageSteps: Step[] = [
  {
    id: 'personal',
    title: 'Persönliche Daten',
    description: 'Name, Adresse, Kontaktdaten'
  },
  {
    id: 'address',
    title: 'Adresse',
    description: 'Straße, PLZ, Ort'
  },
  {
    id: 'credit',
    title: 'Kreditwunsch',
    description: 'Summe, Laufzeit, Verwendung'
  },
  {
    id: 'income',
    title: 'Einkommen',
    description: 'Finanzielle Situation'
  },
  {
    id: 'verification',
    title: 'Bestätigung',
    description: 'E-Mail-Verifizierung'
  },
  {
    id: 'documents',
    title: 'Dokumente',
    description: 'Upload der Unterlagen'
  }
]

// Hook für die Verwendung mit dem Kreditantragsformular
export function useFormProgress(totalSteps: number) {
  const [currentStep, setCurrentStep] = React.useState(0)
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
  }
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }
  
  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
  }
  
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1
  const progress = ((currentStep + 1) / totalSteps) * 100
  
  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    progress
  }
}