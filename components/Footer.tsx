import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">
              TANICE
            </Link>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
              Practical insights on system design, data structures, career growth, and startup hiring from my experience in tech.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/TANICE-GAWD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/prince-tanice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/TANICE_GAWD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/system-design" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  System Design
                </Link>
              </li>
              <li>
                <Link href="/categories/dsa" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  DSA
                </Link>
              </li>
              <li>
                <Link href="/categories/linkedin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="/categories/interviews" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Interviews
                </Link>
              </li>
              <li>
                <Link href="/categories/startup-hiring" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Startup Hiring
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} TANICE Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}