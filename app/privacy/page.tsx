import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - TANICE Blog',
  description: 'Privacy policy for TANICE Blog - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            <strong>Effective Date:</strong> January 9, 2026<br />
            <strong>Last Updated:</strong> January 9, 2026
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Contact Information
            </h2>
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Data Controller:</strong> TANICE Blog<br />
              <strong>Contact Email:</strong> privacy@taniceblog.com<br />
              <strong>Website:</strong> https://taniceblog.com
            </p>
          </div>

          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Information You Provide Directly</h3>
          <p>
            Currently, our blog operates as a read-only platform. We do not collect personal information directly from visitors through contact forms or user accounts. However, we may collect such information in the future if we implement:
          </p>
          <ul>
            <li>Contact forms (name, email address, message content)</li>
            <li>Newsletter subscriptions (email address)</li>
            <li>Comment systems (name, email, comment content)</li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <p>
            When you visit our website, we automatically collect certain information about your device and browsing behavior:
          </p>
          <ul>
            <li><strong>Technical Information:</strong> IP address, browser type and version, operating system, device type</li>
            <li><strong>Usage Information:</strong> Pages visited, time spent on pages, referring websites, click patterns</li>
            <li><strong>Blog Analytics:</strong> Page views for individual blog posts (stored anonymously)</li>
          </ul>

          <h3>1.3 Cookies and Tracking Technologies</h3>
          <p>
            We use essential cookies and similar technologies to:
          </p>
          <ul>
            <li>Ensure proper website functionality</li>
            <li>Remember your preferences (such as dark/light mode)</li>
            <li>Track blog post views for analytics purposes</li>
            <li>Maintain admin session security</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li><strong>Website Operation:</strong> To provide, maintain, and improve our blog services</li>
            <li><strong>Security:</strong> To protect against fraud, abuse, and security threats</li>
            <li><strong>Analytics:</strong> To understand how visitors use our site and improve user experience</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            <li><strong>Communication:</strong> To respond to inquiries (when contact features are implemented)</li>
          </ul>

          <h2>3. Legal Basis for Processing (GDPR)</h2>
          
          <p>For visitors from the European Union, we process your personal data based on:</p>
          <ul>
            <li><strong>Legitimate Interest:</strong> For website analytics, security, and improvement</li>
            <li><strong>Consent:</strong> For optional features like newsletters (when implemented)</li>
            <li><strong>Legal Obligation:</strong> When required to comply with applicable laws</li>
          </ul>

          <h2>4. Data Sharing and Third-Party Services</h2>
          
          <p>We share your information with the following third-party services that help us operate our website:</p>
          
          <h3>4.1 Hosting and Infrastructure</h3>
          <ul>
            <li><strong>Vercel:</strong> Website hosting and content delivery</li>
            <li><strong>MongoDB Atlas:</strong> Database hosting for blog content and analytics</li>
          </ul>

          <h3>4.2 Future Third-Party Services</h3>
          <p>We may integrate the following services in the future:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Website analytics and user behavior tracking</li>
            <li><strong>Email Service Providers:</strong> For newsletter and communication features</li>
            <li><strong>Comment Systems:</strong> For user engagement features</li>
          </ul>

          <p>
            All third-party services are carefully selected and required to maintain appropriate data protection standards.
          </p>

          <h2>5. Data Security</h2>
          
          <p>We implement appropriate security measures to protect your personal information:</p>
          <ul>
            <li>Secure HTTPS encry