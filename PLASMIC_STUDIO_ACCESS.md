# How to Access and Edit Your Plasmic Project

## Quick Start Guide

### Step 1: Access Plasmic Studio

1. **Go to Plasmic Studio**: 
   - Open your browser and visit: https://studio.plasmic.app
   - Log in with your Plasmic account

2. **Open Your Project**:
   - Your project ID is: `1Hn4NBB5sATdK2CZK8S6bB`
   - You can access it directly at: https://studio.plasmic.app/projects/1Hn4NBB5sATdK2CZK8S6bB
   - Or find it in your dashboard under "Blank website"

### Step 2: Configure Host URL (for Live Preview)

To enable live preview and edit your designs while seeing changes in real-time:

1. **In Plasmic Studio**:
   - Click on the **Settings** icon (⚙️) in the top toolbar
   - Or go to **Project Settings** from the project menu
   - Navigate to **Hosting** section

2. **Set Host URL**:
   - **Host URL**: `https://nxoland.com/plasmic-host`
   - Make sure to use `https://` (not `http://`)
   - Use the non-www version (`nxoland.com`, not `www.nxoland.com`)
   - Click **Save**

### Step 3: Start Editing

1. **Edit Your Homepage**:
   - Click on the **Homepage** component in the left panel
   - You'll see the canvas where you can drag and drop components
   - Make any design changes you want

2. **Add Components**:
   - Use the left panel to browse available components
   - Drag components onto the canvas
   - Configure them in the right panel

3. **Publish Changes**:
   - Click the **Publish** button in the top toolbar
   - This publishes your changes (makes them available for sync)

### Step 4: Sync Changes to Your Codebase

After making changes in Plasmic Studio and publishing:

1. **Run Sync Command**:
   ```bash
   cd frontend
   npx @plasmicapp/cli sync
   ```
   
   This will:
   - Download your latest published designs
   - Generate updated React components
   - Update files in `src/components/plasmic/`

2. **Commit and Deploy**:
   ```bash
   git add .
   git commit -m "Update Plasmic components"
   git push
   ```

### Step 5: Use Watch Mode (Optional)

For automatic syncing while you design:

1. **Start Watch Mode**:
   ```bash
   cd frontend
   npx @plasmicapp/cli watch
   ```
   
   This will:
   - Watch for changes in Plasmic Studio
   - Automatically sync when you publish
   - Keep your local code in sync

2. **Keep it running** in a terminal while you design

## Important Notes

### Project Setup ✅
- ✅ Project ID: `1Hn4NBB5sATdK2CZK8S6bB`
- ✅ API Token: Already configured in `plasmic.json`
- ✅ Host URL: `https://nxoland.com/plasmic-host`
- ✅ Component Path: `/` (Homepage route)

### Current Status
- **Codegen**: Active (components generated statically)
- **Generated Component**: `Homepage` at `/` route
- **Host Page**: Available at `/plasmic-host` for Studio connection

### What You Can Edit

**In Plasmic Studio**:
- ✅ Design/layout of components
- ✅ Colors, fonts, spacing
- ✅ Component structure
- ✅ Component variants

**In Your Code** (`src/components/Homepage.tsx`):
- ✅ Add event handlers
- ✅ Add business logic
- ✅ Connect to APIs
- ✅ Customize props

**Don't Edit**:
- ❌ Files in `src/components/plasmic/` (auto-generated)
- ❌ Files in `src/components/plasmic/blank_website/` (auto-generated)

## Troubleshooting

### Can't Connect to Plasmic Studio?
- Check that your site is deployed at `https://nxoland.com`
- Verify `/plasmic-host` route is accessible
- Make sure Host URL in Plasmic is `https://nxoland.com/plasmic-host` (not www)

### Changes Not Appearing?
1. **Publish in Plasmic**: Make sure you clicked "Publish" after editing
2. **Sync Locally**: Run `npx @plasmicapp/cli sync`
3. **Deploy**: Push to Git and deploy to Cloudflare Pages

### Host URL Issues?
- Use `https://nxoland.com/plasmic-host` (not www)
- Make sure your deployment is live
- Check browser console for errors

## Next Steps

1. ✅ **Access Plasmic Studio**: https://studio.plasmic.app/projects/1Hn4NBB5sATdK2CZK8S6bB
2. ✅ **Set Host URL**: `https://nxoland.com/plasmic-host`
3. ✅ **Start Editing**: Make your design changes
4. ✅ **Publish**: Click Publish in Plasmic Studio
5. ✅ **Sync**: Run `npx @plasmicapp/cli sync` locally
6. ✅ **Deploy**: Commit and push to Git

## Workflow Summary

```
1. Edit in Plasmic Studio → 
2. Publish in Plasmic → 
3. Run `plasmic sync` locally → 
4. Commit & push to Git → 
5. Deploy to Cloudflare Pages → 
6. Changes live on nxoland.com
```

That's it! You're ready to start designing! 🎨

