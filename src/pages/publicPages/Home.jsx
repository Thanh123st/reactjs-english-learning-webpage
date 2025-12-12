import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthContext } from "@/hooks/useAuthContext";
import { PAGE_SEO, SEO_CONSTANTS } from "@/utils/seoConstants";
import { generateEducationalOrganizationSchema, generateWebsiteSchema, generateCanonicalUrl } from "@/utils/seoUtils";
import { 
  Rocket, 
  Target, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Star
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuthContext();
  const homeSeo = PAGE_SEO.HOME;
  
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <Helmet>
        <title>{homeSeo.title.vi}</title>
        <meta name="description" content={homeSeo.description.vi} />
        <meta name="keywords" content={homeSeo.keywords} />
        <link rel="canonical" href={generateCanonicalUrl()} />
        
        {/* Open Graph */}
        <meta property="og:title" content={homeSeo.title.en} />
        <meta property="og:description" content={homeSeo.description.en} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={generateCanonicalUrl()} />
        <meta property="og:image" content={`${SEO_CONSTANTS.SITE_URL}/og-image.jpg`} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />
        <meta property="og:locale" content="vi_VN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homeSeo.title.vi} />
        <meta name="twitter:description" content={homeSeo.description.vi} />
        <meta name="twitter:image" content={`${SEO_CONSTANTS.SITE_URL}/twitter-image.jpg`} />
        <meta name="twitter:site" content={SEO_CONSTANTS.TWITTER_HANDLE} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateEducationalOrganizationSchema())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateWebsiteSchema())}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section (Section 1 - light) */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Share Study Materials
                <br />
                <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">& English Q&A</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                Student community platform for sharing study materials, English Q&A, 
                vocabulary exercises and TOEIC/IELTS practice tests
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                <Link to={isAuthenticated ? "/app/dashboard" : "/login"}>
                  {isAuthenticated ? (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Get Started Free
                    </>
                  )}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">5K+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">2K+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Q&A Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Practice Tests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Section 2 - darker) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">CTUT English Hub</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Student community platform for sharing study materials, Q&A knowledge and effective English practice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Share Study Materials */}
            <Card className="group p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Share Study Materials</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  Upload and share English study materials: video lectures, PDF documents, vocabulary exercises, grammar with student community.
                </p>
                <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Upload PDF, Word, PowerPoint documents
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Share free video lectures
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Materials categorized by topics
                  </li>
                </ul>
              </div>
            </Card>

            {/* English Q&A */}
            <Card className="group p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">English Q&A</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  English Q&A forum for knowledge exchange between students. Ask questions and share effective learning experiences.
                </p>
                <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Ask questions and get answers from community
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Share effective learning experiences
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Discuss grammar and vocabulary
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm sm:text-base">
                  Join Community
                </Button>
              </div>
            </Card>

            {/* Practice & Tests */}
            <Card className="group p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Practice & Tests</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  Comprehensive English practice system: TOEIC tests, IELTS tests, vocabulary exercises, grammar to assess and improve your level.
                </p>
                <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Online TOEIC and IELTS tests
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Vocabulary and grammar exercises
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Level assessment and progress tracking
                  </li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base">
                  Start Practice
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section (Section 3 - light) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Ready to Start Your
            <br />
            <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Learning Journey</span>?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Join our student community and start sharing knowledge, asking questions, and practicing English together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
              <Link to={isAuthenticated ? "/app/dashboard" : "/login"}>
                {isAuthenticated ? (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>

        </div>
      </section>
      </div>
    </div>
  );
}
