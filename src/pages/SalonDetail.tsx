import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Plus, Minus, Navigation, Heart, ShieldCheck, ChevronRight, ChevronDown, Share2, Scissors, Sparkles, Award, Play, Image as ImageIcon } from 'lucide-react';
import ReviewsSection from '@/components/ReviewsSection';
import { useNavigate, useParams } from 'react-router-dom';
import { featuredSalons, nearbySalons, services, artists, reviews } from '@/data/mockData';
import { useGender } from '@/contexts/GenderContext';
import { MediaThumbnail, FullEmbed, type MediaSource } from '@/components/EmbeddedMedia';
import { Skeleton } from '@/components/ui/skeleton';

/* ── service image map ── */
const serviceImages: Record<string, string> = {
  'Haircut & Styling': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&h=200&fit=crop',
  'Beard Trim': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop',
  'Hair Color': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop',
  'Facial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop',
  'Hair Spa': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop',
  'Bridal Makeup': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
  'Manicure & Pedicure': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop',
  'Threading': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=200&fit=crop',
  'Groom Package': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop',
  'Bridal Package': 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=200&fit=crop',
};

/* ── artist extended data ── */
const artistDetails: Record<string, { experience: string; services: string[] }> = {
  '1': { experience: '8 years', services: ['Hair Spa', 'Hair Color', 'Haircut & Styling'] },
  '2': { experience: '6 years', services: ['Hair Color', 'Highlights', 'Balayage'] },
  '3': { experience: '10 years', services: ['Bridal Makeup', 'Party Makeup', 'Skin Care'] },
  '4': { experience: '5 years', services: ['Haircut & Styling', 'Beard Trim', 'Shaving'] },
  '5': { experience: '7 years', services: ['Facial', 'Skin Care', 'Anti-aging'] },
  '6': { experience: '4 years', services: ['Haircut & Styling', 'Hair Color'] },
  '7': { experience: '6 years', services: ['Manicure & Pedicure', 'Nail Art', 'Gel Nails'] },
  '8': { experience: '5 years', services: ['Hair Color', 'Highlights', 'Ombre'] },
};

