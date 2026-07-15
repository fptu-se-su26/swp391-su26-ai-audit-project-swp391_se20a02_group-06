import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Pages - Public
import Landing from "../pages/public/Landing";
import Pricing from "../pages/public/Pricing";
import About from "../pages/public/About";

// Pages - Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Pages - Member Area
import Dashboard from "../pages/member/Dashboard";
import Workouts from "../pages/member/Workouts";
import Nutrition from "../pages/member/Nutrition";
import Progress from "../pages/member/Progress";
import PTBooking from "../pages/member/PTBooking";
import AIChat from "../pages/member/AIChat";
import Profile from "../pages/member/Profile";

// Admin & PT Area
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminWorkouts from "../pages/admin/AdminWorkouts";
import AdminPTs from "../pages/admin/AdminPTs";
import AdminPlatform from "../pages/admin/AdminPlatform";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminPackages from "../pages/admin/AdminPackages";
import AdminExerciseRequests from "../pages/admin/AdminExerciseRequests";
import PtExerciseRequests from "../pages/pt/PtExerciseRequests";
import PTProfilePage from "../pages/pt/PTProfilePage";

const RouterContainer = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        window.history.scrollRestoration = "manual"; // Prevent browser from remembering scroll position
        window.scrollTo(0, 0);
    }, []);

    // Wrapper: redirects authenticated users away from auth pages
    const GuestRoute = ({ children }: { children: React.ReactNode }) => {
        if (isAuthenticated) {
            return <Navigate to="/dashboard" replace />;
        }
        return <>{children}</>;
    };

    return (
        <Routes>
            {/* Public Homepage / Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Auth Pages — redirect to dashboard if already logged in */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

            {/* Public Marketing Pages */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />

            {/* Admin & PT Area Routes */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <AdminRoute>
                        <AdminUsers />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/workouts"
                element={
                    <AdminRoute>
                        <AdminWorkouts />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/exercise-requests"
                element={
                    <AdminRoute>
                        <AdminExerciseRequests />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/pt-requests"
                element={
                    <AdminRoute>
                        <PtExerciseRequests />
                    </AdminRoute>
                }
            />
            <Route
                path="/pt/profile"
                element={
                    <PrivateRoute requiredRoles={['PT', 'PersonalTrainer']}>
                        <PTProfilePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/pts"
                element={
                    <AdminRoute>
                        <AdminPTs />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/platform"
                element={
                    <AdminRoute>
                        <AdminPlatform />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/payments"
                element={
                    <AdminRoute>
                        <AdminPayments />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/packages"
                element={
                    <AdminRoute>
                        <AdminPackages />
                    </AdminRoute>
                }
            />

            {/* Member Area Routes — Protected */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
            <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
            <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
            <Route path="/pt-booking" element={<PrivateRoute><PTBooking /></PrivateRoute>} />
            <Route path="/ai-chat" element={<PrivateRoute><AIChat /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* Default Route Redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default RouterContainer;