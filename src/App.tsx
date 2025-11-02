import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationBanner } from "@/components/NotificationBanner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SkipLink } from "@/components/SkipLink";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { CACHE_TIMES } from "@/config/constants";

// Public routes - loaded immediately
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Members from "./pages/Members";
import Leaderboard from "./pages/Leaderboard";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Protected routes - lazy loaded
const Checkout = lazy(() => import("./pages/Checkout"));
const Order = lazy(() => import("./pages/Order"));
const Sell = lazy(() => import("./pages/Sell"));
const SellWOS = lazy(() => import("./pages/sell/SellWOS"));
const MyListings = lazy(() => import("./pages/MyListings"));
const Disputes = lazy(() => import("./pages/Disputes"));
const KYC = lazy(() => import("./pages/KYC"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Security = lazy(() => import("./pages/Security"));
const Wallet = lazy(() => import("./pages/Wallet"));

// Public lazy routes
const Suggestions = lazy(() => import("./pages/Suggestions"));
const Reviews = lazy(() => import("./pages/Reviews"));

// Admin routes - lazy loaded
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminListings = lazy(() => import("./pages/admin/Listings"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminDisputes = lazy(() => import("./pages/admin/Disputes"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
    <Loader2 className="h-8 w-8 animate-spin text-white/60" />
  </div>
);

// Configure React Query with proper defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.STALE_TIME,
      gcTime: CACHE_TIMES.CACHE_TIME, // Previously cacheTime
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <SkipLink />
            <NotificationBanner />
            <main id="main-content" tabIndex={-1}>
              <RouteErrorBoundary>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/members" element={<Members />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

              {/* Protected Routes - Require Authentication */}
              <Route
                path="/checkout"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Order />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/sell"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Sell />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/sell/wos"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <SellWOS />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <MyListings />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/disputes"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Disputes />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/kyc"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <KYC />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/notifications"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/security"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Security />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/wallet"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/suggestions"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Suggestions />
                  </Suspense>
                }
              />

              {/* Reviews - Public */}
              <Route path="/reviews/:userId" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Reviews />
                </Suspense>
              } />

              {/* Admin Routes - Require Admin Role */}
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  </Suspense>
                }
              >
                <Route
                  path="users"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminUsers />
                    </Suspense>
                  }
                />
                <Route
                  path="listings"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminListings />
                    </Suspense>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminOrders />
                    </Suspense>
                  }
                />
                <Route
                  path="disputes"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminDisputes />
                    </Suspense>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminNotifications />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminSettings />
                    </Suspense>
                  }
                />
              </Route>

                {/* 404 - Must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </RouteErrorBoundary>
            </main>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
