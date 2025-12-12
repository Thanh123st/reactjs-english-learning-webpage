import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogout } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Home, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  MessageCircle,
  BookOpen,
  Info,
  Play, 
  Users,
  Mail
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthContext();
  const { toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      navigate('/');
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-start justify-start">
            <Link to={isAuthenticated ? "/app/dashboard" : "/"} className="flex items-center space-x-2">
              {/* giữ logo chồng nhau nhưng KHÔNG đẩy xa chữ */}
              <span className="relative h-8 w-8 flex-shrink-0">
                <img
                  src="/logo-white.jpg"
                  alt="English Learning"
                  className="block h-8 w-8 object-contain dark:hidden"
                />
                <img
                  src="/logo-black.jpg"
                  alt="English Learning"
                  className="absolute inset-0 h-8 w-8 object-contain hidden dark:block"
                />
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                CTUT English Hub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActivePath('/')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActivePath('/about')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
            
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActivePath('/contact')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/app/dashboard"
                  className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActivePath('/app/dashboard')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/app/resources"
                  className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActivePath('/app/resources')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Resources</span>
                </Link>
                
                <Link
                  to="/app/qa"
                  className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActivePath('/app/qa')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Q&A</span>
                </Link>
                
                <Link
                  to="/app/practice"
                  className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActivePath('/app/practice')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Practice</span>
                </Link>
                
                <Link
                  to="/app/community"
                  className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActivePath('/app/community')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                </Link>
              </>
            ) : null}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </Button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user?.name || 'User avatar'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </div>
                  )}
                  {/* tránh tràn layout nếu tên đầu quá dài */}
                  <span className="hidden sm:block text-gray-700 dark:text-gray-300 font-medium truncate max-w-[100px]" title={user?.name}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    {/* Header: tên + email có truncate */}
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="font-medium truncate" title={user?.name}>
                        {user?.name || 'Unnamed User'}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs truncate" title={user?.email}>
                        {user?.email || 'No email'}
                      </div>
                    </div>
                    <Link
                      to="/app/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to="/app/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{logoutMutation.isPending ? 'Signing out...' : 'Sign out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Sign in
                </Link>
                <Button asChild>
                  <Link
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  to="/login">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Open mobile menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  
                  <Link
                    to="/about"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </Link>
                  <Link
                    to="/app/dashboard"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/app/resources"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Resources</span>
                  </Link>
                  <Link
                    to="/app/qa"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Q&A</span>
                  </Link>
                  <Link
                    to="/app/practice"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Play className="w-4 h-4" />
                    <span>Practice</span>
                  </Link>
                  <Link
                    to="/app/community"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    <span>Community</span>
                  </Link>
                  <Link
                    to="/app/profile"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{logoutMutation.isPending ? 'Signing out...' : 'Sign out'}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center space-x-2 block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </Link>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
}
