// Import game images from assets
import heroArctic from "@/assets/hero-arctic.jpg";
// TODO: Add game logos to frontend/src/assets/games/ and import them here
// Example:
// import pureSniperLogo from "@/assets/games/pure-sniper.jpg";
// import ageOfEmpiresLogo from "@/assets/games/age-of-empires.jpg";
// import honorOfKingsLogo from "@/assets/games/honor-of-kings.jpg";
// import pubgLogo from "@/assets/games/pubg.jpg";
// import fortniteLogo from "@/assets/games/fortnite.jpg";

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
    image: heroArctic, // Using existing WOS image from assets
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

