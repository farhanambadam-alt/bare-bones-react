import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Salon } from '@/types/salon';

interface FeaturedCarouselProps {
  salons: Salon[];
}

const FeaturedCarousel = memo(({ salons }: FeaturedCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % salons.length);
  }, [salons.length]);

  /* Pause auto-play when off-screen via IntersectionObserver */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      if (isVisible.current) next();
    }, 4500);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl mx-5"
      style={{ contain: 'layout style paint' }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className="flex"
        style={{
          transform: `translate3d(-${current * 100}%, 0, 0)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        {salons.map((salon) => (
          <div
            key={salon.id}
            className="w-full flex-shrink-0 relative aspect-[16/10] cursor-pointer"
            onClick={() => navigate(`/salon/${salon.id}`)}
          >
            <img
              src={salon.image}
              alt={salon.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-transparent" />

            {salon.offer && (
              <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[11px] font-heading font-semibold px-3 py-1 rounded-lg">
                {salon.offer}
              </span>
            )}

            <div className="absolute top-3 right-3 bg-card/90 text-foreground text-[11px] font-heading font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
              <Star size={11} className="text-accent fill-accent" /> {salon.rating}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-heading font-semibold text-[17px] text-primary-foreground leading-tight">{salon.name}</h3>
              <p className="text-primary-foreground/60 text-[12px] font-body mt-0.5">{salon.tagline}</p>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/salon/${salon.id}`); }}
                className="mt-2.5 bg-primary-foreground/95 text-foreground text-[13px] font-heading font-semibold px-5 py-2.5 rounded-xl min-h-[44px]"
                style={{ transition: 'transform 0.2s ease' }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-2.5 right-4 flex gap-1.5">
        {salons.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full ${
              i === current ? 'w-5 bg-primary-foreground' : 'w-1.5 bg-primary-foreground/40'
            }`}
            style={{ transition: 'width 0.3s ease, background-color 0.3s ease' }}
          />
        ))}
      </div>
    </div>
  );
});
FeaturedCarousel.displayName = 'FeaturedCarousel';

export default FeaturedCarousel;
