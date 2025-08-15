// app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | My Blog',
  description: 'Learn about my Next.js blog project, tech stack, and development journey',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            About This Project
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A personal blog website built with Next.js to practice and improve my skills in full-stack web development
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 sm:space-y-16">
          {/* Purpose & Goal Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Purpose & Goal
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                This blog serves as both a learning platform and a showcase of my development skills. It's part of my portfolio and learning roadmap toward becoming a stronger full-stack web developer.
              </p>
              <div className="grid gap-4 sm:gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-3"></div>
                  <p className="text-base sm:text-lg text-gray-700">
                    <strong className="font-semibold">Portfolio Project:</strong> Demonstrating Next.js proficiency and modern web development practices
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-3"></div>
                  <p className="text-base sm:text-lg text-gray-700">
                    <strong className="font-semibold">Learning Focus:</strong> Secure authentication, database-driven backend, and remote development
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-3"></div>
                  <p className="text-base sm:text-lg text-gray-700">
                    <strong className="font-semibold">Skills Development:</strong> Full-stack capabilities with modern technologies
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Tech Stack
            </h2>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Frontend & Backend</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Framework
                    </span>
                    <span className="text-base sm:text-lg text-gray-700">Next.js</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Auth
                    </span>
                    <span className="text-base sm:text-lg text-gray-700">NextAuth.js</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Database & Infrastructure</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Database
                    </span>
                    <span className="text-base sm:text-lg text-gray-700">PostgreSQL</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      Management
                    </span>
                    <span className="text-base sm:text-lg text-gray-700">pgAdmin</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Hosting
                    </span>
                    <span className="text-base sm:text-lg text-gray-700">Raspberry Pi 5</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Features Implemented
            </h2>
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                    🔐 User Authentication
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 mb-3">
                    Integrated with NextAuth.js for secure user management
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <em>Note: Google authentication attempted but encountered domain restriction issues</em>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                    🗄️ Database Connection
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700">
                    PostgreSQL hosted on Raspberry Pi with schema connected to the Next.js app
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                    🛡️ Protected Routes
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700">
                    Securing certain pages to require user authentication
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                    🌐 Remote Development
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700">
                    Access development environment remotely through Cloudflare Tunnel
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Development Setup Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Development Setup
            </h2>
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Hardware & Infrastructure</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🥧</span>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-700">Raspberry Pi 5</p>
                      <p className="text-sm sm:text-base text-gray-600">Main development server</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🗃️</span>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-700">PostgreSQL</p>
                      <p className="text-sm sm:text-base text-gray-600">Runs locally on the Pi</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-700">Cloudflare Tunnel</p>
                      <p className="text-sm sm:text-base text-gray-600">Remote access solution</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Development Workflow</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💻</span>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-700">Remote Coding</p>
                      <p className="text-sm sm:text-base text-gray-600">Code edits via SSH and tunnel</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-700">pgAdmin</p>
                      <p className="text-sm sm:text-base text-gray-600">Database visualization and editing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-700">npm run dev</p>
                      <p className="text-sm sm:text-base text-gray-600">Development server on Pi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Challenges Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Challenges & Learning
            </h2>
            <div className="space-y-6 sm:space-y-8">
              <div className="border-l-4 border-yellow-400 pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Google Auth Domain Restrictions
                </h3>
                <p className="text-base sm:text-lg text-gray-700">
                  Encountered challenges testing Google login locally due to allowed-domain settings, providing valuable experience with OAuth constraints.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Prisma & Database Configuration
                </h3>
                <p className="text-base sm:text-lg text-gray-700">
                  Troubleshooting database connections and Prisma configurations enhanced understanding of ORM tools and database management.
                </p>
              </div>

              <div className="border-l-4 border-green-400 pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Remote Development Workflow
                </h3>
                <p className="text-base sm:text-lg text-gray-700">
                  Balancing Cloudflare domain usage for dev server access while managing other remote development needs taught valuable DevOps skills.
                </p>
              </div>

              <div className="border-l-4 border-purple-400 pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Project Continuity
                </h3>
                <p className="text-base sm:text-lg text-gray-700">
                  Returning to the project after a few months highlighted the importance of documentation and code organization for long-term maintainability.
                </p>
              </div>
            </div>
          </section>

          {/* Future Goals Section */}
          <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-sm p-6 sm:p-8 lg:p-10 text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">
              What's Next
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚀</span>
                  <p className="text-base sm:text-lg">Deploy to production environment</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔍</span>
                  <p className="text-base sm:text-lg">Implement search functionality</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <p className="text-base sm:text-lg">Add mobile app capabilities</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <p className="text-base sm:text-lg">Optimize performance and SEO</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}