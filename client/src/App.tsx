/**
 * SonoTech Ultrasonic — React App Entry
 * This React app serves as the SPA shell.
 * All actual content pages are static HTML in /public/
 * The React router redirects to the correct static HTML pages.
 */
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Redirect component: sends the browser to the static HTML page
function StaticRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#2D3748" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #1B4F8A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }}></div>
        <p style={{ fontSize: "0.9rem", color: "#718096" }}>Loading…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// The root "/" path serves the static index.html from /public/
// All other routes are handled by the static HTML files directly.
// This component handles the case where someone lands on the React SPA root.
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <StaticRedirect to="/index.html" />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
