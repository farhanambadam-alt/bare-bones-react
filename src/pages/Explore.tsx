import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { featuredSalons, nearbySalons, categories } from '@/data/mockData';
import { useGender } from '@/contexts/GenderContext';

const allSalons = [...featuredSalons, ...nearbySalons];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { gender } = useGender();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort');

  const genderCategories = categories.filter(c => c.gender === gender);

  const matchedCategory = categoryParam
    ? genderCategories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase())?.id ?? null
    : null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(matchedCategory);

  useEffect(() => {
    setSelectedCategory(matchedCategory);
  }, [categoryParam, gender]);

  let filteredSalons = allSalons.filter(salon => {
    if (searchQuery) {
      return salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             salon.address.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  if (sortParam === 'nearby') {
    filteredSalons = [...filteredSalons].sort((a, b) => {
      const distA = parseFloat(a.distance) || 999;
      const distB = parseFloat(b.distance) || 999;
      return distA - distB;
    });
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Search */}
      <div className="sticky top-0 z-20 backdrop-blur-md border-b border-border/50 px-5 pt-5 pb-3">
        <h1 className="font-heading font-bold text-[18px] text-foreground mb-3">Explore</h1>
        <div className="flex items-center gap-2.5 bg-card border border-border rounded-2xl px-4 py-3.5 card-shadow">
          <Search size={17} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search salons, services..."
            className="flex-1 bg-transparent text-[14px] font-body text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="p-1.5 rounded-lg bg-secondary min-h-[36px] min-w-[36px] flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-[12px] font-heading font-semibold whitespace-nowrap transition-all min-h-[36px] ${
            !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          All
        </button>
        {genderCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
            className={`px-4 py-2 rounded-xl text-[12px] font-heading font-semibold whitespace-nowrap transition-all min-h-[36px] ${
              selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Salon Cards */}
      <div className="px-5 space-y-3 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
        {filteredSalons.map(salon => (
          <div
            key={salon.id}
            onClick={() => navigate(`/salon/${salon.id}`)}
            className="bg-card rounded-2xl overflow-hidden card-shadow border border-border active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="relative h-[180px]">
              <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" loading="lazy" />
              <span className={`absolute top-3 right-3 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                salon.isOpen ? 'bg-success/90 text-success-foreground' : 'bg-destructive/90 text-destructive-foreground'
              }`}>
                {salon.isOpen ? 'Open' : 'Closed'}
              </span>
              {salon.offer && (
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[11px] font-heading font-semibold px-3 py-1 rounded-lg">
                  {salon.offer}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-heading font-semibold text-[15px] text-foreground leading-tight">{salon.name}</h3>
                <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-lg flex-shrink-0 ml-2">
                  <Star size={11} className="text-accent fill-accent" />
                  <span className="text-[12px] font-heading font-semibold text-foreground">{salon.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <MapPin size={12} className="text-muted-foreground flex-shrink-0" />
                <span className="text-[13px] font-body text-muted-foreground">{salon.address}</span>
                <span className="text-muted-foreground text-[13px]">·</span>
                <span className="text-[13px] font-body text-muted-foreground">{salon.distance}</span>
              </div>
              <div className="flex items-center justify-between mt-3.5">
                <span className="text-[13px] text-muted-foreground font-body">From <span className="font-heading font-semibold text-foreground">₹{salon.startingPrice}</span></span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/salon/${salon.id}`); }}
                  className="text-[12px] font-heading font-semibold btn-themed px-5 py-2.5 rounded-xl min-h-[44px]"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSalons.length === 0 && (
          <div className="text-center py-16">
            <Search size={36} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-heading font-medium text-[14px] text-muted-foreground">No salons found</p>
            <p className="text-[12px] font-body text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
