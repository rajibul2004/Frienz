import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./layout/Navbar";
import Layout from "./layout/Layout";

import PrivateRoute from "./components/route/PrivateRoute";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Notification from "./pages/Notification";
import Friends from "./pages/Friends";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col ">
      {/* <Navbar /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout showSidebar={false}>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <Layout showSidebar={true}>
                <Notification />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <PrivateRoute>
              <Layout>
                <Friends />
              </Layout>
            </PrivateRoute>
          }
        />

      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </div>
  );
}

export default App;
