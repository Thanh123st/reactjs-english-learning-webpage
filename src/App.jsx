import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useAutoRefresh } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PublicRoutes from "@/routes/PublicRoutes";
import ProtectedRoutes from "@/routes/ProtectedRoutes";

function AppContent() {
  const { isLoading, isAuthenticated, user } = useAuthContext();
  // Global auto-refresh session
  useAutoRefresh();

  console.log('🔍 App render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes luôn luôn có */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Khi đăng nhập thì có thêm ProtectedRoutes */}
        {isAuthenticated && (
          <Route path="/app/*" element={<ProtectedRoutes />} />
        )}
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
