// Game images are stored on Cloudflare Images
// URL format: https://imagedelivery.net/{account_hash}/{image_id}/{variant}
// Variants: public (full size), medium (800x800), thumbnail (300x300)

export interface Game {
  id: string; // URL slug (e.g., "wos", "fortnite")
  name: string; // Display name
  nameAr: string; // Arabic name
  description?: string; // English description
  descriptionAr?: string; // Arabic description
  category: string; // Backend category (e.g., "wos_accounts")
  image: string; // Game logo/image URL (Cloudflare Images URL)
  backgroundImage?: string; // Background image URL for the card (Cloudflare Images URL)
}

// Import Cloudflare Images utility
import { getCloudflareImageUrl } from "@/lib/cloudflareImages";

// Helper to get image with fallback
// Uses local images by default until Cloudflare Images is properly configured
function getGameImage(imageId: string, fallbackPath: string): string {
  // Check if Cloudflare is configured and imageId is valid
  const cloudflareUrl = getCloudflareImageUrl(imageId, 'public');
  
  // Only use Cloudflare URL if it's valid (not empty and not a placeholder)
  if (cloudflareUrl && !imageId.includes('_ID') && !imageId.includes('PLACEHOLDER')) {
    return cloudflareUrl;
  }
  
  // Use local fallback immediately (faster, no timeout)
  return fallbackPath;
}

// Games configuration
// Only 4 games are supported: Whiteout Survival, KingShot, PUBG, Fortnite
// Images are stored on Cloudflare Images
// 
// To update images:
// 1. Upload images to Cloudflare Images (Dashboard → Images → Upload)
// 2. Copy the image ID from the uploaded image
// 3. Replace the image IDs below with your Cloudflare image IDs
//
// Image IDs format: Replace these with your actual Cloudflare image IDs
// Example: "abc123def456" (from https://imagedelivery.net/{hash}/abc123def456/public)

export const GAMES: Game[] = [
  {
    id: "wos",
    name: "Whiteout Survival",
    nameAr: "النجاة في الصقيع",
    description: "Buy and sell Whiteout Survival accounts",
    descriptionAr: "حسابات Whiteout Survival",
    category: "wos_accounts",
    // Replace with your Cloudflare image ID for whiteout-survival logo
    image: getGameImage("WHITEOUT_SURVIVAL_LOGO_ID", "/images/games/whiteout-survival.jpg"),
    // Replace with your Cloudflare image ID for wos background
    backgroundImage: getGameImage("WOS_BG_ID", "/images/games/backgrounds/wos-bg.jpg"), // Snow/winter theme background
  },
  {
    id: "kingshot",
    name: "KingShot",
    nameAr: "كينج شوت",
    description: "Premium accounts and high rankings",
    descriptionAr: "حسابات وتصنيفات عالية",
    category: "kingshot_accounts",
    // Replace with your Cloudflare image ID for kingshot logo
    image: getGameImage("KINGSHOT_LOGO_ID", "/images/games/kingshot.jpg"),
    // Replace with your Cloudflare image ID for kingshot background
    backgroundImage: getGameImage("KINGSHOT_BG_ID", "/images/games/backgrounds/kingshot-bg.jpg"), // Action/shooting theme background
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    nameAr: "ببجي موبايل",
    description: "Premium PUBG Mobile accounts",
    descriptionAr: "حسابات ببجي موبايل المميزة",
    category: "pubg_accounts",
    // Replace with your Cloudflare image ID for PUBG logo
    image: getGameImage("PUBG_LOGO_ID", "/images/games/PUBG.jpg"),
    // Replace with your Cloudflare image ID for pubg background
    backgroundImage: getGameImage("PUBG_BG_ID", "/images/games/backgrounds/pubg-bg.jpg"), // Battle royale/military theme background
  },
  {
    id: "fortnite",
    name: "Fortnite",
    nameAr: "فورتنايت",
    description: "Buy and sell Fortnite accounts",
    descriptionAr: "شراء وبيع حسابات فورتنايت",
    category: "fortnite_accounts",
    // Replace with your Cloudflare image ID for fortnite logo
    image: getGameImage("FORTNITE_LOGO_ID", "/images/games/fortnite.jpg"),
    // Replace with your Cloudflare image ID for fortnite background
    backgroundImage: getGameImage("FORTNITE_BG_ID", "/images/games/backgrounds/fortnite-bg.jpg"), // Colorful/cartoon theme background
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

