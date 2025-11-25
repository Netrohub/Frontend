// Game images are stored in frontend/public/images/games/
// Images can be referenced directly as: /images/games/filename.jpg

export interface Game {
  id: string; // URL slug (e.g., "wos", "fortnite")
  name: string; // Display name
  nameAr: string; // Arabic name
  category: string; // Backend category (e.g., "wos_accounts")
  image: string; // Game logo/image URL (imported asset or public path)
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
    category: "wos_accounts",
    image: "/images/games/whiteout-survival.jpg",
  },
  {
    id: "kingshot",
    name: "KingShot",
    nameAr: "كينج شوت",
    category: "kingshot_accounts",
    image: "/images/games/kingshot.jpg",
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    nameAr: "ببجي موبايل",
    category: "pubg_accounts",
    image: "/images/games/pubg.jpg",
  },
  {
    id: "fortnite",
    name: "Fortnite",
    nameAr: "فورتنايت",
    category: "fortnite_accounts",
    image: "/images/games/fortnite.jpg",
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

