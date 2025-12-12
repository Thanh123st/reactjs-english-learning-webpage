import React from 'react';
import Header from '@/components/Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
    </div>
  );
}
