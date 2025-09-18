// src/App.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom"; // <- changed
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Onboarding from "./Pages/Onboarding";
import Notification from "./Pages/Notification";
import Call from "./Pages/Call";
import Loader from "./Component/Loader";
import useAuthUser from "./Hooks/useauthUser"; // optional: rename if your export differs
import { Toaster } from "react-hot-toast";
import Layout from "./Component/Layout";
import ThemeStore from "./store/ThemeStore";
import ChatPage from "./Pages/Chat"; // keep one import

const App = () => {
  const { isLoading, authUser } = useAuthUser(); // make sure this matches your hook export
  const { mytheme } = ThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = Boolean(authUser?.onBoarding); // ensure correct property name

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen" data-theme={mytheme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <Home />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <Signup />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnBoarded ? (
                <Onboarding />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={false}>
                <Call />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/notification"
          element={
            isAuthenticated ? (
              <Layout showSidebar={true}>
                <Notification />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* fallback / 404 */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
