import { Link } from "react-router-dom";

interface GameCardProps {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  backgroundImage?: string; // Background image for the card
  label?: string;
  language?: 'ar' | 'en';
  to?: string; // Optional custom route (for sell pages)
}

export function GameCard({ 
  id, 
  name, 
  nameAr, 
  description,
  descriptionAr,
  image,
  backgroundImage,
  label, 
  language = 'en',
  to 
}: GameCardProps) {
  const displayName = language === 'ar' && nameAr ? nameAr : name;
  const displayDescription = language === 'ar' && descriptionAr ? descriptionAr : (description || '');
  const linkTo = to || `/marketplace/${id}`;
  const isRTL = language === 'ar';

  return (
    <Link
      to={linkTo}
      className="group relative flex flex-col items-stretch overflow-hidden rounded-2xl border border-white/10 
                 bg-white/5/80 backdrop-blur-sm shadow-[0_18px_40px_rgba(0,0,0,0.35)] 
                 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 
                 hover:shadow-[0_24px_50px_rgba(56,189,248,0.25)] hover:bg-white/10"
    >
      {/* Game Image Section with Background */}
      <div className="aspect-[4/5] w-full overflow-hidden relative">
        {/* Background Image */}
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage}
              alt={`${name} background`}
              className="absolute inset-0 w-full h-full object-cover 
                         group-hover:scale-110 transition-transform duration-500 z-0"
              loading="lazy"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Very minimal overlay - only 5% for subtle darkening */}
            <div className="absolute inset-0 bg-black/5 
                          group-hover:bg-black/0 
                          transition-all duration-300 z-[1]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/40 to-slate-950/60" />
        )}
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(195,80%,50%,0.2)] to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Game Logo - Centered with shadow for visibility */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="relative">
            {/* Subtle shadow behind logo for better visibility on any background */}
            <div className="absolute inset-0 bg-black/30 rounded-2xl blur-md -z-10" />
            <img
              src={image}
              alt={name}
              className="h-20 w-20 rounded-2xl object-cover drop-shadow-2xl 
                         group-hover:scale-110 transition-transform duration-300 relative z-10"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Hide broken image and show placeholder
                target.style.display = 'none';
                // Show placeholder icon
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder && placeholder.classList.contains('game-icon-placeholder')) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
            {/* Placeholder icon when image fails to load */}
            <div className="game-icon-placeholder absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
              <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
                <span className="text-white/50 text-2xl font-bold">{name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {label && (
          <span
            className="absolute top-2 right-2 bg-[hsl(195,80%,50%)] text-white text-[10px] px-2 py-[3px]
                       rounded-md font-medium shadow-lg z-20"
          >
            {label}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className={`px-4 pb-4 pt-3 flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        <span className="text-sm font-semibold text-white group-hover:text-cyan-100 transition-colors">
          {displayName}
        </span>
        {displayDescription && (
          <span className="text-xs text-white/60 line-clamp-2 group-hover:text-white/70 transition-colors">
            {displayDescription}
          </span>
        )}
        <span className={`mt-2 text-xs font-medium text-cyan-300 group-hover:text-cyan-200 transition-colors 
                          flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {language === 'ar' ? 'عرض الحسابات' : 'View Accounts'}
          <span className={isRTL ? 'rotate-180' : ''}>→</span>
        </span>
      </div>
    </Link>
  );
}

