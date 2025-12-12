import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useContact } from '@/hooks/useContact';
import { PAGE_SEO, SEO_CONSTANTS } from '@/utils/seoConstants';
import { generateCanonicalUrl } from '@/utils/seoUtils';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const contactSeo = PAGE_SEO.CONTACT;
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    content: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const contactMutation = useContact();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await contactMutation.mutateAsync(formData);
      setIsSubmitted(true);
      setFormData({ fullName: '', phoneNumber: '', email: '', content: '' });
    } catch (error) {
      console.error('Contact form error:', error);
    }
  };

  

  return (
    <>
      <Helmet>
        <title>{contactSeo.title.vi}</title>
        <meta name="description" content={contactSeo.description.vi} />
        <meta name="keywords" content={contactSeo.keywords} />
        <link rel="canonical" href={generateCanonicalUrl('/contact')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={contactSeo.title.en} />
        <meta property="og:description" content={contactSeo.description.en} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={generateCanonicalUrl('/contact')} />
        <meta property="og:image" content={`${SEO_CONSTANTS.SITE_URL}/og-contact.jpg`} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={contactSeo.title.vi} />
        <meta name="twitter:description" content={contactSeo.description.vi} />
        <meta name="twitter:image" content={`${SEO_CONSTANTS.SITE_URL}/twitter-contact.jpg`} />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      {/* Hero Section (Section 1 - light) */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Get in <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Touch</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      {/* Contact Form Section (Section 2 - darker) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Send us a <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Message</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          {isSubmitted ? (
            <Card className="p-6 sm:p-8 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Message Sent Successfully!</h3>
              <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-600 dark:text-gray-300">
                Thank you for contacting us. We'll get back to you as soon as possible.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
              >
                Send Another Message
              </Button>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>

                {/* Error Message */}
                {contactMutation.error && (
                  <div className="text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                      {contactMutation.error.response?.data?.message || 'Failed to send message. Please try again.'}
                    </div>
                  </div>
                )}
              </form>
            </Card>
          )}
        </div>
      </section>

      {/* FAQ Section (Section 3 - light) */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                question: "How quickly will I see results?",
                answer: "Most students notice improvement within 2-3 weeks of consistent practice. Our AI-powered system adapts to your pace and provides personalized feedback."
              },
              {
                question: "Do I need to be tech-savvy to use the platform?",
                answer: "Not at all! Our platform is designed to be intuitive and user-friendly. We provide step-by-step guides and 24/7 support to help you get started."
              },
              {
                question: "Is there a mobile app available?",
                answer: "Yes! Our mobile app is available for both iOS and Android, allowing you to learn on-the-go with full access to all features."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (Section 4 - darker) */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your English Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Join thousands of professionals who have transformed their English skills with CTUT English Hub.
          </p>
        </div>
      </section>
      </div>
    </>
  );
}
