import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import AdminDashboard from "@/pages/admin-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import CourseEditor from "@/pages/course-editor";
import CourseView from "@/pages/course-view";
import CourseEnrollment from "@/pages/course-enrollment";
import TopicLearning from "@/pages/topic-learning";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rrf-green"></div>
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="/" element={<Landing />} />
      ) : (
        <>
          {/* Dashboard Routes */}
          <Route path="/" element={
            user?.role === 'admin' ? <AdminDashboard /> :
            user?.role === 'instructor' ? <InstructorDashboard /> :
            <StudentDashboard />
          } />
          <Route path="/admin-dashboard" element={
            user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
          } />
          <Route path="/instructor-dashboard" element={
            user?.role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/" />
          } />
          <Route path="/student-dashboard" element={
            user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />
          } />

          {/* Course Routes */}
          <Route path="/course/:id/edit" element={
            user?.role === 'instructor' ? <CourseEditor /> : <Navigate to="/" />
          } />
          <Route path="/course/:courseId/topic/:chapterId" element={<TopicLearning />} />
          <Route path="/course/:id" element={<CourseView />} />
          <Route path="/course/:id/enroll" element={<CourseEnrollment />} />

          {/* Additional Routes */}
          <Route path="/my-learning" element={
            user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />
          } />
          <Route path="/my-courses" element={
            user?.role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/" />
          } />
          <Route path="/browse-courses" element={
            user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />
          } />
          <Route path="/progress" element={
            user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />
          } />
          <Route path="/settings" element={
            user?.role === 'admin' ? <AdminDashboard /> :
            user?.role === 'instructor' ? <InstructorDashboard /> :
            <StudentDashboard />
          } />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
