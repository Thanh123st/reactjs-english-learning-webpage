import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Resources from "@/pages/publicPages/Resources";
import CollectionsList from "@/pages/publicPages/CollectionsList";
import LecturesList from "@/pages/publicPages/LecturesList";
import DocumentsList from "@/pages/publicPages/DocumentsList";
import SavedList from "@/pages/SavedList";
import Practice from "@/pages/publicPages/Practice";
import Community from "@/pages/publicPages/Community";
import QA from "@/pages/publicPages/QA";
import QADetail from "@/pages/publicPages/QADetail";

export default function ProtectedRoutes() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Routes>
          
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/collections" element={<CollectionsList />} />
          <Route path="resources/lectures" element={<LecturesList />} />
          <Route path="resources/documents" element={<DocumentsList />} />
          <Route path="dashboard/saved" element={<SavedList />} />
          <Route path="practice" element={<Practice />} />
          <Route path="community" element={<Community />} />
          <Route path="qa" element={<QA />} />
          <Route path="qa/:id" element={<QADetail />} />

        </Routes>
      </MainLayout>
    </ProtectedRoute>
  );
}
