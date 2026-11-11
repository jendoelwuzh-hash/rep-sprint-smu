import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./SprintSMU.jsx";
import { AuthProvider } from "./context/AuthContext";
import { AuthForm } from "./components/AuthForm";
import { ProtectedRoute } from "./components/ProtectedRoute";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthForm type="login" />} />
        <Route path="/register" element={<AuthForm type="register" />} />
        <Route path="/" element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
