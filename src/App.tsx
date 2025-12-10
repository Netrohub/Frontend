import { Suspense, lazy, useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NotificationBanner } from "@/components/NotificationBanner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SkipLink } from "@/components/SkipLink";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { CACHE_TIMES } from "@/config/constants";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { GlobalSearch } from "@/components/GlobalSearch";
import { QuickNav } from "@/components/QuickNav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { publicApi } from "@/lib/api";
import Maintenance from "./pages/Maintenance";
// Plasmic codegen imports
import Homepage from "@/components/Homepage";
// Use loader package for host page (needed for Plasmic Studio connection)
import { PlasmicCanvasHost } from "@plasmicapp/loader-react";
import { initPlasmicLoader } from "@plasmicapp/loader-react";
import { PLASMIC } from "./plasmic-init";
// Register components for Plasmic Studio (allows editing your existing components)
import "./plasmic-registration";

// Critical routes - loaded immediately (above the fold)
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import MarketplaceGames from "./pages/MarketplaceGames";
import MarketplaceGameCategory from "./pages/MarketplaceGameCategory";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Protected routes - critical pages loaded immediately
import Checkout from "./pages/Checkout";
import HyperPayPayment from "./pages/HyperPayPayment";
const HyperPayCallback = lazy(() => import("./pages/HyperPayCallback"));

