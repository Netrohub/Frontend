# Image Loading Debug Guide

## Issue
Background images are not loading even though files exist in `frontend/public/images/games/backgrounds/`

## Files Verified
✅ All background images exist:
- `wos-bg.jpg` ✓
- `kingshot-bg.jpg` ✓
- `pubg-bg.jpg` ✓
- `fortnite-bg.jpg` ✓

✅ All game icons exist:
- `kingshot.jpg` ✓
- `PUBG.jpg` ✓
- `whiteout-survival.jpg` ✓
- `fortnite.jpg` ✓

## Possible Causes

### 1. Dev Server Cache
**Solution:** Restart the dev server
```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

### 2. Browser Cache
**Solution:** Hard refresh
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### 3. Vite Public Folder
In Vite, files in `public/` should be referenced with absolute paths starting with `/`.

**Current paths (correct):**
- `/images/games/backgrounds/wos-bg.jpg`
- `/images/games/kingshot.jpg`

### 4. Build Process
If using production build, ensure images are copied:
```bash
cd frontend
npm run build
```

### 5. Case Sensitivity
On some systems (Linux), file names are case-sensitive. Verify:
- `PUBG.jpg` (uppercase) - already fixed in config
- All other files use lowercase

## Testing Steps

1. **Check if images are accessible directly:**
   - Open browser and go to: `http://localhost:5173/images/games/backgrounds/wos-bg.jpg`
   - If 404, the dev server isn't serving the files correctly

2. **Check browser console:**
   - Open DevTools (F12)
   - Go to Network tab
   - Filter by "Img"
   - Try loading the page
   - Check if images show 404 or other errors

3. **Check file permissions:**
   - Ensure files are readable
   - No special characters in file names

4. **Verify Vite config:**
   - Ensure `public/` folder is properly configured
   - Check `vite.config.ts` for any asset handling

## Quick Fix

If images still don't load after restarting dev server:

1. **Clear Vite cache:**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   rm -rf dist
   npm run dev
   ```

2. **Verify image paths in browser:**
   - Right-click on broken image → Inspect
   - Check the `src` attribute
   - Try opening that URL directly in browser

3. **Check for typos:**
   - Ensure file names match exactly (case-sensitive)
   - No extra spaces or special characters

## Expected Behavior

After fix:
- Background images should load and be visible (with 5% overlay for subtle darkening)
- Game icons should load and be visible
- No console errors about failed image loads

