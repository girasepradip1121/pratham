import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CollegePredictor from "./pages/CollegePredictor";
import PlanConfirmation from "./pages/student/PlanConfirmation";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";
import AdvancedPredictor from "./pages/student/AdvancedPredictor";
import DataIngestion from "./pages/admin/DataIngestion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Student Auth Routes */}
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/login" replace />} />

        {/* Unified Dashboard Tab Redirection Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard defaultTab="overview" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentDashboard defaultTab="profile" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/documents"
          element={
            <ProtectedRoute>
              <StudentDashboard defaultTab="documents" />
            </ProtectedRoute>
          }
        />

        {/* Checkout Confirmation and Success */}
        <Route
          path="/plan-confirmation"
          element={
            <ProtectedRoute>
              <PlanConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

         {/* Public Predictors */}
        <Route path="/college-predictor" element={<CollegePredictor />} />

        {/* Premium Predictor */}
        <Route
          path="/student/advanced-predictor"
          element={
            <ProtectedRoute>
              <AdvancedPredictor />
            </ProtectedRoute>
          }
        />

        {/* Admin Panels */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/data-ingestion"
          element={
            <AdminRoute>
              <DataIngestion />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
