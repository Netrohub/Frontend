# Plasmic Integration Setup

## ✅ Installation Complete

Plasmic has been successfully integrated into your React/Vite application.

## Configuration

### 1. Update Project ID and API Token

Edit `src/plasmic-init.ts` and replace:

```typescript
{
  id: "PROJECTID",  // Replace with your Plasmic project ID
  token: "APITOKEN"  // Replace with your Plasmic API token
}
```

**To find these values:**
1. Open your project in Plasmic Studio: https://studio.plasmic.app
2. **Project ID**: Found in the URL: `https://studio.plasmic.app/projects/PROJECTID`
3. **API Token**: Click the "Code" toolbar button in Plasmic Studio to see the public API token

### 2. Development vs Production

In `src/plasmic-init.ts`:

```typescript
preview: true,  // Development: fetches latest revisions
preview: false, // Production: only fetches published changes
```

**For production**, set `preview: false` to ensure only published changes are rendered.

## How It Works

### Auto-loading Plasmic Pages

All Plasmic-defined pages are automatically rendered at the routes you specify in Plasmic Studio. The catch-all route (`CatchAllPlasmicPage`) will:

1. Check if a Plasmic page exists for the current route
2. If found, render the Plasmic component
3. If not found, show the 404 page

### Plasmic Studio Host Route

The `/plasmic-host` route is set up for Plasmic Studio to connect to your local/dev server.

## Next Steps

### 1. Start Your Dev Server

```bash
cd frontend
npm run dev
```

### 2. Verify Plasmic Host

Visit: `http://localhost:5173/plasmic-host`

You should see a confirmation message indicating Plasmic Studio can connect.

### 3. Configure Plasmic Project

1. Open https://studio.plasmic.app
2. Click the menu for your project
3. Select "Configure project"
4. Set the host URL to: `http://localhost:5173/plasmic-host`
5. Re-open/reload the project

**For production**, update the host URL to your production domain:
`https://your-domain.com/plasmic-host`

### 4. Create Pages in Plasmic

1. Create pages in Plasmic Studio
2. Set routes for each page (e.g., `/landing`, `/features`)
3. Publish the pages
4. They will automatically be available at those routes in your app

## Adding Custom Code Components

To make your React components available in Plasmic Studio:

### Step 1: Create a Component

Create a simple component in `src/components/`:

```typescript
// src/components/HelloWorld.tsx
import * as React from 'react';

export interface HelloWorldProps {
  children?: React.ReactNode;
  className?: string;
  verbose?: boolean;
}

export function HelloWorld({ children, className, verbose }: HelloWorldProps) {
  return (
    <div className={className} style={{ padding: '20px' }}>
      <p>Hello there! {verbose && 'Really nice to meet you!'}</p>
      <div>{children}</div>
    </div>
  );
}
```

### Step 2: Register in Plasmic

Add to `src/plasmic-init.ts`:

```typescript
import { HelloWorld } from './components/HelloWorld';

// After PLASMIC initialization
PLASMIC.registerComponent(HelloWorld, {
  name: 'HelloWorld',
  props: {
    verbose: 'boolean',
    children: 'slot'
  }
});
```

### Step 3: Use in Plasmic Studio

After restarting your dev server, the component will appear in Plasmic Studio's insert menu!

## Routes

### Existing Routes (Unchanged)

All your existing routes continue to work:
- `/` - Home
- `/marketplace` - Marketplace
- `/product/:id` - Product Details
- `/admin/*` - Admin routes
- etc.

### Plasmic Routes

Any routes you define in Plasmic Studio will automatically work:
- `/landing` - If you create a page with route `/landing` in Plasmic
- `/features` - If you create a page with route `/features` in Plasmic
- etc.

### Plasmic Host Route

- `/plasmic-host` - Special route for Plasmic Studio (not for end users)

## Troubleshooting

### Plasmic pages not loading?

1. Check that `PROJECTID` and `APITOKEN` are correct in `plasmic-init.ts`
2. Verify the page exists in Plasmic Studio
3. Check browser console for errors
4. Ensure `preview: true` in development

### 404 for Plasmic routes?

1. Make sure the route matches exactly what's set in Plasmic Studio
2. Ensure the page is published (or `preview: true` is set)
3. Check that the page exists in your Plasmic project

### Plasmic Studio can't connect?

1. Make sure your dev server is running
2. Visit `http://localhost:5173/plasmic-host` to verify it's accessible
3. Check that the host URL in Plasmic Studio matches your local URL
4. For production, use your production domain

## Learn More

- [Plasmic Documentation](https://docs.plasmic.app)
- [Code Components Guide](https://docs.plasmic.app/learn/code-components)
- [Plasmic React Integration](https://docs.plasmic.app/learn/react-integration)

