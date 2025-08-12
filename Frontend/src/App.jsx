import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Onboarding from "./Pages/Onboarding";
import Notification from "./Pages/Notification";
import Chat from "./Pages/Chat";
import Call from "./Pages/Call";
import Loader from "./Component/Loader";
import useauthUser from "./Hooks/useauthUser";
import { Toaster } from "react-hot-toast";
import Layout from "./Component/Layout";
import usethemeStore from "./store/usethemeStore";

const App = () => {
  const { isLoading, authUser } = useauthUser();
  const { mytheme } = usethemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.onBoarding;

  if (isLoading) {
    return <Loader />;
  }

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
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <Signup />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
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
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <Chat /> : <Navigate to="/Login" />}
        />
        <Route
          path="/call"
          element={isAuthenticated ? <Call /> : <Navigate to="/Login" />}
        />
        <Route
          path="/notification"
          element={
            isAuthenticated ? <Notification /> : <Navigate to="/Login" />
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
