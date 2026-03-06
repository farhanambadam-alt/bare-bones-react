import { useState } from 'react';
import { CalendarDays, Clock, MapPin, X, ChevronRight, Scissors } from 'lucide-react';
import { bookings as initialBookings } from '@/data/mockData';
import type { Booking } from '@/types/salon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const BookingsPage = () => {
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [bookingsList, setBookingsList] = useState<Booking[]>(initialBookings);

  const filtered = bookingsList.filter((b) => b.status === tab);

  const handleCancel = (id: string) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const tabs = [
    { key: 'upcoming' as const, label: 'Upcoming', count: bookingsList.filter(b => b.status === 'upcoming').length },
    { key: 'completed' as const, label: 'Completed', count: bookingsList.filter(b => b.status === 'completed').length },
    { key: 'cancelled' as const, label: 'Cancelled', count: bookingsList.filter(b => b.status === 'cancelled').length },
  ];

  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-6 pb-2">
        <h1 className="font-heading font-bold text-xl text-foreground">My Bookings</h1>
        <p className="text-xs font-body text-muted-foreground mt-0.5">Manage your appointments</p>
      </header>

      {/* Tab bar */}
      <div className="flex gap-2 px-5 py-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-heading font-medium capitalize transition-all duration-200 ${
              tab === t.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center ${
                tab === t.key ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="px-5 space-y-4 mt-1">
        {filtered.map((booking) => (
          <div
            key={booking.id}
            className="bg-card rounded-2xl overflow-hidden border border-border/50 animate-fade-in-up"
            style={{ boxShadow: '0 2px 12px -2px hsl(var(--foreground) / 0.06)' }}
          >
            {/* Image header with overlay */}
            <div className="relative h-28 overflow-hidden">
              <img
                src={booking.salonImage}
                alt={booking.salonName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-sm text-white">{booking.salonName}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-white/70" />
                    <span className="text-[10px] font-body text-white/70">Bangalore</span>
                  </div>
                </div>
                <span className={`text-[10px] font-heading font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                  booking.status === 'upcoming'
                    ? 'bg-primary/90 text-primary-foreground'
                    : booking.status === 'completed'
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-destructive/90 text-white'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Info section */}
            <div className="p-3.5">
              {/* Services */}
              <div className="flex items-start gap-2 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Scissors size={13} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-heading font-medium text-muted-foreground uppercase tracking-wide">Services</p>
                  <p className="text-[13px] font-body text-foreground mt-0.5 leading-snug">{booking.services.join(' • ')}</p>
                </div>
              </div>

              {/* Date & Time row */}
              <div className="flex gap-3 mb-3">
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-accent/60 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={13} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide">Date</p>
                    <p className="text-[12px] font-body font-medium text-foreground">{booking.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-accent/60 flex items-center justify-center flex-shrink-0">
                    <Clock size={13} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide">Time</p>
                    <p className="text-[12px] font-body font-medium text-foreground">{booking.time}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/60 mb-3" />

              {/* Footer: Price + Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide">Total</p>
                  <span className="font-heading font-bold text-base text-foreground">₹{booking.totalPrice}</span>
                </div>

                {booking.status === 'upcoming' && (
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="px-4 py-2 rounded-xl text-[11px] font-heading font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors min-h-[36px]">
                          Cancel
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl max-w-[320px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading text-base">Cancel Booking?</AlertDialogTitle>
                          <AlertDialogDescription className="font-body text-[13px]">
                            Are you sure you want to cancel your appointment at <strong>{booking.salonName}</strong> on {booking.date}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-2">
                          <AlertDialogCancel className="rounded-xl flex-1 mt-0 font-heading text-xs">Keep</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(booking.id)}
                            className="rounded-xl flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-heading text-xs"
                          >
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <button className="px-4 py-2 rounded-xl text-[11px] font-heading font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[36px] flex items-center gap-1">
                      Reschedule <ChevronRight size={12} />
                    </button>
                  </div>
                )}

                {booking.status === 'completed' && (
                  <button className="px-4 py-2 rounded-xl text-[11px] font-heading font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors min-h-[36px] flex items-center gap-1">
                    Rebook <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
              <CalendarDays size={28} className="text-muted-foreground/40" />
            </div>
            <p className="font-heading font-semibold text-sm text-foreground">No {tab} bookings</p>
            <p className="text-xs font-body text-muted-foreground/60 mt-1">Your bookings will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
