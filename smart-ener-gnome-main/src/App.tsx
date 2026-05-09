import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FullPageLoader } from "@/components/auth/FullPageLoader";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { LoginPage } from "./pages/auth/LoginPage.tsx";
import { SignupPage } from "./pages/auth/SignupPage.tsx";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage.tsx";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage.tsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";

const queryClient = new QueryClient();

const HomeRedirect = () => {
  const { loading, user } = useAuth();
  if (loading) return <FullPageLoader />;
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
