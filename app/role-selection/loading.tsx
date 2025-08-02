import LoaderComponent from '../components/LoaderComponent'

export default function LoginLoading() {
  return (
    <LoaderComponent
      title="Initializing InnerSwitch"
      message="Preparing your login experience..."
      background="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"
    />
  )
} 