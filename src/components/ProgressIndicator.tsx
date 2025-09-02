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
          <div className="flex items-center justify-between">
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
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
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
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <nav aria-label="Fortschritt">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIndex) => {
              const status = getStepStatus(stepIndex)
              
              return (
                <li key={step.id} className="relative flex-1">
                  <div className="flex items-center">
                    {/* Step Circle */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`
                          w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                          ${
                            status === 'completed'
                              ? 'bg-primary border-primary text-white'
                              : status === 'current'
                              ? 'bg-white border-primary text-primary ring-4 ring-primary ring-opacity-20'
                              : 'bg-white border-gray-300 text-gray-400'
                          }
                        `}
                      >
                        {status === 'completed' ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span className="text-sm font-semibold">{stepIndex + 1}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="ml-4 min-w-0 flex-1">
                      <div
                        className={`
                          text-sm font-medium transition-colors duration-200
                          ${
                            status === 'completed' || status === 'current'
                              ? 'text-gray-900'
                              : 'text-gray-500'
                          }
                        `}
                      >
                        {step.title}
                      </div>
                      {step.description && (
                        <div
                          className={`
                            text-xs mt-1 transition-colors duration-200
                            ${
                              status === 'completed' || status === 'current'
                                ? 'text-gray-600'
                                : 'text-gray-400'
                            }
                          `}
                        >
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {stepIndex < steps.length - 1 && (
                    <div className="absolute top-5 left-10 w-full h-0.5 -ml-px">
                      <div
                        className={`
                          h-full transition-colors duration-200
                          ${
                            stepIndex < currentStep
                              ? 'bg-primary'
                              : 'bg-gray-300'
                          }
                        `}
                      ></div>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
        
        {/* Progress Percentage */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Fortschritt</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% abgeschlossen</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
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
    id: 'credit',
    title: 'Kreditwunsch',
    description: 'Summe, Laufzeit, Verwendung'
  },
  {
    id: 'income',
    title: 'Einkommen & Ausgaben',
    description: 'Finanzielle Situation'
  },
  {
    id: 'documents',
    title: 'Dokumente',
    description: 'Upload der Unterlagen'
  },
  {
    id: 'verification',
    title: 'Bestätigung',
    description: 'E-Mail-Verifizierung'
  },
  {
    id: 'submit',
    title: 'Abschluss',
    description: 'Antrag einreichen'
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