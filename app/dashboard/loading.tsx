import LoaderComponent from '../components/LoaderComponent'

export default function DashboardLoading() {
  const dashboardIcon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    </svg>
  )

  return (
    <LoaderComponent
      title="Loading Dashboard"
      message="Fetching your latest updates and metrics..."
      icon={dashboardIcon}
    />
  )
} 