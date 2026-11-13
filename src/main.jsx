import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import App from "./SprintSMU.jsx";
import { AuthProvider } from "./context/AuthContext";
import { AuthForm } from "./components/AuthForm";
import { ProtectedRoute } from "./components/ProtectedRoute";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "YOUR_GROWTHBOOK_CLIENT_KEY", // Astra: Kunci klien GrowthBook
  enableDevMode: true,
});

// Hapus atau komentari blok di bawah ini
/*
Sentry.init({
  dsn: "YOUR_SENTRY_DSN_HERE", 
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
*/

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <GrowthBookProvider growthbook={growthbook}>
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
    </GrowthBookProvider>
  </AuthProvider>
);
