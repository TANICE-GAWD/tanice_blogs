import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Users, 
  DollarSign, 
  Zap, 
  Code, 
  Briefcase, 
  Target,
  TrendingUp,
  Globe,
  Rocket,
  Award,
  Building,
  MapPin
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | TANICE - Software Engineer & Technical Writer',
  description: 'Learn about Prince Tanice, a Software Engineer experienced in scaling US startup products, AI IDE development, and go-to-market strategies.',
  keywords: 'software engineer, startup scaling, AI IDE, DevSwarm, technical writing, go-to-market, SWE',
};

export default function AboutPage() {
  const achievements = [
    {
      icon: Users,
      value: '8,000+',
      label: 'Users Scaled',
      description: 'Successfully scaled startup products to serve thousands of active users'
    },
    {
      icon: DollarSign,
      value: '$14,000',
      label: 'Revenue Processed',
      description: 'Handled significant transaction volumes in production systems'
    },
    {
      icon: Zap,
      value: '2,000+',
      label: 'Concurrent Users',
      description: 'Built systems capable of handling high concurrent load'
    }
  ];

  const experiences = [
    {
      icon: Code,
      title: 'Distributed IDE Intern',
      company: 'DevSwarm',
      location: 'Oregon, USA',
      period: 'Dec 2025 - Present',
      description: 'Closed 12 integration partnerships, generating $47K ARR. Successful "Show HN" campaign that drove a 5X surge in organic sign-ups. Deployed integration guides, reducing support tickets by 35%.',
      skills: ['Integration Partnerships', 'Developer Relations', 'Technical Documentation', 'Growth Marketing']
    },
    {
      icon: Briefcase,
      title: 'Freelancer',
      company: 'Independent',
      location: 'Remote',
      period: 'Oct 2025 - Present',
      description: 'Developed over 5 MVPs for early-stage startups. Launched a commercial real-estate portfolio site. Delivered custom apps for PhD Institutes (e.g., PGIMER Chandigarh) to streamline research data processing. Successfully processed over 1,500 team registrations for a drone-racing hackathon by integrating Spline 3D drone animations and a Python backend.',
      skills: ['MVP Development', 'Real Estate Tech', 'Research Data Processing', 'Custom Applications']
    },
    {
      icon: Rocket,
      title: 'Intern @ MindSpace',
      company: 'MindSpace',
      location: 'Remote',
      period: 'Sep 2025 - Nov 2025',
      description: 'Integrated one game powered by AI recognition and another utilizing OpenCV for visual processing. Optimized KPIs for the main website which cut API request latency using Redis by 15% and improved page load speed by 10%.',
      skills: ['AI Integration', 'Computer Vision', 'Performance Optimization', 'Redis Caching']
    }
  ];

  const techStack = [
    // Programming Languages
    'React Native', 'Flutter', 'TypeScript', 'HTML5', 'CSS', 'JavaScript', 'SQL', 'Python',
    // Frameworks
    'Express.js', 'React.js', 'Next.js', 'Three.js', 'Tailwind CSS', 'Module CSS',
    // Databases & Cloud
    'MongoDB', 'Firebase', 'DigitalOcean', 'PhoneP+',
    // Developer Tools
    'Redis', 'Postman', 'Git', 'VS Code', 'Firebase', 'OAuth'
  ];

  const interests = [
    { icon: Building, title: 'System Design', description: 'Architecting scalable distributed systems' },
    { icon: Target, title: 'Startup Growth', description: 'Scaling products from 0 to thousands of users' },
    { icon: Globe, title: 'Technical Writing', description: 'Sharing knowledge through detailed blog posts' },
    { icon: Award, title: 'Mentoring', description: 'Helping developers grow their careers' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            {/* Profile Picture */}
            <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <Image
                src="/LinkedIn_Pic.jpg"
                alt="Prince Tanice"
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Prince Tanice
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            Software Engineer experienced in scaling US startup products, AI IDE development, 
            and bridging the gap between technical excellence and market success.
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <a
              href="https://github.com/TANICE-GAWD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/prince-tanice"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              LinkedIn
            </a>
            <a
              href="https://x.com/TANICE_GAWD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Twitter className="h-5 w-5 mr-2" />
              Twitter
            </a>
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Key Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                  <achievement.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {achievement.value}
                </h3>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {achievement.label}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Experience */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Professional Experience
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <exp.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          {exp.location}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {exp.period}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {exp.description.split('. ').map((sentence, sentenceIndex) => (
                        <p key={sentenceIndex} className="mb-2">
                          • {sentence}{sentence.endsWith('.') ? '' : '.'}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Technical Stack
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3 justify-center">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interests & Focus Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Areas of Interest
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interests.map((interest, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <interest.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {interest.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}