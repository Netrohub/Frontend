# How to Edit Your Existing Design in Plasmic

## Overview

You want to edit your current Home page design in Plasmic Studio. Here's how to bring your existing design into Plasmic and edit it visually.

## Current Status

✅ **Components Registered**: Button, Card, and sub-components are now registered  
✅ **Host Page Ready**: `/plasmic-host` route is set up  
✅ **Codegen Configured**: Ready to sync changes back to your codebase

## Step-by-Step: Recreate Your Home Page in Plasmic

### Step 1: Access Plasmic Studio

1. Go to: https://studio.plasmic.app/projects/1Hn4NBB5sATdK2CZK8S6bB
2. Make sure your Host URL is set to: `https://nxoland.com/plasmic-host`

### Step 2: Recreate Your Home Page Structure

Your current Home page has these sections:

1. **Hero Section** (lines 67-146)
   - Badge with snowflake icon
   - Main heading (title)
   - Subtitle text
   - Two CTA buttons
   - Feature badges (3 icons with text)

2. **Features Grid** (lines 148+)
   - Section with feature cards

3. **Footer** (lines 260+)
   - Social links (WhatsApp, Discord)
   - Copyright text

### Step 3: Build in Plasmic Studio

#### A. Hero Section

1. **Add a Section/Container** for the hero
   - Set background to match: `hsl(200,70%,15%)` to `hsl(195,60%,25%)` gradient
   - Center content, add padding

2. **Add Badge**:
   - Use a Box/Container
   - Add snowflake icon (or text icon)
   - Add text: "منصة تداول آمنة" (or your badge text)
   - Style with border, background, backdrop blur

3. **Add Main Heading**:
   - Use Heading component
   - Text: Your hero title
   - Style: Large text, white, bold, shadow

4. **Add Subtitle**:
   - Use Text component
   - Text: Your subtitle
   - Style: Medium text, white/70 opacity

5. **Add Buttons**:
   - **Button 1**: "تصفح الحسابات" (Browse Accounts)
     - Use your registered **Button** component
     - Variant: Custom (you'll style it)
     - Link to: `/marketplace`
   - **Button 2**: "تعرف على المزيد" (Learn More) or "كيف تعمل المنصة"
     - Use your registered **Button** component
     - Variant: outline/secondary
     - Link to: `/auth` or scroll action

6. **Add Feature Badges** (3 items):
   - Use Box/Container for each
   - Add icon + text
   - Style with border, background

#### B. Features Section

1. **Add Section** for features grid
2. **Add Heading**: "مميزات المنصة" (Platform Features)
3. **Add Grid Layout** (2-3 columns)
4. **Add Feature Cards**:
   - Use your registered **Card** component
   - Each card has:
     - Icon
     - Title (CardTitle)
     - Description (CardDescription)
   - Style to match your design

#### C. Footer Section

1. **Add Footer Container**
2. **Add Social Links**:
   - WhatsApp link
   - Discord link
3. **Add Copyright Text**

### Step 4: Match Your Styling

Your design uses:

- **Background**: `gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]`
- **Colors**:
  - Primary: `hsl(195,80%,50%)` (cyan/blue)
  - Text: White with various opacities
  - Borders: White with opacity
- **Spacing**: Large padding (py-24, py-32)
- **Typography**: Large headings (text-5xl, text-7xl)

Apply these in Plasmic Studio's style panel.

### Step 5: Add Dynamic Content (Optional)

For text content that changes:
- Use Plasmic's text content slots
- Or use code components that read from your translation system

For now, hardcode the Arabic text, then we can make it dynamic later.

### Step 6: Publish and Sync

1. **Click Publish** in Plasmic Studio
2. **Sync locally**:
   ```bash
   cd frontend
   npx @plasmicapp/cli sync
   ```
3. **Preview** at `/plasmic-homepage`
4. **Switch route** when ready:
   - Edit `App.tsx`:
   ```tsx
   <Route path="/" element={<Homepage />} />
   ```

## Tips

### Using Your Registered Components

- **Button**: Look for "Button" in the Components panel
- **Card**: Look for "Card", "CardHeader", "CardTitle", etc.

### Matching Your Design

1. **Copy exact colors**: Use your HSL color values
2. **Match spacing**: Use the same padding/margin values
3. **Match typography**: Use similar font sizes and weights
4. **Test responsively**: Check mobile and desktop views

### Adding More Components

If you need more components registered (like Navbar, Footer, etc.), add them to `plasmic-registration.ts`:

```typescript
import { Navbar } from "@/components/Navbar";

registerComponent(Navbar, {
  name: "Navbar",
  props: {
    // Define props
  },
  importPath: "./components/Navbar",
});
```

Then reload Plasmic Studio.

## Current Limitations

- **Navbar/BottomNav**: Not registered yet (add if needed)
- **Snow particles animation**: May need custom code component
- **Dynamic text** (translation system): May need custom integration
- **Icons** (lucide-react): Register icon components if needed

## Quick Start Checklist

- [ ] Components registered (✅ Done)
- [ ] Host URL configured in Plasmic Studio
- [ ] Start recreating Hero section
- [ ] Add Features section
- [ ] Add Footer section
- [ ] Match styling (colors, spacing, typography)
- [ ] Publish in Plasmic
- [ ] Sync locally
- [ ] Preview and adjust
- [ ] Switch route when ready

## Need Help?

If you get stuck:
1. Check component props in Plasmic Studio right panel
2. Verify components are registered (should appear in Components tab)
3. Make sure Host URL is correct
4. Check browser console for errors

Start by recreating just the Hero section first, then add the rest piece by piece!

