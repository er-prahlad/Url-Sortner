import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/ScrollToTop";

// Public pages
import { HomePage }     from "@/pages/HomePage";
import { PricingPage }  from "@/pages/PricingPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import { AboutPage }    from "@/pages/AboutPage";
import { BlogPage }     from "@/pages/BlogPage";
import { CareersPage }  from "@/pages/CareersPage";
import { PrivacyPage }  from "@/pages/PrivacyPage";
import { TermsPage }    from "@/pages/TermsPage";
import { ContactPage }  from "@/pages/ContactPage";
import { ApiDocsPage }  from "@/pages/ApiDocsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Auth pages
import { LoginPage }          from "@/pages/auth/LoginPage";
import { SignupPage }          from "@/pages/auth/SignupPage";
import { ForgotPasswordPage }  from "@/pages/auth/ForgotPasswordPage";

// Dashboard
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout";
import { OverviewPage }    from "@/pages/dashboard/OverviewPage";
import { MyLinksPage }     from "@/pages/dashboard/MyLinksPage";
import { AnalyticsPage }   from "@/pages/dashboard/AnalyticsPage";
import { QRCodesPage }     from "@/pages/dashboard/QRCodesPage";
import { SettingsPage }    from "@/pages/dashboard/SettingsPage";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>            {/* Public */}
            <Route path="/"          element={<HomePage />} />
            <Route path="/features"  element={<FeaturesPage />} />
            <Route path="/pricing"   element={<PricingPage />} />
            <Route path="/about"     element={<AboutPage />} />
            <Route path="/blog"      element={<BlogPage />} />
            <Route path="/careers"   element={<CareersPage />} />
            <Route path="/privacy"   element={<PrivacyPage />} />
            <Route path="/terms"     element={<TermsPage />} />
            <Route path="/contact"   element={<ContactPage />} />
            <Route path="/api-docs"  element={<ApiDocsPage />} />

            {/* Auth */}
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/signup"          element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Dashboard (protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index             element={<OverviewPage />} />
              <Route path="links"      element={<MyLinksPage />} />
              <Route path="analytics"  element={<AnalyticsPage />} />
              <Route path="qr-codes"   element={<QRCodesPage />} />
              <Route path="settings"   element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
