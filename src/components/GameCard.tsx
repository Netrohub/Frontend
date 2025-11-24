import { Link } from "react-router-dom";

interface GameCardProps {
  id: string;
  name: string;
  nameAr?: string;
  image: string;
  label?: string;
  language?: 'ar' | 'en';
}

export function GameCard({ id, name, nameAr, image, label, language = 'en' }: GameCardProps) {
  const displayName = language === 'ar' && nameAr ? nameAr : name;

  return (
    <Link
      to={`/marketplace/${id}`}
      className="group relative w-full max-w-[160px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3
                 hover:border-[hsl(195,80%,70%,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300 hover:scale-105"
    >
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 mx-auto rounded-xl object-cover"
          loading="lazy"
        />

        {label && (
          <span
            className="absolute -top-1 -right-1 bg-[hsl(195,80%,50%)] text-white text-[10px] px-2 py-[3px]
                       rounded-md font-medium shadow-sm"
          >
            {label}
          </span>
        )}
      </div>

      <div className="mt-3 text-center">
        <span className="block text-sm font-semibold tracking-wide text-white">
          {displayName}
        </span>
      </div>
    </Link>
  );
}

