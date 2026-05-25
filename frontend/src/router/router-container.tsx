import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Pages - Public
import Landing from "../pages/public/Landing";
import Pricing from "../pages/public/Pricing";
import About from "../pages/public/About";

// Pages - Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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

            {/* Default Route Redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default RouterContainer;
