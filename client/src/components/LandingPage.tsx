import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Briefcase } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: 'Market Value Analysis',
      description: 'Get real-time insights into market salary trends, job opportunities, and industry demand for your profile.'
    },
    {
      icon: Users,
      title: 'Senior Mentorship',
      description: 'Connect with experienced professionals who can guide your career path and share valuable industry insights.'
    },
    {
      icon: Briefcase,
      title: 'Company Prep',
      description: 'Master interview techniques, technical skills, and company-specific preparation with expert guidance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            CampusVault
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Features
            </a>
            <a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              About
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse dark:bg-blue-600/10"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000 dark:bg-purple-600/10"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Bridge the Gap Between
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Campus and Career
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                Your ultimate platform for campus placement success. Get market insights, mentorship from industry leaders, and targeted company preparation all in one place.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Register Now
                <ArrowRight size={20} />
              </button>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                Join thousands of students already succeeding
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-white dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Comprehensive tools and resources designed specifically for campus placement excellence
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="text-white" size={24} />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                    Learn More
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
              Start your journey today and unlock your full potential with our comprehensive placement platform.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2026 CampusVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
