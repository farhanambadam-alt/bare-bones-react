import { memo } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Salon } from '@/types/salon';

interface NearbySalonCardProps {
  salon: Salon;
}

const NearbySalonCard = memo(({ salon }: NearbySalonCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/salon/${salon.id}`)}
      className="flex-shrink-0 w-[200px] md:w-full bg-card rounded-2xl overflow-hidden card-shadow border border-border cursor-pointer"
      style={{ contain: 'layout style paint', transition: 'transform 0.2s ease' }}
    >
      <div className="relative h-[130px]">
        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" loading="lazy" decoding="async" width={200} height={130} />
        <span className={`absolute top-2.5 right-2.5 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-lg ${
          salon.isOpen
            ? 'bg-success/90 text-success-foreground'
            : 'bg-destructive/90 text-destructive-foreground'
        }`}>
          {salon.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-heading font-semibold text-[13px] text-foreground truncate leading-tight">{salon.name}</h4>
        <div className="flex items-center gap-1 mt-1.5">
          <Star size={11} className="text-accent fill-accent" />
          <span className="text-[12px] font-heading font-medium text-foreground">{salon.rating}</span>
          <span className="text-[11px] text-muted-foreground">· {salon.distance}</span>
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[12px] text-muted-foreground font-body">From ₹{salon.startingPrice}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/salon/${salon.id}`);
            }}
            className="text-[11px] font-heading font-semibold text-primary-foreground bg-primary px-3.5 py-1.5 rounded-lg min-h-[32px]"
            style={{ transition: 'transform 0.15s ease' }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
});
NearbySalonCard.displayName = 'NearbySalonCard';

export default NearbySalonCard;
