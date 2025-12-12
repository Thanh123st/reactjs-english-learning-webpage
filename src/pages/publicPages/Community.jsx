import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAGE_SEO, SEO_CONSTANTS } from "@/utils/seoConstants";
import { generateCanonicalUrl, generateFAQSchema } from "@/utils/seoUtils";
import { X } from 'lucide-react';

export default function Community() {
  const communitySeo = PAGE_SEO.COMMUNITY;
  const [showDevModal, setShowDevModal] = useState(false);
  
  const discussionTopics = [
    {
      id: 'grammar-help',
      title: 'Grammar Help & Discussion',
      titleVi: 'Hỏi đáp Ngữ pháp',
      description: 'Ask questions about English grammar and get help from the community',
      descriptionVi: 'Đặt câu hỏi về ngữ pháp tiếng Anh và nhận sự giúp đỡ từ cộng đồng',
      posts: '2,500+',
      members: '1,200+',
      icon: '📝',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'toeic-ielts',
      title: 'TOEIC & IELTS Discussion',
      titleVi: 'Thảo luận TOEIC & IELTS',
      description: 'Share tips, strategies, and experiences for TOEIC and IELTS preparation',
      descriptionVi: 'Chia sẻ mẹo, chiến thuật và kinh nghiệm luyện thi TOEIC và IELTS',
      posts: '3,200+',
      members: '2,100+',
      icon: '🏆',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'speaking-practice',
      title: 'Speaking Practice Groups',
      titleVi: 'Nhóm Luyện Nói',
      description: 'Join speaking practice sessions and improve your conversational English',
      descriptionVi: 'Tham gia các buổi luyện nói và cải thiện kỹ năng giao tiếp tiếng Anh',
      posts: '1,800+',
      members: '850+',
      icon: '🗣️',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'writing-feedback',
      title: 'Writing Feedback & Review',
      titleVi: 'Góp ý và Đánh giá Bài viết',
      description: 'Get feedback on your writing and help others improve their English writing',
      descriptionVi: 'Nhận góp ý về bài viết và giúp đỡ người khác cải thiện kỹ năng viết',
      posts: '1,500+',
      members: '950+',
      icon: '✍️',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'vocabulary-building',
      title: 'Vocabulary Building',
      titleVi: 'Xây dựng Từ vựng',
      description: 'Share vocabulary tips, word lists, and memory techniques',
      descriptionVi: 'Chia sẻ mẹo từ vựng, danh sách từ và kỹ thuật ghi nhớ',
      posts: '2,100+',
      members: '1,400+',
      icon: '📚',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'study-groups',
      title: 'Study Groups & Partners',
      titleVi: 'Nhóm Học tập & Đối tác',
      description: 'Find study partners and join study groups for collaborative learning',
      descriptionVi: 'Tìm đối tác học tập và tham gia nhóm học tập để học cùng nhau',
      posts: '1,200+',
      members: '1,800+',
      icon: '👥',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const recentPosts = [
    {
      title: 'How to improve IELTS Writing Task 2?',
      titleVi: 'Làm thế nào để cải thiện IELTS Writing Task 2?',
      author: 'Minh Nguyen',
      replies: 15,
      views: '2.5k',
      timeAgo: '2 hours ago',
      category: 'IELTS'
    },
    {
      title: 'Best vocabulary books for TOEIC preparation',
      titleVi: 'Sách từ vựng tốt nhất cho luyện thi TOEIC',
      author: 'Lan Pham',
      replies: 8,
      views: '1.8k',
      timeAgo: '4 hours ago',
      category: 'TOEIC'
    },
    {
      title: 'Speaking practice session this weekend',
      titleVi: 'Buổi luyện nói cuối tuần này',
      author: 'David Chen',
      replies: 22,
      views: '3.2k',
      timeAgo: '6 hours ago',
      category: 'Speaking'
    }
  ];

  const faqs = [
    {
      question: "How do I join the community?",
      answer: "Simply create an account and start participating in discussions. You can join any topic that interests you and contribute to the community."
    },
    {
      question: "Are there any rules for posting?",
      answer: "Yes, we have community guidelines to ensure a positive learning environment. Be respectful, helpful, and stay on topic."
    },
    {
      question: "Can I ask for help with my homework?",
      answer: "Absolutely! Our community is here to help with English learning questions, including homework, assignments, and test preparation."
    },
    {
      question: "How often are new topics created?",
      answer: "New discussion topics are created regularly based on community needs and current English learning trends."
    }
  ];

  return (
    <>
      <Helmet>
        <title>{communitySeo.title.vi}</title>
        <meta name="description" content={communitySeo.description.vi} />
        <meta name="keywords" content={communitySeo.keywords} />
        <link rel="canonical" href={generateCanonicalUrl('/community')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={communitySeo.title.en} />
        <meta property="og:description" content={communitySeo.description.en} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={generateCanonicalUrl('/community')} />
        <meta property="og:image" content={`${SEO_CONSTANTS.SITE_URL}/og-community.jpg`} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={communitySeo.title.vi} />
        <meta name="twitter:description" content={communitySeo.description.vi} />
        <meta name="twitter:image" content={`${SEO_CONSTANTS.SITE_URL}/twitter-community.jpg`} />
        
        {/* FAQ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema(faqs))}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        {/* Hero Section (light) */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
              Learning <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Community</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Connect with fellow students, share experiences, and learn together in our supportive English learning community
            </p>
          </div>
        </section>

        {/* Community Stats (darker) */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">15K+</div>
                <div className="text-gray-600 dark:text-gray-300">Active Members</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600 dark:text-gray-300">Discussions</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">200+</div>
                <div className="text-gray-600 dark:text-gray-300">Study Groups</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Discussion Topics (light) */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Discussion <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Topics</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join conversations about various English learning topics
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {discussionTopics.map((topic) => (
                <Card key={topic.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className={`h-32 bg-gradient-to-r ${topic.color} flex items-center justify-center`}>
                    <span className="text-white text-4xl">{topic.icon}</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{topic.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">{topic.titleVi}</p>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      {topic.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 dark:text-gray-400">
                          📝 {topic.posts} posts
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          👥 {topic.members} members
                        </span>
                      </div>
                    </div>
                    
                    <Button onClick={() => setShowDevModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Join Discussion
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Posts (darker) */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Recent <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Posts</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Latest discussions and questions from our community
              </p>
            </div>

            <div className="grid gap-6">
              {recentPosts.map((post, index) => (
                <Card key={index} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {post.category}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{post.timeAgo}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-3">{post.titleVi}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>👤 {post.author}</span>
                        <span>💬 {post.replies} replies</span>
                        <span>👁️ {post.views} views</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setShowDevModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">View Post</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section (light) */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Questions</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Common questions about our learning community
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section (darker) */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our Community Today
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Connect with fellow learners, get help, and share your English learning journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => setShowDevModal(true)} className="bg-white text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-gray-200 dark:border-gray-700 px-8 py-4 text-lg font-semibold transition-all duration-300">
                🚀 Join Community Free
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
                We’re actively building this feature to provide the best learning experience. Please check back soon.
              </p>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm space-y-1 mb-6">
                <li>Discussion threads and replies</li>
                <li>Notifications and mentions</li>
                <li>Moderation and reporting tools</li>
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
