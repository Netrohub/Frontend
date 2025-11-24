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
// TODO: Add game logo images to frontend/public/images/games/ folder
// Recommended image size: 800x600px or similar aspect ratio
// Supported formats: JPG, PNG, WebP
export const GAMES: Game[] = [
  {
    id: "pure-sniper",
    name: "Pure Sniper",
    nameAr: "بور سنيبر",
    category: "pure_sniper_accounts",
    image: "/images/games/pure-sniper.jpg", // Add game logo to public/images/games/
  },
  {
    id: "age-of-empires",
    name: "Age of Empires Mobile",
    nameAr: "عصر الإمبراطوريات موبايل",
    category: "age_of_empires_accounts",
    image: "/images/games/age-of-empires.jpg", // Add game logo to public/images/games/
  },
  {
    id: "wos",
    name: "Whiteout Survival",
    nameAr: "النجاة في الصقيع",
    category: "wos_accounts",
    image: "/images/games/whiteout-survival.jpg",
  },
  {
    id: "honor-of-kings",
    name: "Honor of Kings",
    nameAr: "شرف الملوك",
    category: "honor_of_kings_accounts",
    image: "/images/games/honor-of-kings.jpg", // Add game logo to public/images/games/
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    nameAr: "ببجي موبايل",
    category: "pubg_accounts",
    image: "/images/games/pubg.jpg", // Add game logo to public/images/games/
  },
  {
    id: "fortnite",
    name: "Fortnite",
    nameAr: "فورتنايت",
    category: "fortnite_accounts",
    image: "/images/games/fortnite.jpg", // Add game logo to public/images/games/
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

