'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <section className="text-center mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                Welcome to InnerSwitch
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Cognizant&apos;s Internal Mobility and Talent Discovery Platform.
              <br className="hidden sm:block" />
              <span className="font-medium text-blue-600">Connect talent with opportunities across the organization.</span>
            </p>
          </section>

          {/* Feature Cards */}
          <section className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-16">
            <div className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                </svg>
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900">For Associates</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Create your profile, showcase skills, and discover internal opportunities that match your career goals.
              </p>
            </div>

            <div className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900">For Project Managers</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Search and filter talent by skills, experience, and location. Find the perfect fit for your projects.
              </p>
            </div>

            <div className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900">Internal Mobility</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Accelerate internal career growth and talent movement across departments and projects.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm text-center">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600 leading-relaxed">
              Join the internal mobility revolution and discover your next career opportunity within Cognizant.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] font-medium text-sm sm:text-base"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => router.push('/profile/create')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Create Profile
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-20 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm sm:text-base text-gray-600">
            © 2024 InnerSwitch by Cognizant. Built with ❤️ for internal mobility.
          </p>
        </div>
      </footer>
    </div>
  )
}
