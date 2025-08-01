export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About InnerSwitch
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cognizant's Internal Mobility and Talent Discovery Platform
            </p>
          </div>

          {/* Platform Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What is InnerSwitch?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                <strong>InnerSwitch</strong> is designed to help Cognizant associates discover internal mobility opportunities and move seamlessly to other projects based on their skills and interests.
              </p>
              <p>
                Our platform connects talented associates with project managers who are looking for specific skills, creating a dynamic ecosystem where career growth and project needs align perfectly.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <svg className="w-8 h-8 text-blue-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-2">Profile Management</h3>
                <p className="text-sm text-gray-600">Showcase your skills, location preferences, and availability</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <svg className="w-8 h-8 text-purple-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-2">Opportunity Discovery</h3>
                <p className="text-sm text-gray-600">Find projects that match your skills and career goals</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <svg className="w-8 h-8 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Connections</h3>
                <p className="text-sm text-gray-600">Direct communication between associates and project managers</p>
              </div>
            </div>
          </div>

          {/* Shadow Mode Opportunity */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Shadow Mode Opportunity
            </h2>
            <div className="bg-white rounded-lg p-6 border border-purple-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Contribute 10% of Your Time for 2 Weeks
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      Shadow Mode allows you to explore new projects and technologies while maintaining your current role. This unique opportunity lets you:
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Gain hands-on experience with new technologies</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Network with teams across different domains</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Develop new skills while contributing to real projects</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Explore potential career paths within Cognizant</span>
                      </li>
                    </ul>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mt-4">
                      <p className="font-semibold text-purple-900 text-center">
                        Perfect for skill development, networking, and career exploration!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              How It Works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Your Profile</h3>
                <p className="text-sm text-gray-600">Update your skills, preferences, and availability</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Discovered</h3>
                <p className="text-sm text-gray-600">Toggle visibility to let PMs find you for opportunities</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Your Journey</h3>
                <p className="text-sm text-gray-600">Connect with teams and begin your internal mobility</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
} 