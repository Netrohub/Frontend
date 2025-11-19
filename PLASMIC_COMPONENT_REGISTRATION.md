# Plasmic Component Registration Guide

## Do You Need This?

**Short answer: NO, not right now.**

You can design pages in Plasmic Studio using Plasmic's built-in components without registering your own components.

## When You Might Want This

Register your components if you want to:

1. ✅ **Use your existing UI components** (Button, Card, Form, etc.) in Plasmic Studio
2. ✅ **Reuse business logic components** (ProductCard, ReviewCard, etc.)
3. ✅ **Ensure design consistency** by using your branded components
4. ✅ **Connect to your data** by registering components that fetch from your API

## Current Status

- ✅ **You can design without registration** - Plasmic has many built-in components
- ✅ **You can add registration later** - No need to do it now
- ⚠️ **Registration is optional** - Only register what you actually want to use

## How to Set Up (When You're Ready)

### For Codegen: Register in Host Page

Since you're using codegen, register components in your host page route:

**Option 1: Create a separate registration file**

Create `frontend/src/plasmic-registration.ts`:

```typescript
import { registerComponent } from "@plasmicapp/react-web/lib/host";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Register your Button component
registerComponent(Button, {
  name: "Button",
  props: {
    variant: {
      type: 'choice',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    },
    size: {
      type: 'choice',
      options: ['default', 'sm', 'lg', 'icon']
    },
    children: 'slot',
    disabled: 'boolean',
    asChild: 'boolean',
  },
  importPath: "./components/ui/button",
});

// Register Card components
registerComponent(Card, {
  name: "Card",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

registerComponent(CardHeader, {
  name: "CardHeader",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

registerComponent(CardTitle, {
  name: "CardTitle",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

// ... register other Card sub-components
```

**Option 2: Register in App.tsx (host route)**

Update your `/plasmic-host` route to import registrations:

```typescript
// In App.tsx, near the /plasmic-host route
import "../plasmic-registration"; // Import for side effects
```

### Full Example Registration File

Here's what a complete registration file might look like:

```typescript
// frontend/src/plasmic-registration.ts
import { registerComponent } from "@plasmicapp/react-web/lib/host";
import { PLASMIC } from "./plasmic-init";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Register Button
registerComponent(Button, {
  name: "Button",
  displayName: "Button",
  props: {
    variant: {
      type: 'choice',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      defaultValue: 'default',
    },
    size: {
      type: 'choice',
      options: ['default', 'sm', 'lg', 'icon'],
      defaultValue: 'default',
    },
    children: 'slot',
    disabled: 'boolean',
  },
  importPath: "./components/ui/button",
});

// Register Card
registerComponent(Card, {
  name: "Card",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

// ... etc for other components
```

Then in `App.tsx`, import it near the host route:

```typescript
// Near the top of App.tsx
import "./plasmic-registration"; // Side-effect import

// ... rest of your code

// The /plasmic-host route will now have access to registered components
<Route path="/plasmic-host" element={<PlasmicCanvasHost loader={PLASMIC} />} />
```

## Components You Could Register

You have many components that could be useful:

### UI Components (from `components/ui/`)
- ✅ Button, Card, Input, Label
- ✅ Dialog, Drawer, Sheet
- ✅ Form components
- ✅ Navigation components
- ✅ And many more...

### Custom Components (from `components/`)
- ✅ ReviewCard
- ✅ StatusBadge
- ✅ EmptyState
- ✅ Turnstile (if needed for forms)

## Recommendation

**For now**: 
- ✅ **Skip component registration** - Design your pages first
- ✅ **Use Plasmic's built-in components** - They're powerful and sufficient
- ✅ **Add registration later** - When you find yourself needing your specific components

**When ready**:
1. Design your pages in Plasmic Studio
2. If you need your custom components, register them
3. Add them to your designs
4. Sync and deploy

## Quick Start (If You Want to Try It)

1. **Create registration file**:
   ```bash
   touch frontend/src/plasmic-registration.ts
   ```

2. **Register a simple component** (like Button) as shown above

3. **Import in App.tsx**:
   ```typescript
   import "./plasmic-registration";
   ```

4. **Reload Plasmic Studio** - Your component should appear in the Components tab

## Summary

- ❌ **Don't need it now** - You can design without it
- ✅ **Optional** - Add it when you need your components
- ✅ **Easy to add later** - No rush to set it up
- ✅ **Helpful when needed** - Makes your custom components available in Studio

**Focus on designing your pages first, then register components if you need them!**

