'use client'

import { useRouter } from 'next/navigation'

interface ApplicationSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  company: string
}

export default function ApplicationSuccessModal({ isOpen, onClose, projectTitle, company }: ApplicationSuccessModalProps) {
  const router = useRouter()

  const handleOkayClick = () => {
    onClose()
    router.push('/applied-projects')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Transparent Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Centered Modal */}
      <div className={`relative w-full max-w-lg max-h-[80vh] transform transition-all duration-300 ease-out ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[80vh]">
            {/* Success Icon and Message */}
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">Application Submitted!</h4>
              <p className="text-gray-600 text-sm">
                Your application has been successfully submitted.
              </p>
            </div>

            {/* Project Details */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 shadow-sm">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></div>
                Application Details
              </h5>
              <div className="grid gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-900">{projectTitle}</h6>
                    <p className="text-gray-600 text-sm">{company}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-gradient-to-br from-green-50/80 to-blue-50/60 p-3 rounded-lg border border-green-200/40">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-900 text-xs">Status</span>
                    </div>
                    <p className="text-green-800 font-semibold text-sm">Submitted</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/60 p-3 rounded-lg border border-blue-200/40">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-900 text-xs">PM Notification</span>
                    </div>
                    <p className="text-blue-800 font-semibold text-sm">Sent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/60 p-3 rounded-xl border border-gray-200/40">
              <h5 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-2"></div>
                What&apos;s Next?
              </h5>
              <ul className="space-y-1.5 text-gray-700 text-xs">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>PM will review your application</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Update within 2-3 business days</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span>Track status in applied projects</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleOkayClick}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                ✓ Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 