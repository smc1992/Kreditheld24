'use client'
import React, { useState, useRef } from 'react'

interface MultiFileUploadProps {
  name: string
  label: string
  accept?: string
  maxFiles?: number
  files: File[]
  onAddFiles: (files: FileList | File[]) => void
  onRemoveFile: (index: number) => void
  helpText?: string
}

export default function MultiFileUpload({
  name,
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxFiles = 10,
  files,
  onAddFiles,
  onRemoveFile,
  helpText
}: MultiFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    const dropped = e.dataTransfer.files
    if (dropped && dropped.length > 0) {
      onAddFiles(dropped)
    }
  }

  const handleClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files)
      // Clear the input so the same file can be re-selected if needed
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${isDragOver 
            ? 'border-green-400 bg-green-50' 
            : files.length > 0 
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
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          {files.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-700">
                {files.length} Datei(en) ausgewählt {files.length >= maxFiles ? `(Maximum ${maxFiles} erreicht)` : ''}
              </p>
              <ul className="text-left text-sm text-gray-700 divide-y divide-gray-200">
                {files.map((file, idx) => (
                  <li key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onRemoveFile(idx) }}
                      className="text-red-600 hover:text-red-700 text-xs underline"
                    >
                      Entfernen
                    </button>
                  </li>
                ))}
              </ul>
              {files.length < maxFiles && (
                <span className="text-xs text-green-600">Klicken oder neue Datei hierher ziehen zum Hinzufügen</span>
              )}
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
                  Dateien hierher ziehen oder klicken zum Auswählen
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Unterstützte Formate: PDF, JPG, PNG (max. 5MB pro Datei)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Maximal {maxFiles} Dateien.</p>
        {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
      </div>
    </div>
  )
}