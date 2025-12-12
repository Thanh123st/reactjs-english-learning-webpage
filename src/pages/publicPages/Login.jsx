import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogin } from '@/hooks/useAuth';
import { loginWithGoogle } from '@/apis/apiAuthGoogle';
import { FileText, X, CheckCircle, Users, BookOpen, Award } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthContext();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const loginMutation = useLogin();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      
      console.log('🔍 Before login - cookies:', document.cookie);
      
      // Get Firebase idToken from Google Sign-In
      const { idToken } = await loginWithGoogle();
      console.log('🔑 Got Firebase idToken');
      
      // Send idToken to backend for authentication
      await loginMutation.mutateAsync(idToken);
      console.log('✅ Login successful');
      
      console.log('🔍 After login - cookies:', document.cookie);
      
      // Navigate to dashboard on success
      navigate('/app/dashboard');
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.log('🔍 After login error - cookies:', document.cookie);
      // You can add toast notification here
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <img
                className="mx-auto h-16 w-auto mb-8 dark:hidden"
                src="/logo-white.jpg"
                alt="CTUT English Hub"
              />
              <img
                className="mx-auto h-16 w-auto mb-8 hidden dark:block"
                src="/logo-black.jpg"
                alt="CTUT English Hub"
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Welcome to <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">CTUT English Hub</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Join our student community and start sharing knowledge, asking questions, and practicing English together.
              </p>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 sm:p-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Sign in to your account
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Continue your English learning journey
                </p>
              </div>

              <div className="space-y-6">
                {/* Google Sign-In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn || loginMutation.isPending}
                  className="w-full flex justify-center items-center px-6 py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  variant="outline"
                >
                  {isSigningIn || loginMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </div>
                  )}
                </Button>

                {/* Error Message */}
                {loginMutation.error && (
                  <div className="text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                      {loginMutation.error.response?.data?.message || 'Login failed. Please try again.'}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Join the learning community</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Track your progress</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Award className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <span>Practice with TOEIC/IELTS tests</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Terms and Privacy */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
              <p>
                By signing in, you agree to our{' '}
                <button 
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button 
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Privacy Policy
                </button>
              </p>
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h3>
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h3>
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
