# Game Logos Setup Guide

## Where to Add Game Logos

Add game logo images to: **`frontend/public/images/games/`**

## Required Game Logos

Create the following files in `frontend/public/images/games/`:

1. **pure-sniper.jpg** - Pure Sniper game logo
2. **age-of-empires.jpg** - Age of Empires Mobile game logo
3. **honor-of-kings.jpg** - Honor of Kings game logo
4. **pubg.jpg** - PUBG Mobile game logo
5. **fortnite.jpg** - Fortnite game logo

**Note:** Whiteout Survival (WOS) already uses `hero-arctic.jpg` from assets.

## Image Requirements

- **Format:** JPG, PNG, or WebP
- **Recommended size:** 800x600px or similar aspect ratio (4:3 or 3:4)
- **Quality:** High quality, clear game logos
- **Aspect ratio:** Should match the card design (3:4 aspect ratio works best)

## Where to Get Game Logos

1. Official game websites
2. Game app stores (Google Play, App Store)
3. Game developer press kits
4. Official game social media accounts

## File Structure

```
frontend/
  public/
    images/
      games/
        pure-sniper.jpg
        age-of-empires.jpg
        honor-of-kings.jpg
        pubg.jpg
        fortnite.jpg
```

## After Adding Logos

The images will automatically be available at:
- `/images/games/pure-sniper.jpg`
- `/images/games/age-of-empires.jpg`
- etc.

No code changes needed - the paths are already configured in `frontend/src/config/games.ts`.

