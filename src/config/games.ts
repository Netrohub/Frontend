import { Star, ThumbsUp, Flame } from "lucide-react";

export interface GameBanner {
  text: string; // Arabic text
  textEn: string; // English text
  color: string; // Tailwind color class
  icon: React.ComponentType<{ className?: string }>;
}

export interface Game {
  id: string; // URL slug (e.g., "wos", "fortnite")
  name: string; // Display name
  nameAr: string; // Arabic name
  category: string; // Backend category (e.g., "wos_accounts")
  image: string; // Game artwork/image URL
  banner?: GameBanner; // Optional banner with Arabic text
  gradient?: string; // Optional gradient for card
}

// Banner types
export const BANNER_TYPES = {
  NEW: {
    text: "جديد",
    textEn: "New",
    color: "bg-green-500",
    icon: Star,
  },
  DISCOUNT: {
    text: "خصم إضافي",
    textEn: "Extra Discount",
    color: "bg-orange-500",
    icon: ThumbsUp,
  },
  REWARD: {
    text: "مكافأة إضافية",
    textEn: "Extra Reward",
    color: "bg-red-500",
    icon: Flame,
  },
};

// Import game images if available
// import pureSniperImage from "@/assets/games/pure-sniper.jpg";
// import ageOfEmpiresImage from "@/assets/games/age-of-empires.jpg";
import heroArctic from "@/assets/hero-arctic.jpg";
// import honorOfKingsImage from "@/assets/games/honor-of-kings.jpg";
// import pubgImage from "@/assets/games/pubg.jpg";
// import fortniteImage from "@/assets/games/fortnite.jpg";

// Games configuration
export const GAMES: Game[] = [
  {
    id: "pure-sniper",
    name: "Pure Sniper",
    nameAr: "بور سنيبر",
    category: "pure_sniper_accounts",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop", // TODO: Replace with actual game image
    banner: BANNER_TYPES.NEW,
  },
  {
    id: "age-of-empires",
    name: "Age of Empires Mobile",
    nameAr: "عصر الإمبراطوريات موبايل",
    category: "age_of_empires_accounts",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop", // TODO: Replace with actual game image
    banner: BANNER_TYPES.DISCOUNT,
  },
  {
    id: "wos",
    name: "Whiteout Survival",
    nameAr: "وايت أوت سرفايفل",
    category: "wos_accounts",
    image: heroArctic, // Using existing WOS image
    banner: BANNER_TYPES.REWARD,
  },
  {
    id: "honor-of-kings",
    name: "Honor of Kings",
    nameAr: "شرف الملوك",
    category: "honor_of_kings_accounts",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop", // TODO: Replace with actual game image
    banner: BANNER_TYPES.REWARD,
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    nameAr: "ببجي موبايل",
    category: "pubg_accounts",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop", // TODO: Replace with actual game image
    banner: BANNER_TYPES.DISCOUNT,
  },
  {
    id: "fortnite",
    name: "Fortnite",
    nameAr: "فورتنايت",
    category: "fortnite_accounts",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop", // TODO: Replace with actual game image
  },
];

// Helper function to get game by ID
export function getGameById(id: string): Game | undefined {
  return GAMES.find(game => game.id === id);
}

// Helper function to get game by category
export function getGameByCategory(category: string): Game | undefined {
  return GAMES.find(game => game.category === category);
}

