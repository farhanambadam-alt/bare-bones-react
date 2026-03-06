import { useState, useEffect } from 'react';
import { Search, MapPin, Bell, ChevronDown, Star, RotateCcw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CategoryChips from '@/components/CategoryChips';
import NearbySalonCard from '@/components/NearbySalonCard';
import { categories, featuredSalons, nearbySalons, bookings } from '@/data/mockData';
import { useGender } from '@/contexts/GenderContext';

const HomePage = () => {
  const { gender, setGender } = useGender();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const genderCategories = categories.filter((c) => c.gender === gender);
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setSelectedCategory(null);
  }, [gender]);

  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-52 bg-card rounded-2xl overflow-hidden card-shadow">
      <div className="h-32 skeleton-shimmer rounded-t-2xl" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 skeleton-shimmer rounded-full" />
        <div className="h-3 w-1/2 skeleton-shimmer rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden ring-2 ring-border">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
                decoding="async"
                width={40}
                height={40}
              />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground font-body leading-none">Welcome back</p>
              <p className="font-heading font-semibold text-[15px] text-foreground mt-0.5">Aarav</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded-xl">
              <MapPin size={13} className="text-primary" />
              <span className="text-[13px] font-body font-medium text-foreground">Bangalore</span>
              <ChevronDown size={11} className="text-muted-foreground" />
            </button>
            <button className="relative p-2.5 bg-card border border-border rounded-xl">
              <Bell size={17} className="text-foreground" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Gender Toggle + Heading */}
      <div className="px-5 pt-2 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-[26px] text-foreground italic leading-tight tracking-tight">
            {gender === 'female' ? 'Beauty & Wellness' : 'Grooming & Style'}
          </h1>
        </div>
        <div className="inline-flex bg-card border border-border rounded-xl p-0.5 relative">
          <div
            className="absolute top-0.5 bottom-0.5 rounded-[10px] bg-primary transition-all duration-300 ease-out"
            style={{
              width: 'calc(50% - 2px)',
              left: gender === 'male' ? '2px' : 'calc(50% + 0px)',
            }}
          />
          <button
            onClick={() => setGender('male')}
            className={`relative z-10 px-7 py-2 text-[13px] font-heading font-semibold rounded-[10px] transition-colors duration-200 ${
              gender === 'male' ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            Men
          </button>
          <button
            onClick={() => setGender('female')}
            className={`relative z-10 px-7 py-2 text-[13px] font-heading font-semibold rounded-[10px] transition-colors duration-200 ${
              gender === 'female' ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            Women
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-2">
        <button
          onClick={() => navigate('/explore')}
          className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 card-shadow"
        >
          <Search size={17} className="text-muted-foreground flex-shrink-0" />
          <span className="text-[14px] font-body text-muted-foreground">Search salons, services...</span>
        </button>
      </div>

      {/* Categories */}
      <div className="pt-3">
        <CategoryChips
          categories={genderCategories}
          selected={selectedCategory}
          onSelect={(id) => setSelectedCategory(id === selectedCategory ? null : id)}
        />
      </div>

      {/* Featured */}
      <div className="pt-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-heading font-semibold text-[16px] text-foreground">Featured Salons</h2>
          <button
            onClick={() => navigate('/explore?category=salon&sort=nearby')}
            className="text-[12px] font-heading font-medium text-primary flex items-center gap-0.5"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>
        {isLoading ? (
          <div className="mx-5 aspect-[16/10] skeleton-shimmer rounded-2xl" />
        ) : (
          <FeaturedCarousel salons={featuredSalons} />
        )}
      </div>

      {/* Nearby */}
      <div className="pt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-heading font-semibold text-[16px] text-foreground">Nearby</h2>
          <button
            onClick={() => navigate('/explore?category=salon&sort=nearby')}
            className="text-[12px] font-heading font-medium text-primary flex items-center gap-0.5"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible">
          {isLoading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : (
            nearbySalons.map((salon) => <NearbySalonCard key={salon.id} salon={salon} />)
          )}
        </div>
      </div>

      {/* Suggested */}
      <div className="pt-1 pb-2">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-heading font-semibold text-[16px] text-foreground">Suggested for You</h2>
        </div>
        <div className="px-5 space-y-2.5 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0">
          {!isLoading &&
            [...featuredSalons, ...nearbySalons].slice(0, 3).map((salon) => (
              <div
                key={salon.id}
                onClick={() => navigate(`/salon/${salon.id}`)}
                className="flex items-center gap-3.5 bg-card rounded-2xl p-3 card-shadow border border-border cursor-pointer active:scale-[0.98] transition-transform"
              >
                 <img
                   src={salon.image}
                   alt={salon.name}
                   className="w-[60px] h-[60px] rounded-xl object-cover flex-shrink-0"
                   decoding="async"
                   width={60}
                   height={60}
                 />
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-semibold text-[14px] text-foreground truncate">{salon.name}</h4>
                  <p className="text-[12px] font-body text-muted-foreground mt-0.5 truncate">{salon.address} · {salon.distance}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={11} className="text-accent fill-accent" />
                    <span className="text-[12px] text-foreground font-medium">{salon.rating}</span>
                    <span className="text-[11px] text-muted-foreground">· From ₹{salon.startingPrice}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/salon/${salon.id}`); }}
                  className="text-[12px] font-heading font-semibold btn-themed px-4 py-2 rounded-xl flex-shrink-0"
                >
                  Book
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Book Again */}
      {completedBookings.length > 0 && (
        <div className="pt-5 pb-3">
          <div className="flex items-center gap-2 px-5 mb-3">
            <RotateCcw size={15} className="text-primary" />
            <h2 className="font-heading font-semibold text-[16px] text-foreground">Book Again</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-3 scrollbar-hide">
            {completedBookings.map((booking) => (
              <div key={booking.id} className="flex-shrink-0 w-60 bg-card rounded-2xl p-3.5 card-shadow border border-border">
                <div className="flex items-center gap-3">
                  <img src={booking.salonImage} alt={booking.salonName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-semibold text-[13px] text-foreground truncate">{booking.salonName}</h4>
                    <p className="text-[11px] font-body text-muted-foreground truncate">{booking.services.join(', ')}</p>
                  </div>
                </div>
                <button className="w-full mt-3 text-[12px] font-heading font-semibold text-primary bg-primary/8 py-2.5 rounded-xl active:scale-95 transition-transform border border-primary/15">
                  Rebook
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