/* ── Bento thumbnail with skeleton fallback ── */ 
const BentoThumb = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={error ? '/placeholder.svg' : src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true); }}
      />
    </>
  );
};

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { gender, setGender } = useGender();
  const salon = [...featuredSalons, ...nearbySalons].find((s) => s.id === id) || featuredSalons[0];

  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'reviews' | 'gallery' | 'packages' | 'offers'>('services');
  const [isFavorite, setIsFavorite] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [showHours, setShowHours] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* ── Working hours data ── */
  const workingHours = [
    { day: 'Monday', time: '9:00 AM – 9:00 PM' },
    { day: 'Tuesday', time: '9:00 AM – 9:00 PM' },
    { day: 'Wednesday', time: '9:00 AM – 9:00 PM' },
    { day: 'Thursday', time: '9:00 AM – 9:00 PM' },
    { day: 'Friday', time: '9:00 AM – 9:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 8:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  /* ── Bento gallery media — real embeddable URLs ── */
  const bentoMedia: MediaSource[] = [
    { type: 'image', src: salon.image },
    { type: 'youtube', videoId: 'D0UnqGm_miA', thumbnail: 'https://i.ytimg.com/vi/D0UnqGm_miA/hqdefault.jpg' },
    { type: 'instagram-reel', reelId: 'C1234example', thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop' },
    { type: 'youtube', videoId: 'Mv7TC6sav6E', thumbnail: 'https://i.ytimg.com/vi/Mv7TC6sav6E/hqdefault.jpg' },
    { type: 'instagram-post', postId: 'CxYZexample', thumbnail: 'https://images.unsplash.com/photo-1521590832167-7228fcaeb733?w=400&h=400&fit=crop' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=400&fit=crop' },
  ];

  /* ── Hero carousel state ── */
  const heroImages = [
    salon.image,
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=500&fit=crop',
  ];
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  const nextHero = useCallback(() => {
    setHeroIdx((i) => (i + 1) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroPaused) return;
    const t = setInterval(nextHero, 4000);
    return () => clearInterval(t);
  }, [heroPaused, nextHero]);

  /* ── Service tab derived from gender ── */
  const serviceTab = gender === 'female' ? 'women' : 'men';
  const filteredServices = services.filter((s) => s.category === serviceTab || s.category === 'packages');

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((total, [sId, qty]) => {
    const service = services.find((s) => s.id === sId);
    return total + (service?.price || 0) * qty;
  }, 0);

  const addToCart = (serviceId: string) => {
    setCart((c) => ({ ...c, [serviceId]: (c[serviceId] || 0) + 1 }));
  };

  const removeFromCart = (serviceId: string) => {
    setCart((c) => {
      const n = { ...c };
      if (n[serviceId] > 1) n[serviceId]--;
      else delete n[serviceId];
      return n;
    });
  };

  const galleryImages = [
    salon.image,
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1521590832167-7228fcaeb733?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=600&fit=crop',
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* ── Hero Carousel ── */}
      <div
        className="relative h-[280px] md:h-[400px] md:max-h-96 overflow-hidden rounded-b-[28px] md:rounded-2xl md:mx-0 md:mt-4"
        onTouchStart={(e) => {
          setHeroPaused(true);
          (e.currentTarget as any)._touchX = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          setHeroPaused(false);
          const startX = (e.currentTarget as any)._touchX;
          if (startX == null) return;
          const diff = startX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) setHeroIdx((i) => (i + 1) % heroImages.length);
            else setHeroIdx((i) => (i - 1 + heroImages.length) % heroImages.length);
          }
        }}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${heroIdx * 100}%)` }}
        >
          {heroImages.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0">
              <img src={img} alt={`${salon.name} ${i + 1}`} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent pointer-events-none" />

        {/* Nav buttons */}
        <div className="absolute top-0 left-0 right-0 pt-[env(safe-area-inset-top)] px-4 pt-4 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-border/30 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-border/30 min-h-[44px] min-w-[44px]"
          >
            <Heart size={16} className={isFavorite ? 'text-destructive fill-destructive' : 'text-foreground'} />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-10 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-border/30">
          <Star size={13} className="text-accent fill-accent" />
          <span className="text-[13px] font-heading font-semibold text-foreground">{salon.rating}</span>
          <span className="text-[11px] text-muted-foreground">({salon.reviewCount})</span>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === heroIdx ? 'w-5 bg-primary-foreground' : 'w-1.5 bg-primary-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Salon Info */}
      <div className="px-5 pt-5 pb-3 animate-fade-in-up" style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
        <h1 className="font-heading font-bold text-[20px] text-foreground leading-tight">{salon.name}</h1>
        <div className="flex items-center gap-2 mt-2.5">
          <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-[13px] font-body text-muted-foreground">{salon.address}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <Clock size={14} className="text-muted-foreground flex-shrink-0" />
          <span className={`text-[13px] font-body font-medium ${salon.isOpen ? 'text-success' : 'text-destructive'}`}>
            {salon.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {salon.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-heading font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-primary/12">
              {tag === 'Verified' && <ShieldCheck size={11} />}
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-border">
          <button className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full btn-themed flex items-center justify-center active:scale-90 transition-transform flex-shrink-0" aria-label="Directions">
            <Navigation size={18} />
          </button>
          <button className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-card border border-border text-foreground flex items-center justify-center active:scale-90 transition-transform flex-shrink-0" aria-label="Share">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1.5 px-5 py-2.5 overflow-x-auto scrollbar-hide">
        {(['services', 'about', 'reviews', 'gallery', 'packages', 'offers'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3.5 py-2.5 text-[12px] font-heading font-semibold capitalize rounded-xl transition-all duration-200 min-h-[40px] whitespace-nowrap ${
              activeTab === tab
                ? 'btn-themed'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Services Tab ── */}
      {activeTab === 'services' && (
        <div className="animate-fade-in-up" style={{ animationDuration: '250ms' }}>
          {/* Gender Toggle */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex bg-secondary rounded-xl p-1 border border-border">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-heading font-semibold transition-all duration-300 min-h-[40px] ${
                  gender === 'male'
                    ? 'btn-themed shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                <Scissors size={14} />
                Men
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-heading font-semibold transition-all duration-300 min-h-[40px] ${
                  gender === 'female'
                    ? 'btn-themed shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                <Sparkles size={14} />
                Women
              </button>
            </div>
          </div>

          {/* Service list */}
          <div className="mx-4 bg-card rounded-2xl border border-border card-shadow">
            <div className="px-2.5 space-y-2 pt-3 pb-3 md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 bg-background rounded-2xl p-3 transition-all duration-200"
                >
                  {/* Service Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={serviceImages[service.name] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop'}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-medium text-[14px] text-foreground leading-tight truncate">{service.name}</h4>
                    <span className="text-[11px] font-body text-muted-foreground bg-secondary px-2 py-0.5 rounded-md inline-block mt-1.5">
                      {service.duration}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-heading font-semibold text-[15px] text-foreground">₹{service.price}</span>
                      {service.originalPrice && (
                        <span className="text-[12px] text-muted-foreground line-through">₹{service.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Add / Qty */}
                  {cart[service.id] ? (
                    <div className="flex items-center gap-1 bg-primary/8 rounded-xl px-1 border border-primary/15 flex-shrink-0">
                      <button onClick={() => removeFromCart(service.id)} className="p-2 text-primary min-h-[40px] min-w-[32px] flex items-center justify-center">
                        <Minus size={14} />
                      </button>
                      <span className="text-[14px] font-heading font-semibold text-primary w-5 text-center">{cart[service.id]}</span>
                      <button onClick={() => addToCart(service.id)} className="p-2 text-primary min-h-[40px] min-w-[32px] flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(service.id)}
                      className="btn-themed text-[12px] font-heading font-semibold px-4 py-2.5 rounded-xl min-h-[40px] flex-shrink-0"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <ReviewsSection
          artists={artists}
          reviews={reviews}
          selectedArtist={selectedArtist}
          onSelectArtist={setSelectedArtist}
        />
      )}

      {/* ── About Tab ── */}
      {activeTab === 'about' && (
        <div className="px-5 pt-4 space-y-3 animate-fade-in-up" style={{ animationDuration: '250ms' }}>
          {/* ── Bento Media Gallery ── */}
          <div className="bg-card rounded-2xl p-4 card-shadow border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-[14px] text-foreground flex items-center gap-2">
                <ImageIcon size={15} className="text-primary" />
                Gallery & Videos
              </h3>
              <span className="text-[11px] font-body text-muted-foreground">{bentoMedia.length} items</span>
            </div>
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2.5 w-max pb-1">
                {bentoMedia.map((item, i) => (
                  <MediaThumbnail
                    key={i}
                    media={item}
                    onClick={() => setLightboxIndex(i)}
                    className="flex-shrink-0 w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-xl border border-border/50"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Embed Lightbox */}
          {lightboxIndex !== null && (
            <div className="fixed inset-0 z-[100] flex flex-col bg-foreground/95 backdrop-blur-2xl animate-fade-in">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] pb-3">
                <span className="text-primary-foreground/50 text-[13px] font-heading font-medium">
                  {lightboxIndex + 1} / {bentoMedia.length}
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 backdrop-blur-md flex items-center justify-center border border-primary-foreground/10 active:scale-90 transition-all min-h-[44px] min-w-[44px]"
                  aria-label="Close"
                >
                  <span className="text-primary-foreground text-lg">✕</span>
                </button>
              </div>

              {/* Embed content */}
              <div className="flex-1 flex items-center justify-center px-5 min-h-0">
                <div className="w-full max-w-[88vw] md:max-w-[60vw]">
                  <FullEmbed media={bentoMedia[lightboxIndex]} />
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex-shrink-0 px-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-4">
                <div className="flex gap-2.5 justify-center items-center overflow-x-auto scrollbar-hide py-1">
                  {bentoMedia.map((item, i) => {
                    const isActive = i === lightboxIndex;
                    const thumb =
                      item.type === 'youtube'
                        ? item.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`
                        : item.type === 'instagram-reel'
                        ? item.thumbnail
                        : item.type === 'instagram-post'
                        ? item.thumbnail
                        : item.src;
                    return (
                      <button
                        key={i}
                        onClick={() => setLightboxIndex(i)}
                        className={`relative flex-shrink-0 overflow-hidden transition-all duration-250 ease-out ${
                          isActive
                            ? 'w-[56px] h-[56px] rounded-2xl ring-2 ring-primary-foreground ring-offset-2 ring-offset-transparent scale-110'
                            : 'w-[44px] h-[44px] rounded-xl opacity-40 hover:opacity-70'
                        }`}
                      >
                        <img src={thumb} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        {(item.type === 'youtube' || item.type === 'instagram-reel') && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play size={12} className="text-primary-foreground" fill="white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── About Text ── */}
          <div className="bg-card rounded-2xl p-5 card-shadow border border-border">
            <h3 className="font-heading font-semibold text-[14px] text-foreground mb-2.5">About</h3>
            <p className="text-[14px] font-body text-muted-foreground leading-relaxed">
              A premium salon experience with expert stylists, modern equipment, and a relaxing ambiance.
              We specialize in haircuts, coloring, skin care, and bridal services. Our team of certified
              professionals ensures you leave looking and feeling your best.
            </p>
          </div>

          {/* ── Stylist Profiles ── */}
          <div className="bg-card rounded-2xl p-5 card-shadow border border-border">
            <h3 className="font-heading font-semibold text-[14px] text-foreground mb-4 flex items-center gap-2">
              <Award size={15} className="text-primary" />
              Our Stylists
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {artists.map((artist) => {
                const details = artistDetails[artist.id];
                return (
                  <div
                    key={artist.id}
                    className="bg-background rounded-xl p-3 border border-border transition-all duration-200 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                        <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-semibold text-[13px] text-foreground truncate">{artist.name}</p>
                        <p className="text-[11px] font-body text-primary font-medium">{artist.specialty}</p>
                      </div>
                    </div>
                    {details && (
                      <>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Clock size={11} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-[11px] font-body text-muted-foreground">{details.experience} exp.</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {details.services.slice(0, 2).map((s) => (
                            <span key={s} className="text-[10px] font-heading text-muted-foreground bg-secondary px-2 py-0.5 rounded-md border border-border">
                              {s}
                            </span>
                          ))}
                          {details.services.length > 2 && (
                            <span className="text-[10px] font-heading text-primary bg-primary/8 px-2 py-0.5 rounded-md border border-primary/12">
                              +{details.services.length - 2}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Hours & Location ── */}
          <div className="bg-card rounded-2xl p-5 card-shadow border border-border">
            <h3 className="font-heading font-semibold text-[14px] text-foreground mb-4">Hours & Location</h3>
            <div className="space-y-4">
              {/* Clickable timing row */}
              <div>
                <button
                  onClick={() => setShowHours(!showHours)}
                  className="w-full flex items-center gap-3.5 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 border border-primary/12">
                    <Clock size={17} className="text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-heading font-medium text-foreground">Mon – Sat</p>
                    <p className="text-[12px] font-body text-muted-foreground mt-0.5">9:00 AM – 9:00 PM</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform duration-300 ${showHours ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expanded working hours */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    showHours ? 'max-h-[300px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
                  }`}
                >
                  <div className="ml-[3.375rem] bg-secondary/60 rounded-xl p-3 border border-border space-y-2">
                    {workingHours.map((wh) => (
                      <div
                        key={wh.day}
                        className={`flex items-center justify-between py-1 px-2 rounded-lg ${
                          wh.day === today ? 'bg-primary/8 border border-primary/12' : ''
                        }`}
                      >
                        <span className={`text-[13px] font-heading ${
                          wh.day === today ? 'font-semibold text-primary' : 'font-medium text-foreground'
                        }`}>
                          {wh.day}
                          {wh.day === today && (
                            <span className="text-[10px] ml-1.5 bg-primary/12 text-primary px-1.5 py-0.5 rounded-md">Today</span>
                          )}
                        </span>
                        <span className={`text-[12px] font-body ${
                          wh.time === 'Closed' ? 'text-destructive font-medium' : 'text-muted-foreground'
                        }`}>
                          {wh.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 border border-primary/12">
                  <MapPin size={17} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-heading font-medium text-foreground">{salon.address}</p>
                  <p className="text-[12px] font-body text-muted-foreground mt-0.5">{salon.distance} away</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 card-shadow border border-border">
            <h3 className="font-heading font-semibold text-[14px] text-foreground mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {[...salon.tags, 'WiFi', 'Parking', 'Card Payment'].map(tag => (
                <span key={tag} className="text-[12px] font-heading font-medium text-foreground bg-secondary px-3.5 py-1.5 rounded-xl border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="px-5 pt-4 animate-fade-in-up space-y-4" style={{ animationDuration: '250ms' }}>
          {/* Featured embed */}
          <div className="rounded-2xl overflow-hidden card-shadow border border-border">
            <FullEmbed media={bentoMedia[1]} />
          </div>
          {/* Grid of all media */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {bentoMedia.map((item, i) => (
              <MediaThumbnail
                key={i}
                media={item}
                onClick={() => setLightboxIndex(i)}
                className="aspect-square rounded-2xl border border-border card-shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div className="px-5 pt-4 animate-fade-in-up" style={{ animationDuration: '250ms' }}>
          <h2 className="font-heading font-semibold text-[15px] text-foreground mb-3">Packages</h2>
          {[
            { name: 'Groom Essentials', desc: 'Haircut + Beard Trim + Facial', price: 999, original: 1400 },
            { name: 'Bridal Glow', desc: 'Bridal Makeup + Hair Spa + Manicure', price: 4499, original: 5800 },
            { name: 'Weekend Refresh', desc: 'Haircut + Hair Spa + Threading', price: 799, original: 1100 },
          ].map((pkg, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border card-shadow p-4 mb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-[14px] text-foreground">{pkg.name}</h4>
                  <p className="text-[12px] font-body text-muted-foreground mt-1">{pkg.desc}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <span className="font-heading font-bold text-[16px] text-foreground">₹{pkg.price}</span>
                  <span className="text-[11px] text-muted-foreground line-through block">₹{pkg.original}</span>
                </div>
              </div>
              <button className="btn-themed w-full mt-3 py-2.5 rounded-xl text-[13px] font-heading font-semibold min-h-[40px]">
                Book Package
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Offers Tab */}
      {activeTab === 'offers' && (
        <div className="px-5 pt-4 animate-fade-in-up" style={{ animationDuration: '250ms' }}>
          <h2 className="font-heading font-semibold text-[15px] text-foreground mb-3">Offers & Deals</h2>
          {[
            { title: '20% Off First Visit', desc: 'Valid for new customers on all services', code: 'WELCOME20', expiry: 'Mar 31, 2026' },
            { title: 'Flat ₹200 Off on Packages', desc: 'Applicable on packages above ₹999', code: 'PACK200', expiry: 'Apr 15, 2026' },
            { title: 'Free Hair Spa', desc: 'Get a complimentary hair spa with any hair color service', code: 'FREESPA', expiry: 'Mar 20, 2026' },
          ].map((offer, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border card-shadow p-4 mb-3">
              <h4 className="font-heading font-semibold text-[14px] text-foreground">{offer.title}</h4>
              <p className="text-[12px] font-body text-muted-foreground mt-1">{offer.desc}</p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border">
                <div className="bg-primary/8 border border-primary/15 rounded-lg px-3 py-1.5">
                  <span className="text-[12px] font-heading font-bold text-primary tracking-wider">{offer.code}</span>
                </div>
                <span className="text-[10px] font-body text-muted-foreground">Expires {offer.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartCount > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-5 py-3.5 z-50 md:border md:rounded-2xl md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl md:w-full md:shadow-lg"
          style={{ boxShadow: 'var(--shadow-bottom-bar)', animation: 'slide-up 0.3s ease-out' }}
        >
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div>
              <span className="text-[12px] font-body text-muted-foreground">{cartCount} service{cartCount > 1 ? 's' : ''}</span>
              <p className="font-heading font-bold text-[18px] text-foreground leading-tight">₹{cartTotal}</p>
            </div>
            <button
              onClick={() => navigate(`/booking/${id}`, { state: { cart } })}
              className="btn-themed font-heading font-semibold text-[14px] px-7 py-3.5 rounded-2xl min-h-[48px]"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDetail;
