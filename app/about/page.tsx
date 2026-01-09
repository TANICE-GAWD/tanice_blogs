import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About - Tech Blog',
  description: 'Learn more about me, my background in tech, and why I write about system design, DSA, and career growth.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <Image
              src="/profile.jpg"
              alt="Profile"
              fill
              className="rounded-full object-cover"
              onError={(e) => {
                // Fallback to a placeholder if image doesn't exist
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMzIiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMCAyMS0yLTJtLTYtNmwtMi0yIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSI5Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Software engineer passionate about building scalable systems and helping others grow in their tech careers.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Journey</h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Hi! I'm a software engineer with over 5 years of experience building scalable web applications 
                and distributed systems. I've worked at both startups and large tech companies, giving me a 
                unique perspective on different engineering cultures and practices.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                My passion lies in system design, data structures & algorithms, and helping fellow developers 
                navigate their careers. I believe in learning by doing and sharing knowledge with the community.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What I Write About</h3>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🏗️</span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">System Design:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Scalable architecture patterns, distributed systems, and real-world design decisions
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">🧮</span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">DSA:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Data structures and algorithms explained with practical examples and use cases
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">💼</span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">LinkedIn & Networking:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Building your professional brand and growing your network in tech
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 dark:text-orange-400 mr-2">🎯</span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Interview Prep:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Technical interview strategies, coding challenges, and behavioral questions
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">🚀</span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Startup Hiring:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Insights into startup culture, hiring processes, and building engineering teams
                    </span>
                  </div>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Background</h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                I started my career as a frontend developer and gradually moved into full-stack development 
                and system architecture. I've had the opportunity to work on everything from consumer-facing 
                applications to backend infrastructure serving millions of users.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                When I'm not coding, you can find me mentoring junior developers, contributing to open source 
                projects, or exploring new technologies. I believe in continuous learning and staying curious 
                about emerging trends in tech.
              </p>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect With Me</h3>
                <div className="space-y-3">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Github size={20} className="mr-3" />
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Linkedin size={20} className="mr-3" />
                    LinkedIn
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Twitter size={20} className="mr-3" />
                    Twitter
                  </a>
                  <a
                    href="mailto:your.email@example.com"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Mail size={20} className="mr-3" />
                    Email
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 
                    'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Kubernetes'
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Connect!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            I'm always interested in connecting with fellow developers, discussing tech trends, 
            or helping with career advice. Feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Mail className="mr-2" size={20} />
              Send me an email
            </a>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Read my posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}