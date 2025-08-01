import LoaderComponent from '../components/LoaderComponent'

export default function PMDashboardLoading() {
  const pmDashboardIcon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
    </svg>
  )

  return (
    <LoaderComponent
      title="Loading PM Dashboard"
      message="Preparing your project management workspace..."
      icon={pmDashboardIcon}
    />
  )
} 