// Public routes - lazy loaded (below the fold or less critical)
const Members = lazy(() => import("./pages/Members"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const About = lazy(() => import("./pages/About"));
const Help = lazy(() => import("./pages/Help"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Auctions = lazy(() => import("./pages/Auctions"));
const AuctionDetail = lazy(() => import("./pages/AuctionDetail"));

// Protected routes - lazy loaded
const Order = lazy(() => import("./pages/Order"));
const Gaming = lazy(() => import("./pages/sell/Gaming"));
const Social = lazy(() => import("./pages/sell/Social"));
const SellWOS = lazy(() => import("./pages/sell/SellWOS"));
const SellGame = lazy(() => import("./pages/sell/SellGame"));
const TikTok = lazy(() => import("./pages/sell/social/TikTok"));
const InstagramSell = lazy(() => import("./pages/sell/social/Instagram"));
const MyListings = lazy(() => import("./pages/MyListings"));
const Disputes = lazy(() => import("./pages/Disputes"));
const DisputeDetails = lazy(() => import("./pages/DisputeDetails"));
const Orders = lazy(() => import("./pages/Orders"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Security = lazy(() => import("./pages/Security"));
const Wallet = lazy(() => import("./pages/Wallet"));

// Public lazy routes
const Suggestions = lazy(() => import("./pages/Suggestions"));
const Reviews = lazy(() => import("./pages/Reviews"));
const SocialProductExample = lazy(() => import("./pages/SocialProductExample"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Admin routes - lazy loaded
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminListings = lazy(() => import("./pages/admin/Listings"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminDisputes = lazy(() => import("./pages/admin/Disputes"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminFinancial = lazy(() => import("./pages/admin/Financial"));
const AdminActivity = lazy(() => import("./pages/admin/Activity"));
const AdminKyc = lazy(() => import("./pages/admin/KYC"));
const Kyc = lazy(() => import("./pages/KYC"));
const AdminLegalContent = lazy(() => import("./pages/admin/LegalContent"));
const AdminWithdrawals = lazy(() => import("./pages/admin/Withdrawals"));
const AdminAuctions = lazy(() => import("./pages/admin/Auctions"));

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

// Maintenance check component
const MaintenanceCheck = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const location = useLocation();
  
  // Skip maintenance check for Plasmic host route (needed for Plasmic Studio to connect)
  const isPlasmicHost = location.pathname === '/plasmic-host';
  
  // Check maintenance mode (skip if admin or Plasmic host)
  const { data: maintenanceStatus, isLoading } = useQuery({
    queryKey: ['maintenance-status'],
    queryFn: () => publicApi.checkMaintenance(),
    enabled: !isAdmin && !isPlasmicHost, // Skip check for admins and Plasmic host
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1,
  });

  // Show loading while checking (only for non-admins, not for Plasmic host)
  if (!isAdmin && !isPlasmicHost && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  // Show maintenance page if enabled (but allow admins and Plasmic host to bypass)
  if (!isAdmin && !isPlasmicHost && maintenanceStatus?.maintenance_mode) {
    return <Maintenance />;
  }

  return <>{children}</>;
};

// Plasmic Studio host page (for codegen, uses react-web instead of loader)

// App content with keyboard shortcuts
const AppContent = () => {
  useKeyboardShortcuts();
  
  return (
    <MaintenanceCheck>
      <SkipLink />
      <NotificationBanner />
      <CookieConsentBanner />
      {/* <GlobalSearch /> */}
      <QuickNav />
      <main id="main-content" tabIndex={-1}>
        <RouteErrorBoundary>
          <Routes>
                {/* Public Routes */}
                {/* Original Home route - active until Plasmic design is ready */}
                <Route path="/" element={<Home />} />
                {/* Plasmic codegen Homepage - preview route while designing in Plasmic Studio */}
                {/* Access at /plasmic-homepage to see your Plasmic design */}
                <Route path="/plasmic-homepage" element={<Homepage />} />
                <Route path="/marketplace" element={<MarketplaceGames />} />
                <Route path="/marketplace/games" element={<MarketplaceGames />} />
                <Route path="/marketplace/:gameId" element={<MarketplaceGameCategory />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                {/* Temporarily hidden until bid portal is ready */}
                {/* <Route path="/auctions" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Auctions />
                  </Suspense>
                } />
                <Route path="/auction/:id" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AuctionDetail />
                  </Suspense>
                } /> */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/discord/callback" element={<Auth />} />
                <Route path="/members" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Members />
                  </Suspense>
                } />
                <Route path="/leaderboard" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Leaderboard />
                  </Suspense>
                } />
                <Route path="/about" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <About />
                  </Suspense>
                } />
                <Route path="/help" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Help />
                  </Suspense>
                } />
                <Route path="/terms" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Terms />
                  </Suspense>
                } />
                <Route path="/privacy" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Privacy />
                  </Suspense>
                } />
                <Route path="/refund-policy" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RefundPolicy />
                  </Suspense>
                } />
                <Route path="/verify-email" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <VerifyEmail />
                  </Suspense>
                } />
                <Route
                  path="/reset-password"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ResetPassword />
                    </Suspense>
                  }
                />
                <Route path="/social-product-example" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <SocialProductExample />
                  </Suspense>
                } />

              {/* Protected Routes - Require Authentication */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/hyperpay"
                element={
                  <ProtectedRoute>
                    <HyperPayPayment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/hyperpay/callback"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <HyperPayCallback />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Orders />
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
                path="/sell/gaming"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Gaming />
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
                path="/sell/kingshot"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <SellWOS />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/sell/:gameId"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <SellGame />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/sell/social"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Social />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/sell/social/tiktok"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <TikTok />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/sell/social/instagram"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <InstagramSell />
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
                path="/disputes/:id"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <DisputeDetails />
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
                path="/kyc"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProtectedRoute>
                      <Kyc />
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
                  path="withdrawals"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminWithdrawals />
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
                  path="reviews"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminReviews />
                    </Suspense>
                  }
                />
                <Route
                  path="financial"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminFinancial />
                    </Suspense>
                  }
                />
                <Route
                  path="kyc"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminKyc />
                    </Suspense>
                  }
                />
                <Route
                  path="activity"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminActivity />
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
                <Route
                  path="legal"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminLegalContent />
                    </Suspense>
                  }
                />
                <Route
                  path="auctions"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminAuctions />
                    </Suspense>
                  }
                />
              </Route>

            {/* Plasmic Studio host route - needed for Plasmic Studio to connect */}
            {/* Note: With codegen, we still need the loader for the host page */}
            <Route
              path="/plasmic-host"
              element={<PlasmicCanvasHost loader={PLASMIC} />}
            />

            {/* 404 - all unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteErrorBoundary>
      </main>
    </MaintenanceCheck>
  );
};

// Lazy load toast components to reduce initial bundle size
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

const App = () => {
  const [toastsReady, setToastsReady] = useState(false);

  // Load toast components after initial render to reduce blocking
  useEffect(() => {
    // Use requestIdleCallback to load toasts during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setToastsReady(true);
      }, { timeout: 1000 });
    } else {
      setTimeout(() => setToastsReady(true), 1000);
    }
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <CookieConsentProvider>
              <AuthProvider>
                <TooltipProvider>
                  {toastsReady && (
                    <Suspense fallback={null}>
                    <Toaster />
                    <Sonner />
                  </Suspense>
                )}
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
              </AuthProvider>
            </CookieConsentProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
