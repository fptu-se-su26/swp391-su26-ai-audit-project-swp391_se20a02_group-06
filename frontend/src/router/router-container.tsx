import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Pages - Public
import Landing from "../pages/public/Landing";
import Pricing from "../pages/public/Pricing";
import About from "../pages/public/About";

// Pages - Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminWorkouts from "../pages/admin/AdminWorkouts";
import AdminPTs from "../pages/admin/AdminPTs";
import AdminPlatform from "../pages/admin/AdminPlatform";
import AdminPayments from "../pages/admin/AdminPayments";

const RouterContainer = () => {
    useEffect(() => {
        window.history.scrollRestoration = "manual"; // Ngăn trình duyệt nhớ vị trí scroll
        window.scrollTo(0, 0);
    }, []);

    return (
        <Routes>
            {/* Public Homepage / Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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

            {/* Member Area Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/pt-booking" element={<PTBooking />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/profile" element={<Profile />} />

            {/* Default Route Redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default RouterContainer;
