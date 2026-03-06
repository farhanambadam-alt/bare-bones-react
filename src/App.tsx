import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GenderProvider } from "@/contexts/GenderContext";
import BottomNav from "@/components/BottomNav";
import GenderBackground from "@/components/GenderBackground";

/* Route-level code splitting — reduces initial JS parse time */
const Index = lazy(() => import("./pages/Index"));
const SalonDetail = lazy(() => import("./pages/SalonDetail"));
const BookingFlow = lazy(() => import("./pages/BookingFlow"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Offers = lazy(() => import("./pages/Offers"));
const Explore = lazy(() => import("./pages/Explore"));
const Profile = lazy(() => import("./pages/Profile"));
const AtHome = lazy(() => import("./pages/AtHome"));
const ArtistProfile = lazy(() => import("./pages/ArtistProfile"));
const AtHomeBooking = lazy(() => import("./pages/AtHomeBooking"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GenderProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative min-h-screen overflow-hidden">
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <GenderBackground />
            </div>
            <div className="relative z-0 max-w-7xl mx-auto md:px-8">
              <Suspense fallback={<div className="min-h-screen" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/salon/:id" element={<SalonDetail />} />
                  <Route path="/booking/:id" element={<BookingFlow />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/at-home" element={<AtHome />} />
                  <Route path="/artist/:id" element={<ArtistProfile />} />
                  <Route path="/at-home-booking/:id" element={<AtHomeBooking />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <BottomNav />
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </GenderProvider>
  </QueryClientProvider>
);

export default App;
