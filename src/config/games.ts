// Game images are stored in frontend/public/images/games/
// Images can be referenced directly as: /images/games/filename.jpg

export interface Game {
  id: string; // URL slug (e.g., "wos", "fortnite")
  name: string; // Display name
  nameAr: string; // Arabic name
  description?: string; // English description
  descriptionAr?: string; // Arabic description
  category: string; // Backend category (e.g., "wos_accounts")
  image: string; // Game logo/image URL (imported asset or public path)
  backgroundImage?: string; // Background image URL for the card (optional)
}

// Games configuration
// Only 4 games are supported: Whiteout Survival, KingShot, PUBG, Fortnite
// Game logo images should be in frontend/public/images/games/ folder
// Recommended image size: 800x600px or similar aspect ratio
// Supported formats: JPG, PNG, WebP
export const GAMES: Game[] = [
  {
    id: "wos",
    name: "Whiteout Survival",
    nameAr: "النجاة في الصقيع",
    description: "Buy and sell Whiteout Survival accounts",
    descriptionAr: "حسابات Whiteout Survival",
    category: "wos_accounts",
    image: "/images/games/whiteout-survival.jpg",
    backgroundImage: "/images/games/backgrounds/wos-bg.jpg", // Snow/winter theme background
  },
  {
    id: "kingshot",
    name: "KingShot",
    nameAr: "كينج شوت",
    description: "Premium accounts and high rankings",
    descriptionAr: "حسابات وتصنيفات عالية",
    category: "kingshot_accounts",
    image: "/images/games/kingshot.jpg",
    backgroundImage: "/images/games/backgrounds/kingshot-bg.jpg", // Action/shooting theme background
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    nameAr: "ببجي موبايل",
    description: "Premium PUBG Mobile accounts",
    descriptionAr: "حسابات ببجي موبايل المميزة",
    category: "pubg_accounts",
    image: "/images/games/pubg.jpg",
    backgroundImage: "/images/games/backgrounds/pubg-bg.jpg", // Battle royale/military theme background
  },
  {
    id: "fortnite",
    name: "Fortnite",
    nameAr: "فورتنايت",
    description: "Buy and sell Fortnite accounts",
    descriptionAr: "شراء وبيع حسابات فورتنايت",
    category: "fortnite_accounts",
    image: "/images/games/fortnite.jpg",
    backgroundImage: "/images/games/backgrounds/fortnite-bg.jpg", // Colorful/cartoon theme background
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

