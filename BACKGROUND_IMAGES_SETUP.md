# Game Background Images Setup Guide

## Overview
Each game card now supports a background image that appears behind the game logo. These background images should match the theme of each game.

## Directory Structure
Create the following directory structure:
```
frontend/public/images/games/backgrounds/
```

## Required Background Images

### 1. Whiteout Survival (wos-bg.jpg)
- **Theme**: Snow, winter, ice, cold environment
- **Recommended**: Snowy landscape, ice crystals, winter scene
- **Size**: 800x1000px (4:5 aspect ratio to match card)
- **Format**: JPG, PNG, or WebP

### 2. KingShot (kingshot-bg.jpg)
- **Theme**: Action, shooting, combat, intense gameplay
- **Recommended**: Action scene, shooting elements, combat atmosphere
- **Size**: 800x1000px (4:5 aspect ratio)
- **Format**: JPG, PNG, or WebP

### 3. PUBG Mobile (pubg-bg.jpg)
- **Theme**: Battle royale, military, survival, intense action
- **Recommended**: Battlefield, military theme, action-packed scene
- **Size**: 800x1000px (4:5 aspect ratio)
- **Format**: JPG, PNG, or WebP

### 4. Fortnite (fortnite-bg.jpg)
- **Theme**: Colorful, cartoon, vibrant, fun
- **Recommended**: Colorful landscape, cartoon-style background, vibrant colors
- **Size**: 800x1000px (4:5 aspect ratio)
- **Format**: JPG, PNG, or WebP

## Image Guidelines

1. **Aspect Ratio**: All background images should be 4:5 (width:height) to match the card's aspect ratio
2. **Resolution**: Minimum 800x1000px, recommended 1200x1500px for better quality
3. **File Size**: Keep under 500KB per image for optimal loading
4. **Style**: Images should be slightly darker or have good contrast to ensure the game logo stands out
5. **Overlay**: The component automatically adds a dark overlay for better text/logo visibility

## Fallback Behavior

If a background image is not provided or fails to load, the card will automatically fall back to a gradient background (slate-950/60 to slate-900/40).

## Adding New Background Images

1. Place the image file in `frontend/public/images/games/backgrounds/`
2. Name it according to the pattern: `{game-id}-bg.jpg` (e.g., `wos-bg.jpg`)
3. Update the `backgroundImage` property in `frontend/src/config/games.ts`

## Example

```typescript
{
  id: "wos",
  name: "Whiteout Survival",
  backgroundImage: "/images/games/backgrounds/wos-bg.jpg",
  // ... other properties
}
```

## Notes

- Background images are optional - if not provided, a gradient background will be used
- The component includes hover effects that slightly brighten the overlay on hover
- Background images will scale on hover for a subtle zoom effect

