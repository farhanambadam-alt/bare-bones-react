import { useState } from 'react';
import { Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export type MediaSource =
  | { type: 'youtube'; videoId: string; thumbnail?: string }
  | { type: 'instagram-reel'; reelId: string; thumbnail: string }
  | { type: 'instagram-post'; postId: string; thumbnail: string }
  | { type: 'image'; src: string };

interface EmbeddedMediaProps {
  media: MediaSource;
  className?: string;
  /** If true, render inline embed. If false, render a thumbnail that expands on click */
  inline?: boolean;
}

/* ── YouTube helpers ── */
const getYouTubeThumbnail = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

const YouTubeEmbed = ({ videoId, className }: { videoId: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative bg-foreground/5 ${className}`}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&playsinline=1`}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        title="YouTube video"
      />
    </div>
  );
};

/* ── Instagram embed (cropped to hide chrome) ── */
const InstagramEmbed = ({
  id,
  isReel,
  className,
}: {
  id: string;
  isReel: boolean;
  className?: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  const path = isReel ? 'reel' : 'p';
  return (
    <div className={`relative overflow-hidden bg-foreground/5 ${className}`}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      {/* Outer clip container hides Instagram header/footer chrome */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={`https://www.instagram.com/${path}/${id}/embed/?cr=1&v=14&wp=540&rd=https%3A%2F%2Flovable.dev`}
          className="border-0 w-[calc(100%+2px)] h-[calc(100%+120px)] -mt-[1px] -ml-[1px]"
          scrolling="no"
          allowTransparency
          onLoad={() => setLoaded(true)}
          title={isReel ? 'Instagram Reel' : 'Instagram Post'}
          style={{
            /* Push iframe up to crop the top Instagram header */
            marginTop: '-54px',
            /* Extend height to fill and push footer out of view */
            height: 'calc(100% + 108px)',
          }}
        />
      </div>
    </div>
  );
};

/* ── Thumbnail card for gallery grids ── */
export const MediaThumbnail = ({
  media,
  onClick,
  label,
  className = '',
}: {
  media: MediaSource;
  onClick?: () => void;
  label?: string;
  className?: string;
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const thumbnail =
    media.type === 'youtube'
      ? media.thumbnail || getYouTubeThumbnail(media.videoId)
      : media.type === 'instagram-reel'
      ? media.thumbnail
      : media.type === 'instagram-post'
      ? media.thumbnail
      : media.src;

  const isVideo = media.type === 'youtube' || media.type === 'instagram-reel';
  const typeLabel =
    media.type === 'youtube'
      ? 'YouTube'
      : media.type === 'instagram-reel'
      ? 'Reel'
      : media.type === 'instagram-post'
      ? 'Post'
      : 'Photo';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden group cursor-pointer active:scale-[0.97] transition-transform duration-200 ${className}`}
    >
      {!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={thumbnail}
        alt={label || typeLabel}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
          setImgLoaded(true);
        }}
      />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 group-hover:bg-foreground/30 transition-colors">
          <div className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Play size={14} className="text-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-foreground/40 to-transparent" />
      <span className="absolute bottom-1.5 left-2 text-[10px] font-heading font-medium text-primary-foreground drop-shadow-sm">
        {label || typeLabel}
      </span>
      {/* Platform badge */}
      {media.type !== 'image' && (
        <div className="absolute top-1.5 right-1.5">
          <span className="text-[9px] font-heading font-bold text-primary-foreground bg-foreground/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
            {media.type === 'youtube' ? '▶ YT' : '📷 IG'}
          </span>
        </div>
      )}
    </div>
  );
};

/* ── Full embed renderer (for lightbox / expanded view) ── */
export const FullEmbed = ({
  media,
  className = '',
}: {
  media: MediaSource;
  className?: string;
}) => {
  switch (media.type) {
    case 'youtube':
      return <YouTubeEmbed videoId={media.videoId} className={`w-full aspect-video rounded-2xl overflow-hidden ${className}`} />;
    case 'instagram-reel':
      return <InstagramEmbed id={media.reelId} isReel className={`w-full aspect-[9/16] max-h-[70vh] rounded-2xl overflow-hidden ${className}`} />;
    case 'instagram-post':
      return <InstagramEmbed id={media.postId} isReel={false} className={`w-full aspect-square rounded-2xl overflow-hidden ${className}`} />;
    case 'image':
      return (
        <img
          src={media.src}
          alt="Gallery"
          className={`w-full h-auto max-h-[65vh] object-contain rounded-2xl ${className}`}
        />
      );
  }
};

export default EmbeddedMedia;
