'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ApplicationAlertProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  company: string
}

export default function ApplicationAlert({ isOpen, onClose, projectTitle, company }: ApplicationAlertProps) {
  const router = useRouter()
  const [isManualClose, setIsManualClose] = useState(false)

  // Auto close and navigate to applied jobs after 3 seconds
  useEffect(() => {
    if (isOpen && !isManualClose) {
      const timer = setTimeout(() => {
        onClose()
        // Navigate to applied jobs page
        router.push('/applied-jobs')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, router, isManualClose])

  const handleManualClose = () => {
    setIsManualClose(true)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white border border-green-200 rounded-lg shadow-xl max-w-2xl mx-auto">
        {/* Alert Content - Horizontal Layout */}
        <div className="flex items-center justify-between p-4">
          
          {/* Left Side - Success Icon and Main Message */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-1">Application Submitted!</h3>
              <p className="text-sm text-gray-700">
                Your application for <span className="font-semibold">"{projectTitle}"</span> at {company} has been submitted.
              </p>
            </div>
          </div>

          {/* Middle - PM Notification Info */}
          <div className="flex items-center space-x-3 px-6 border-l border-gray-200">
            <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-blue-900">PM Notified</p>
                <p className="text-xs text-blue-700">Redirecting to Applied Jobs...</p>
              </div>
            </div>
          </div>

          {/* Right Side - Close Button */}
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={handleManualClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div className="h-full bg-green-500 animate-progress-bar-fast"></div>
        </div>
      </div>
    </div>
  )
} 