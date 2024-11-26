import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation - Reduced padding */}
      <nav className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              QuitMate
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full 
                text-white bg-gradient-to-r from-primary to-rose-600 hover:from-rose-600 hover:to-primary
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 
                hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Adjusted spacing */}
      <div className="relative min-h-[calc(100vh-48px)]"> {/* Reduced from 64px to 48px */}
        {/* Background Elements */}
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 max-w-7xl mx-auto overflow-hidden">
            {/* Gradient Orbs - Adjusted positioning */}
            <div className="absolute right-1/2 top-1/6 -translate-y-1/2 translate-x-1/2 transform"> {/* Changed from top-1/4 to top-1/6 */}
              <div className="w-[600px] h-[600px] opacity-50">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-primary/30 to-rose-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-yellow-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Reduced top padding */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-6 pb-8 text-center lg:pt-8"> {/* Reduced from pt-10/pt-16 */}
            {/* Announcement Badge - Reduced margin */}
            <div className="mb-3 inline-flex animate-float"> {/* Reduced from mb-4 */}
              <div className="rounded-full p-1 pr-4 bg-gray-900/5 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary">
                    What's new
                  </div>
                  <span className="text-sm text-gray-900">
                    Join thousands who quit smoking with QuitMate 🎉
                  </span>
                </div>
              </div>
            </div>

            {/* Main Heading - Adjusted spacing */}
            <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-6xl font-medium tracking-tight text-slate-900 mb-3"> {/* Reduced from mb-4 */}
              <span className="relative whitespace-nowrap">
                <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-2/3 h-[0.58em] w-full fill-primary/20" preserveAspectRatio="none">
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-rose-500 to-primary animate-gradient bg-[length:200%_auto]">
                  Transform Your Life
                </span>
              </span>
              <br />
              One Breath at a Time
            </h1>

            {/* Description - Adjusted spacing */}
            <p className="mx-auto mt-3 max-w-2xl text-lg tracking-tight text-slate-700 mb-4"> {/* Reduced margins */}
              Your personal companion in the journey to a smoke-free life. Track progress, manage cravings, 
              and celebrate milestones with a supportive community.
            </p>

            {/* CTA Buttons - Adjusted spacing */}
            <div className="flex justify-center gap-x-6 mb-6"> {/* Reduced from mb-8 */}
              <Link
                to="/signup"
                className="group relative inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-semibold 
                  focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary text-white hover:text-slate-100 
                  hover:bg-rose-600 active:bg-rose-800 active:text-rose-100 focus-visible:outline-rose-600 
                  transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-rose-600"></span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-rose-600 opacity-0 
                  transition-opacity group-hover:opacity-100 animate-gradient"></span>
                <span className="relative flex items-center">
                  Start Your Journey
                  <svg className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/login"
                className="group inline-flex ring-1 ring-slate-200 items-center justify-center rounded-full py-3 px-6 
                  text-sm focus:outline-none hover:ring-slate-300 bg-white text-slate-700 hover:text-slate-900 
                  hover:bg-slate-50 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 
                  focus-visible:ring-slate-300 transform transition-all duration-200 hover:scale-105"
              >
                <span className="relative flex items-center">
                  Sign In
                  <svg className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Stats Section - Adjusted spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto"> {/* Reduced gap from 4 */}
              {[
                { value: '10K+', label: 'Active Users', icon: '👥' },
                { value: '1M+', label: 'Cigarettes Avoided', icon: '🚭' },
                { value: '$500K+', label: 'Money Saved', icon: '💰' },
              ].map((stat, index) => (
                <div key={index} 
                  className="relative group bg-white/50 backdrop-blur-sm rounded-xl px-3 py-4 
                    shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:scale-105 
                    overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-rose-500/5 
                    opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 sm:py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-2">
            {/* Feature List */}
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to quit smoking
              </h2>
              <p className="mt-4 text-gray-500">
                Our comprehensive tools and features support you at every step of your journey.
              </p>

              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {[
                  {
                    name: 'Progress Tracking',
                    description: 'Monitor your smoke-free days, money saved, and health improvements in real-time.',
                    icon: '📊'
                  },
                  {
                    name: 'Craving Management',
                    description: 'Track and manage your cravings with proven techniques and strategies.',
                    icon: '💪'
                  },
                  {
                    name: 'Breathing Exercises',
                    description: 'Access guided breathing exercises to help manage stress and cravings.',
                    icon: '🧘‍♂️'
                  },
                  {
                    name: 'Achievement System',
                    description: 'Earn badges and celebrate your milestones as you progress.',
                    icon: '🏆'
                  }
                ].map((feature) => (
                  <div key={feature.name} className="relative pl-14">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="inline ml-2">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Feature Image/Animation */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50 relative">
                {/* Animated elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border-4 border-dashed border-primary/30 animate-spin-slow"/>
                  <div className="absolute w-56 h-56 rounded-full border-4 border-dotted border-primary/20 animate-reverse-spin"/>
                  <div className="absolute w-48 h-48 rounded-full border-4 border-dotted border-primary/10 animate-spin-slow"/>
                </div>

                {/* Feature Cards */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {[
                      { title: 'Days Smoke Free', value: '30+', color: 'bg-blue-50' },
                      { title: 'Money Saved', value: '$500+', color: 'bg-green-50' },
                      { title: 'Cravings Beaten', value: '100+', color: 'bg-yellow-50' },
                      { title: 'Health Improved', value: '80%', color: 'bg-purple-50' }
                    ].map((stat, index) => (
                      <div
                        key={stat.title}
                        className={`${stat.color} p-4 rounded-xl shadow-sm transform transition-all duration-300 hover:scale-105 animate-float animation-delay-${index * 1000}`}
                      >
                        <div className="font-semibold text-xl">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-16">
        <div className="absolute inset-x-0 top-0 hidden h-1/2 bg-gray-50 lg:block" aria-hidden="true" />
        <div className="mx-auto max-w-7xl bg-primary lg:bg-transparent lg:px-8">
          <div className="lg:grid lg:grid-cols-12">
            <div className="relative z-10 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:bg-transparent lg:py-16">
              <div className="absolute inset-x-0 h-1/2 bg-gray-50 lg:hidden" aria-hidden="true" />
              <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:p-0">
                <div className="aspect-w-10 aspect-h-6 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1">
                  <div className="relative rounded-3xl bg-primary px-6 py-10 shadow-xl sm:px-12 sm:py-16">
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 mix-blend-multiply" />
                    </div>
                    <div className="relative">
                      <div className="sm:text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                          Ready to quit?
                        </h2>
                        <p className="mt-6 text-lg text-red-100">
                          Join thousands of others who have successfully quit smoking with QuitMate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-primary lg:col-span-10 lg:col-start-3 lg:row-start-1 lg:grid lg:grid-cols-10 lg:items-center lg:rounded-3xl">
              <div className="absolute inset-0 hidden overflow-hidden rounded-3xl lg:block" aria-hidden="true">
                <div className="absolute inset-y-0 left-0 w-full bg-red-500 opacity-10" />
              </div>
              <div className="relative max-w-md px-4 py-12 sm:max-w-3xl sm:px-6 sm:py-16 lg:col-span-6 lg:col-start-4 lg:max-w-none lg:p-0">
                <div className="flex justify-center lg:justify-end space-x-4">
                  <Link
                    to="/signup"
                    className="inline-flex items-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-primary shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center rounded-md border border-white px-6 py-3 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 