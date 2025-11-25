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
    image: getCloudflareImageUrl("WHITEOUT_SURVIVAL_LOGO_ID", "public"),
    // Replace with your Cloudflare image ID for wos background
    backgroundImage: getCloudflareImageUrl("WOS_BG_ID", "public"), // Snow/winter theme background
  },
  {
    id: "kingshot",
    name: "KingShot",
    nameAr: "كينج شوت",
    description: "Premium accounts and high rankings",
    descriptionAr: "حسابات وتصنيفات عالية",
    category: "kingshot_accounts",
    // Replace with your Cloudflare image ID for kingshot logo
    image: getCloudflareImageUrl("KINGSHOT_LOGO_ID", "public"),
    // Replace with your Cloudflare image ID for kingshot background
    backgroundImage: getCloudflareImageUrl("KINGSHOT_BG_ID", "public"), // Action/shooting theme background
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    nameAr: "ببجي موبايل",
    description: "Premium PUBG Mobile accounts",
    descriptionAr: "حسابات ببجي موبايل المميزة",
    category: "pubg_accounts",
    // Replace with your Cloudflare image ID for PUBG logo
    image: getCloudflareImageUrl("PUBG_LOGO_ID", "public"),
    // Replace with your Cloudflare image ID for pubg background
    backgroundImage: getCloudflareImageUrl("PUBG_BG_ID", "public"), // Battle royale/military theme background
  },
  {
    id: "fortnite",
    name: "Fortnite",
    nameAr: "فورتنايت",
    description: "Buy and sell Fortnite accounts",
    descriptionAr: "شراء وبيع حسابات فورتنايت",
    category: "fortnite_accounts",
    // Replace with your Cloudflare image ID for fortnite logo
    image: getCloudflareImageUrl("FORTNITE_LOGO_ID", "public"),
    // Replace with your Cloudflare image ID for fortnite background
    backgroundImage: getCloudflareImageUrl("FORTNITE_BG_ID", "public"), // Colorful/cartoon theme background
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

