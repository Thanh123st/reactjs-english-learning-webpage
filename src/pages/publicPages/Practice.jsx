import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAGE_SEO, SEO_CONSTANTS } from "@/utils/seoConstants";
import { generateCanonicalUrl } from "@/utils/seoUtils";
import { X } from 'lucide-react';

export default function Practice() {
  const practiceSeo = PAGE_SEO.PRACTICE;
  const [showDevModal, setShowDevModal] = useState(false);
  
  const practiceTests = [
    {
      id: 'toeic-listening',
      title: 'TOEIC Listening Practice',
      titleVi: 'Luyện nghe TOEIC',
      description: 'Practice TOEIC listening comprehension with real test format',
      descriptionVi: 'Luyện tập nghe hiểu TOEIC với format thi thật',
      questions: 100,
      duration: '45 minutes',
      difficulty: 'Intermediate',
      attempts: '25,000+',
      icon: '🎧',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'toeic-reading',
      title: 'TOEIC Reading Practice',
      titleVi: 'Luyện đọc TOEIC',
      description: 'Practice TOEIC reading comprehension and grammar',
      descriptionVi: 'Luyện tập đọc hiểu và ngữ pháp TOEIC',
      questions: 100,
      duration: '75 minutes',
      difficulty: 'Intermediate',
      attempts: '22,000+',
      icon: '📖',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'ielts-listening',
      title: 'IELTS Listening Practice',
      titleVi: 'Luyện nghe IELTS',
      description: 'Practice IELTS listening with academic and general training',
      descriptionVi: 'Luyện tập nghe IELTS Academic và General Training',
      questions: 40,
      duration: '30 minutes',
      difficulty: 'Upper-Intermediate',
      attempts: '18,000+',
      icon: '🎵',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'ielts-reading',
      title: 'IELTS Reading Practice',
      titleVi: 'Luyện đọc IELTS',
      description: 'Practice IELTS reading with academic texts and questions',
      descriptionVi: 'Luyện tập đọc IELTS với văn bản học thuật',
      questions: 40,
      duration: '60 minutes',
      difficulty: 'Upper-Intermediate',
      attempts: '20,000+',
      icon: '📚',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'ielts-writing',
      title: 'IELTS Writing Practice',
      titleVi: 'Luyện viết IELTS',
      description: 'Practice IELTS writing tasks with sample essays',
      descriptionVi: 'Luyện tập viết IELTS với bài luận mẫu',
      questions: 2,
      duration: '60 minutes',
      difficulty: 'Advanced',
      attempts: '15,000+',
      icon: '✍️',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'ielts-speaking',
      title: 'IELTS Speaking Practice',
      titleVi: 'Luyện nói IELTS',
      description: 'Practice IELTS speaking with common topics and questions',
      descriptionVi: 'Luyện tập nói IELTS với chủ đề và câu hỏi thường gặp',
      questions: 3,
      duration: '15 minutes',
      difficulty: 'Advanced',
      attempts: '12,000+',
      icon: '🗣️',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const quickTests = [
    {
      title: 'Grammar Quick Test',
      titleVi: 'Kiểm tra Ngữ pháp Nhanh',
      questions: 20,
      duration: '10 minutes',
      difficulty: 'All Levels'
    },
    {
      title: 'Vocabulary Quiz',
      titleVi: 'Quiz Từ vựng',
      questions: 25,
      duration: '15 minutes',
      difficulty: 'Intermediate'
    },
    {
      title: 'Phrasal Verbs Test',
      titleVi: 'Kiểm tra Cụm động từ',
      questions: 30,
      duration: '20 minutes',
      difficulty: 'Upper-Intermediate'
    },
    {
      title: 'Idioms Challenge',
      titleVi: 'Thử thách Thành ngữ',
      questions: 15,
      duration: '10 minutes',
      difficulty: 'Advanced'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{practiceSeo.title.vi}</title>
        <meta name="description" content={practiceSeo.description.vi} />
        <meta name="keywords" content={practiceSeo.keywords} />
        <link rel="canonical" href={generateCanonicalUrl('/practice')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={practiceSeo.title.en} />
        <meta property="og:description" content={practiceSeo.description.en} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={generateCanonicalUrl('/practice')} />
        <meta property="og:image" content={`${SEO_CONSTANTS.SITE_URL}/og-practice.jpg`} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={practiceSeo.title.vi} />
        <meta name="twitter:description" content={practiceSeo.description.vi} />
        <meta name="twitter:image" content={`${SEO_CONSTANTS.SITE_URL}/twitter-practice.jpg`} />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        {/* Hero Section (light) */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
              Practice <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Tests</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Test your English skills with our comprehensive TOEIC and IELTS practice tests
            </p>
          </div>
        </section>

        {/* Quick Tests Section (darker) */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Quick <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Tests</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Take short tests to assess your English skills quickly
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickTests.map((test, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{test.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">{test.titleVi}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-semibold">{test.questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">{test.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{test.difficulty}</span>
                    </div>
                  </div>
                  
                  <Button onClick={() => setShowDevModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Start Test
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TOEIC Practice Tests (light) */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                TOEIC <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Practice</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive TOEIC test preparation with realistic practice tests
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {practiceTests.slice(0, 2).map((test) => (
                <Card key={test.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className={`h-32 bg-gradient-to-r ${test.color} flex items-center justify-center`}>
                    <span className="text-white text-4xl">{test.icon}</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{test.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">{test.titleVi}</p>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      {test.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Questions:</span>
                        <span className="ml-1 text-blue-600 dark:text-blue-400">{test.questions}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Duration:</span>
                        <span className="ml-1 text-blue-600 dark:text-blue-400">{test.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        👥 {test.attempts} attempts
                      </span>
                      <span className="text-green-600 font-semibold text-sm">
                        Level: {test.difficulty}
                      </span>
                    </div>
                    
                    <Button onClick={() => setShowDevModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Start Practice Test
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* IELTS Practice Tests (darker) */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                IELTS <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Practice</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive IELTS test preparation for all four skills
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {practiceTests.slice(2).map((test) => (
                <Card key={test.id} className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="text-center space-y-4">
                    <div className="text-4xl mb-2">{test.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{test.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{test.titleVi}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{test.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{test.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Attempts:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{test.attempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="font-semibold text-green-600">{test.difficulty}</span>
                      </div>
                    </div>
                    
                    <Button onClick={() => setShowDevModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Start IELTS Test
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section (light) */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Our <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Practice Tests</span>?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Real Test Format</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Practice tests designed to match the exact format and difficulty of real TOEIC and IELTS exams
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detailed Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get detailed feedback on your performance with score breakdowns and improvement suggestions
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔄</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Unlimited Attempts</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Practice as many times as you need to improve your score and build confidence
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section (darker) */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Test Your Skills?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Start practicing today and improve your TOEIC or IELTS scores
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => setShowDevModal(true)} className="bg-white text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-gray-200 dark:border-gray-700 px-8 py-4 text-lg font-semibold transition-all duration-300">
                🚀 Start Practicing Free
              </Button>
              <Button onClick={() => setShowDevModal(true)} variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-4 text-lg font-semibold">
                💬 Get Help
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Development Modal */}
      {showDevModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0" onClick={() => setShowDevModal(false)} />
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-w-lg w-full relative z-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Feature in Development</h3>
                <button onClick={() => setShowDevModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We’re actively building this section to deliver high-quality test experiences. Please check back soon.
              </p>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm space-y-1 mb-6">
                <li>Auto-scoring and analytics</li>
                <li>Timed practice with pauses</li>
                <li>Question review and explanations</li>
              </ul>
              <div className="text-right">
                <Button onClick={() => setShowDevModal(false)} className="bg-blue-600 hover:bg-blue-700 text-white">Got it</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
