# Plasmic Codegen Setup

## Overview
This project uses Plasmic Codegen, which generates React components statically into your codebase. This is different from the React Loader approach, where components are fetched at runtime.

## Setup Complete ✅

1. **Installed Plasmic CLI**: `@plasmicapp/cli` is installed globally and locally
2. **Authenticated**: Credentials saved to `~/.plasmic.auth`
3. **Synced Project**: Components generated to `src/components/plasmic/`
4. **Updated Routes**: App now uses generated components instead of loader

## Generated Files

- **Wrapper Component**: `src/components/Homepage.tsx` (you can edit this)
- **Blackbox Component**: `src/components/plasmic/blank_website/PlasmicHomepage.tsx` (auto-generated, don't edit)
- **Configuration**: `plasmic.json` (contains sync settings)
- **Lock File**: `plasmic.lock` (tracks component versions)

## How It Works

1. **Design in Plasmic Studio**: Create/edit pages and components in Plasmic
2. **Sync to Codebase**: Run `plasmic sync` to generate React components
3. **Use in Routes**: Import and use generated components in your React Router routes

## Commands

### Sync components from Plasmic:
```bash
cd frontend
npx @plasmicapp/cli sync
```

### Watch for changes (auto-sync):
```bash
cd frontend
npx @plasmicapp/cli watch
```

### Sync specific project version:
```bash
npx @plasmicapp/cli sync -p PROJECT_ID@version-name
```

## Current Configuration

- **Project ID**: `1Hn4NBB5sATdK2CZK8S6bB`
- **Generated Component**: `Homepage` (path: `/`)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Images**: Inlined as base64

## Route Integration

The generated `Homepage` component is now used for the `/` route in `App.tsx`. To add more Plasmic pages:

1. Create a new page in Plasmic Studio
2. Set the route path in Plasmic (e.g., `/about`)
3. Run `plasmic sync`
4. Import the generated component in `App.tsx`
5. Add a route: `<Route path="/about" element={<About />} />`

## Plasmic Studio Connection

The `/plasmic-host` route is still available for Plasmic Studio to connect and preview your app. It uses `PlasmicCanvasHost` from `@plasmicapp/react-web`.

## Advantages of Codegen

- ✅ **Type Safety**: Full TypeScript support for generated components
- ✅ **Performance**: No runtime fetching, components are bundled with your app
- ✅ **Version Control**: All generated code is in your repo
- ✅ **No CSP Issues**: Static files don't need special CSP directives
- ✅ **Better IDE Support**: Full autocomplete and IntelliSense

## Troubleshooting

### Components not updating?
- Make sure you've published your changes in Plasmic Studio
- Run `plasmic sync` to pull latest changes
- Check `plasmic.json` to ensure project ID is correct

### Build errors?
- Make sure `@plasmicapp/react-web` is installed: `npm install @plasmicapp/react-web`
- Check that generated components are in the correct directory
- Verify TypeScript paths in `tsconfig.json` resolve correctly

## Next Steps

1. Create more pages in Plasmic Studio
2. Sync them with `plasmic sync`
3. Add routes in `App.tsx` for each page
4. Customize wrapper components in `src/components/` as needed

