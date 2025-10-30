import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationListener } from "@/components/NotificationListener";
import { NotificationBanner } from "@/components/NotificationBanner";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import Members from "./pages/Members";
import Leaderboard from "./pages/Leaderboard";
import Auth from "./pages/Auth";
import Sell from "./pages/Sell";
import MyListings from "./pages/MyListings";
import Disputes from "./pages/Disputes";
import KYC from "./pages/KYC";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/admin/Users";
import AdminListings from "./pages/admin/Listings";
import AdminOrders from "./pages/admin/Orders";
import AdminDisputes from "./pages/admin/Disputes";
import AdminSettings from "./pages/admin/Settings";
import AdminNotifications from "./pages/admin/Notifications";
import About from "./pages/About";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NotificationListener />
      <BrowserRouter>
        <NotificationBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/members" element={<Members />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/disputes" element={<Disputes />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/admin" element={<Admin />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="disputes" element={<AdminDisputes />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
