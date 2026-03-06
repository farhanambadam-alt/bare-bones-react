import { useState } from 'react';
import { MapPin, Star, Clock, Shield, Bell, Search, Play, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGender } from '@/contexts/GenderContext';
import { atHomeArtists } from '@/data/atHomeData';

const AtHome = () => {
  const navigate = useNavigate();
  const { gender, setGender } = useGender();
  const [searchQuery, setSearchQuery] = useState('');
  const hasArtists = false;

  return (
    <div className="min-h-screen relative pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-foreground font-extrabold text-left text-[22px] tracking-tight">
              𝑨𝒕 𝑯𝒐𝒎𝒆
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-primary" />
              <span className="text-[12px] font-body text-muted-foreground">Koramangala, Bangalore</span>
            </div>
          </div>
          <button className="relative p-2.5 bg-card/80 backdrop-blur-sm border border-border rounded-full shadow-sm">
            <Bell size={17} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 mt-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for artists or services"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card/80 backdrop-blur-sm border border-border rounded-2xl text-[13px] font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Gender Toggle */}
      <div className="flex justify-center mt-5 mb-2">
        <div className="bg-card/80 backdrop-blur-sm rounded-full p-1.5 border border-border shadow-sm flex gap-1">
          <button
            onClick={() => setGender('female')}
            className={`px-8 py-2.5 rounded-full text-[13px] font-heading font-semibold transition-all duration-300 min-h-[40px] ${
              gender === 'female'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Women
          </button>
          <button
            onClick={() => setGender('male')}
            className={`px-8 py-2.5 rounded-full text-[13px] font-heading font-semibold transition-all duration-300 min-h-[40px] ${
              gender === 'male'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Men
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-center text-[12px] font-body text-muted-foreground px-10 mt-1 mb-5 leading-relaxed">
        Explore beauty professionals offering home services in your area
      </p>

      {/* Divider */}
      <div className="mx-5 border-t border-border/60 mb-5" />

      {/* Content */}
      {hasArtists ? null : (
        <div className="px-5 pt-16 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-secondary/60 flex items-center justify-center mb-6">
            <MapPin size={48} className="text-muted-foreground/40" />
          </div>
          <h2 className="font-heading font-bold text-[18px] text-foreground mb-2">
            No Artists in Your Area Yet
          </h2>
          <p className="text-[14px] font-body text-muted-foreground max-w-[280px] leading-relaxed">
            We're expanding fast! Get notified as soon as artists become available near you.
          </p>
          <button className="mt-6 bg-primary text-primary-foreground font-heading font-semibold text-[14px] px-8 py-3.5 rounded-2xl active:scale-95 transition-transform min-h-[48px] flex items-center gap-2">
            <Bell size={16} />
            Notify Me When Available
          </button>
        </div>
      )}
    </div>
  );
};

export default AtHome;
