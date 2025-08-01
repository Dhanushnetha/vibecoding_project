interface LoaderComponentProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  background?: string
}

export default function LoaderComponent({ 
  title = "Loading InnerSwitch", 
  message = "Please wait while we prepare your experience...",
  icon,
  background = "bg-gray-50"
}: LoaderComponentProps) {
  const defaultIcon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )

  return (
    <div className={`min-h-screen ${background} flex items-center justify-center`}>
      <div className="text-center">
        {/* Logo/Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          {icon || defaultIcon}
        </div>

        {/* Spinner */}
        <div className="relative">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
            background.includes('gradient') || background.includes('blue')
              ? 'border-white/20 border-t-white'
              : 'border-gray-200 border-t-blue-600'
          }`}></div>
        </div>

        {/* Loading text */}
        <h2 className={`text-xl font-semibold mb-2 ${
          background.includes('gradient') || background.includes('blue')
            ? 'text-white'
            : 'text-gray-900'
        }`}>
          {title}
        </h2>
        <p className={
          background.includes('gradient') || background.includes('blue')
            ? 'text-blue-100'
            : 'text-gray-600'
        }>
          {message}
        </p>
      </div>
    </div>
  )
} 