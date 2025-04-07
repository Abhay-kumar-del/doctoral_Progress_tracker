
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import SupervisorDashboardLayout from "./components/SupervisorDashboardLayout";
import CoordinatorDashboardLayout from "./components/CoordinatorDashboardLayout";
import Index from "./pages/Index";
import DCMeeting from "./pages/DCMeeting";
import Publications from "./pages/Publications";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";
import StoredFiles from "./pages/StoredFiles";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SupervisorDashboard from "./pages/supervisor/Index";
import CoordinatorDashboard from "./pages/coordinator/Index";
import CoordinatorPublications from "./pages/coordinator/Publications";
import CoordinatorExamResults from "./pages/coordinator/ExamResults";
import CoordinatorSwayamCourses from "./pages/coordinator/SwayamCourses";
import CoordinatorExamDates from "./pages/coordinator/ExamDates";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { userRole } = useAuth();
  
  if (userRole === 'supervisor') {
    return <Navigate to="/supervisor" replace />;
  } else if (userRole === 'coordinator') {
    return <Navigate to="/coordinator" replace />;
  }
  
  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="antialiased">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Student routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Index />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dc-meeting" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DCMeeting />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/publications" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Publications />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Courses />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/exams" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Exams />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/stored-files" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <StoredFiles />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Supervisor routes */}
              <Route path="/supervisor" element={
                <ProtectedRoute requiredRole="supervisor">
                  <SupervisorDashboardLayout>
                    <SupervisorDashboard />
                  </SupervisorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/supervisor/students" element={
                <ProtectedRoute requiredRole="supervisor">
                  <SupervisorDashboardLayout>
                    <SupervisorDashboard />
                  </SupervisorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/supervisor/dc-meetings" element={
                <ProtectedRoute requiredRole="supervisor">
                  <SupervisorDashboardLayout>
                    <DCMeeting />
                  </SupervisorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/supervisor/publications" element={
                <ProtectedRoute requiredRole="supervisor">
                  <SupervisorDashboardLayout>
                    <Publications />
                  </SupervisorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/supervisor/exams" element={
                <ProtectedRoute requiredRole="supervisor">
                  <SupervisorDashboardLayout>
                    <Exams />
                  </SupervisorDashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Coordinator routes */}
              <Route path="/coordinator" element={
                <ProtectedRoute requiredRole="coordinator">
                  <CoordinatorDashboardLayout>
                    <CoordinatorDashboard />
                  </CoordinatorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/coordinator/publications" element={
                <ProtectedRoute requiredRole="coordinator">
                  <CoordinatorDashboardLayout>
                    <CoordinatorPublications />
                  </CoordinatorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/coordinator/exam-results" element={
                <ProtectedRoute requiredRole="coordinator">
                  <CoordinatorDashboardLayout>
                    <CoordinatorExamResults />
                  </CoordinatorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/coordinator/swayam-courses" element={
                <ProtectedRoute requiredRole="coordinator">
                  <CoordinatorDashboardLayout>
                    <CoordinatorSwayamCourses />
                  </CoordinatorDashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/coordinator/exam-dates" element={
                <ProtectedRoute requiredRole="coordinator">
                  <CoordinatorDashboardLayout>
                    <CoordinatorExamDates />
                  </CoordinatorDashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
