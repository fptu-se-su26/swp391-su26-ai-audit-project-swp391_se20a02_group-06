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
