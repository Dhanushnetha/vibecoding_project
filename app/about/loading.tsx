import LoaderComponent from '../components/LoaderComponent'

export default function AboutLoading() {
  const aboutIcon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  return (
    <LoaderComponent
      title="Loading About"
      message="Loading platform information and details..."
      icon={aboutIcon}
    />
  )
} 