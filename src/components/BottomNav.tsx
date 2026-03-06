import { Search, CalendarDays, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import atSalonIcon from '@/assets/at-salon.svg';
import atHomeIcon from '@/assets/at-home.svg';

type TabItem = {
  icon?: typeof Search;
  svgSrc?: string;
  label: string;
  path: string;
};

const tabs: TabItem[] = [
  { svgSrc: atSalonIcon, label: 'At Salon', path: '/' },
  { svgSrc: atHomeIcon, label: 'At Home', path: '/at-home' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [spotlightX, setSpotlightX] = useState(0);
  const [spotlightW, setSpotlightW] = useState(0);
  const activeIndex = tabs.findIndex((t) => t.path === location.pathname);

  const updateSpotlight = useCallback(() => {
    const btn = buttonsRef.current[activeIndex];
    if (!btn) return;
    const nav = btn.parentElement!;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setSpotlightX(btnRect.left - navRect.left + btnRect.width / 2);
    setSpotlightW(btnRect.width);
  }, [activeIndex]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [updateSpotlight]);

  const hidden = useMemo(() => {
    const p = location.pathname;
    return p.startsWith('/salon/') || p.startsWith('/booking/') || p.startsWith('/artist/') || p.startsWith('/at-home-booking/');
  }, [location.pathname]);

  if (hidden) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:bottom-4"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
      }}
    >
      <div
        className="pointer-events-auto relative flex items-center w-[calc(100%-24px)] max-w-sm md:max-w-md md:w-auto rounded-[24px] px-2 pt-1 pb-2 md:px-4 md:pt-1.5 md:pb-2.5 md:gap-1 md:rounded-[28px] justify-around md:justify-center overflow-hidden"
        style={{
          /* Solid dark bg instead of backdrop-blur-xl — massively cheaper on WebView */
          background: 'rgba(18, 18, 22, 0.94)',
          boxShadow: '0 8px 32px -4px rgba(0,0,0,0.3)',
          transform: 'translateZ(0)', /* promote to compositor layer */
        }}
      >
        {/* Sliding spotlight indicator — GPU-composited via transform */}
        {activeIndex >= 0 && (
          <div
            className="absolute pointer-events-none z-0 flex flex-col items-center"
            style={{
              left: 0,
              width: spotlightW * 1.2,
              transform: `translateX(${spotlightX - (spotlightW * 1.2) / 2}px)`,
              top: 0,
              bottom: 0,
              transition: 'transform 0.4s cubic-bezier(0.42, 0, 0.58, 1)',
              willChange: 'transform',
            }}
            aria-hidden="true"
          >
            {/* Light source capsule — single simplified shadow */}
            <span
              className="shrink-0 rounded-full"
              style={{
                width: '28px',
                height: '4px',
                background: 'rgb(255, 126, 80)',
                boxShadow: '0 0 14px 5px rgba(255, 126, 80, 0.55)',
              }}
            />
            {/* Trapezoid beam — pre-blurred gradient, no filter:blur */}
            <span
              className="flex-1 w-full"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 110% 100%, -10% 100%)',
                background:
                  'linear-gradient(to bottom, rgba(255,126,80,0.35) 0%, rgba(255,126,80,0.15) 25%, rgba(255,126,80,0.05) 55%, transparent 100%)',
                /* Removed filter:blur(6px), maskImage — using softer gradient stops instead */
              }}
            />
          </div>
        )}

        {tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={tab.path}
              ref={(el) => { buttonsRef.current[i] = el; }}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative z-10 flex flex-col items-center justify-center min-w-[48px] min-h-[48px] md:min-w-[56px] md:min-h-[52px] px-1 md:px-2"
              style={{
                WebkitTapHighlightColor: 'transparent',
                transition: 'transform 0.15s ease',
              }}
            >
              <span
                className="relative z-10 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full"
                style={{
                  animation: isActive ? 'icon-bump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                {tab.svgSrc ? (
                  <img
                    src={tab.svgSrc}
                    alt=""
                    width={32}
                    height={32}
                    className="w-[32px] h-[32px] md:w-8 md:h-8"
                    decoding="async"
                    style={{
                      filter: isActive
                        ? 'brightness(0) saturate(100%) invert(72%) sepia(60%) saturate(400%) hue-rotate(5deg)'
                        : 'invert(1) opacity(0.55)',
                    }}
                  />
                ) : (
                  tab.icon && (
                    <tab.icon
                      size={28}
                      strokeWidth={isActive ? 2.2 : 1.6}
                      className="md:!w-7 md:!h-7"
                      style={{
                        color: isActive ? 'rgb(255, 126, 80)' : 'rgba(255,255,255,0.5)',
                      }}
                    />
                  )
                )}
              </span>
              <span
                className="text-[11px] md:text-[11px] leading-tight mt-0.5 truncate max-w-[60px]"
                style={{
                  color: isActive ? 'rgb(255, 126, 80)' : 'rgba(255,255,255,0.45)',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
