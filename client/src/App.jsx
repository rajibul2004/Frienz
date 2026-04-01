import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";

import Navbar from "./layout/Navbar";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col ">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<div className="flex items-center justify-center h-full">Welcome to Frienz!</div>} />
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
