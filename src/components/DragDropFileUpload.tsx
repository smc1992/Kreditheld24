'use client'
import React, { useState, useRef } from 'react'

interface DragDropFileUploadProps {
  name: string
  label: string
  required?: boolean
  accept?: string
  currentFile?: File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove?: (name: string) => void
  helpText?: string
}

export default function DragDropFileUpload({
  name,
  label,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  currentFile,
  onChange,
  onRemove,
  helpText
}: DragDropFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Erzeuge Vorschaulink für Bilder und räume auf
  React.useEffect(() => {
    if (currentFile && currentFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(currentFile)
      setPreviewUrl(url)
      return () => {
        URL.revokeObjectURL(url)
        setPreviewUrl(null)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [currentFile])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      // Erstelle ein künstliches Event für onChange
      const mockEvent = {
        target: {
          name,
          files
        }
      } as React.ChangeEvent<HTMLInputElement>
      
      onChange(mockEvent)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) onRemove(name)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${isDragOver 
            ? 'border-green-400 bg-green-50' 
            : currentFile 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          {currentFile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-700">
                ✓ Datei ausgewählt: {currentFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {previewUrl && (
                <div className="flex justify-center">
                  <img src={previewUrl} alt="Vorschau" className="mt-1 max-h-24 rounded border border-gray-200" />
                </div>
              )}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-700 text-xs underline"
                >
                  Entfernen
                </button>
                <span className="text-xs text-green-600">Klicken oder neue Datei hierher ziehen zum Ersetzen</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Datei hierher ziehen oder klicken zum Auswählen
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Unterstützte Formate: PDF, JPG, PNG (max. 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {helpText && (
        <p className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  )
}