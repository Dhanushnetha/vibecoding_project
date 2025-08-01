'use client'

import { useEffect } from 'react'

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  company: string
}

export default function ApplicationModal({ isOpen, onClose, projectTitle, company }: ApplicationModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-400 bg-opacity-30 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all border border-gray-300">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8">
            
            {/* Success Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Application Submitted!
            </h3>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Your application for <span className="font-semibold text-gray-900">"{projectTitle}"</span> at {company} has been successfully submitted.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 mb-1">Project Manager Notified</p>
                    <p className="text-sm text-blue-700">
                      The PM has been automatically informed about your application and will review your profile shortly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>PM reviews your profile and skills</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>You'll receive an update within 2-3 business days</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Check your email for further instructions</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue Browsing
              </button>
              
              <button
                onClick={() => {
                  onClose()
                  // Navigate to dashboard or applications page if exists
                  window.location.href = '/dashboard'
                }}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 