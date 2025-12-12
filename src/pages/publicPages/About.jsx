import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAGE_SEO, SEO_CONSTANTS } from "@/utils/seoConstants";
import { generateCanonicalUrl, generateEducationalOrganizationSchema } from "@/utils/seoUtils";
import { FileText, Target, Rocket, CheckCircle, X, Users, BookOpen, Award } from 'lucide-react';

export default function About() {
  const aboutSeo = PAGE_SEO.ABOUT;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'CTUT English Hub platform launched to facilitate student knowledge sharing'
    },
    {
      year: '2021',
      title: 'Q&A System',
      description: 'Implemented comprehensive Q&A system for English learning support'
    },
    {
      year: '2022',
      title: 'Practice Tests',
      description: 'Added TOEIC and IELTS practice test system'
    },
    {
      year: '2023',
      title: 'Community Growth',
      description: 'Reached 10,000+ active users sharing knowledge and materials'
    },
    {
      year: '2024',
      title: 'Community Expansion',
      description: 'Expanded community features and peer learning programs'
    }
  ];

  const values = [
    {
      title: 'Student-Centered',
      description: 'We prioritize student needs and create tools that enhance their learning experience',
      icon: Users
    },
    {
      title: 'Knowledge Sharing',
      description: 'We believe in the power of collaborative learning and peer knowledge exchange',
      icon: BookOpen
    },
    {
      title: 'Quality Content',
      description: 'We maintain high standards for all shared materials and Q&A content',
      icon: Award
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Sign Up & Join",
      description: "Create your account and join our student community to start sharing knowledge",
      icon: FileText
    },
    {
      step: "02",
      title: "Share Materials",
      description: "Upload and share your study materials, ask questions, and help others learn",
      icon: Target
    },
    {
      step: "03",
      title: "Practice Together",
      description: "Take practice tests, participate in discussions, and improve your English skills",
      icon: Rocket
    }
  ];

  return (
    <>
      <Helmet>
        <title>{aboutSeo.title.en}</title>
        <meta name="description" content={aboutSeo.description.en} />
        <meta name="keywords" content={aboutSeo.keywords} />
        <link rel="canonical" href={generateCanonicalUrl('/about')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={aboutSeo.title.en} />
        <meta property="og:description" content={aboutSeo.description.en} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={generateCanonicalUrl('/about')} />
        <meta property="og:image" content={`${SEO_CONSTANTS.SITE_URL}/og-about.jpg`} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={aboutSeo.title.en} />
        <meta name="twitter:description" content={aboutSeo.description.en} />
        <meta name="twitter:image" content={`${SEO_CONSTANTS.SITE_URL}/og-about.jpg`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateEducationalOrganizationSchema())}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        {/* Hero Section */}
        {/* Section 1 - light */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              About <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">CTUT English Hub</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Student community platform for sharing study materials, English Q&A and practice
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        {/* Section 2 - darker */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
              <Card className="p-6 sm:p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    To create a collaborative learning platform where students can share study materials, ask questions, and practice English together in a supportive community environment.
                  </p>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    To become Vietnam's leading student-driven English learning community, where knowledge sharing and peer support create meaningful learning experiences.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        {/* Section 3 - light */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                How It <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Works</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Get started in just 3 simple steps and begin your collaborative learning journey today.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center space-y-3 sm:space-y-4 group">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto text-lg sm:text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700">
                      <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        {/* Section 4 - darker */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Our <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Values</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The principles that guide our platform and community
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{value.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        {/* Section 5 - light */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Our <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Journey</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Key milestones in our platform's development and community growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-lg sm:text-2xl font-bold">
                    {milestone.year}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Section */}
        {/* Section 6 - darker */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
              Legal Information
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
              Important information about our terms of service and privacy policy
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                onClick={() => setShowTermsModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold"
              >
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Button>
              <Button
                onClick={() => setShowPrivacyModal(true)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold"
              >
                <FileText className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* CTA - light */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Ready to Join Our
              <br />
              <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Community</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Start sharing knowledge, asking questions, and practicing English with fellow students today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                <Link to="/login">
                  <Rocket className="w-4 h-4 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>

          </div>
        </section>
      </div>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowTermsModal(false)}
          />
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Terms of Service</h3>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h4>
                  <p>By accessing and using CTUT English Hub, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">2. Use License</h4>
                  <p>Permission is granted to temporarily download one copy of the materials on CTUT English Hub for personal, non-commercial transitory viewing only.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">3. User Content</h4>
                  <p>Users are responsible for the content they share. All shared materials should be educational and appropriate for the learning community.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">4. Community Guidelines</h4>
                  <p>Users must respect other community members, maintain a positive learning environment, and follow academic integrity standards.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">5. Privacy</h4>
                  <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the platform.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">6. Modifications</h4>
                  <p>CTUT English Hub may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms.</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setShowTermsModal(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowPrivacyModal(false)}
          />
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Privacy Policy</h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="text-lg font-semibold mb-2">1. Information We Collect</h4>
                  <p>We collect information you provide directly to us, such as when you create an account, share materials, or participate in discussions.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">2. How We Use Information</h4>
                  <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure platform security.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">3. Information Sharing</h4>
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">4. Data Security</h4>
                  <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">5. Your Rights</h4>
                  <p>You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">6. Contact Us</h4>
                  <p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setShowPrivacyModal(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}