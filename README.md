# NXOLand Frontend

Modern React application for NXOLand marketplace platform built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Analyze bundle size
npm run analyze
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── Navbar.tsx   # Main navigation
│   ├── SEO.tsx      # SEO meta tags component
│   └── ...
├── contexts/        # React contexts
│   └── AuthContext.tsx
├── pages/           # Page components
│   ├── Home.tsx
│   ├── Marketplace.tsx
│   └── ...
├── lib/             # Utilities and API client
│   ├── api.ts       # API client
│   └── utils/       # Utility functions
├── config/          # Configuration
│   ├── constants.ts # Application constants
│   └── env.ts       # Environment variables
├── types/           # TypeScript type definitions
│   └── api.ts
└── hooks/           # Custom React hooks
```

## 🏗️ Architecture

### State Management
- **React Query** (`@tanstack/react-query`) for server state
- **React Context** for authentication state
- **Local State** with `useState` for component state

### Routing
- **React Router v6** for client-side routing
- **Code Splitting** with lazy loading for performance
- **Protected Routes** with authentication guards
- **Admin Routes** with role-based access control

### API Integration
- Centralized API client (`src/lib/api.ts`)
- Type-safe API responses
- Automatic error handling
- Request deduplication via React Query

### Performance Optimizations
- **Code Splitting**: Lazy loading for routes
- **React Query Caching**: Configurable cache times
- **Memoization**: `useMemo` for expensive computations
- **Image Optimization**: Lazy loading for images
- **Bundle Optimization**: Manual chunks configuration

## 🔒 Security Features

- **Route Protection**: Authentication required for protected routes
- **Role-Based Access**: Admin routes require admin role
- **Input Sanitization**: All user inputs sanitized
- **Environment Variables**: Validated at startup
- **Error Boundaries**: Graceful error handling
- **CSRF Protection**: Via Laravel Sanctum

## ♿ Accessibility

- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Full keyboard support
- **Skip Links**: Jump to main content
- **Focus Indicators**: Visible focus styles
- **Screen Reader Support**: Semantic HTML and ARIA
- **Color Contrast**: WCAG AA compliant

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible components
- **Custom Theme**: Dark theme with Arabic RTL support
- **Responsive Design**: Mobile-first approach

## 📦 Key Dependencies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Routing
- **React Query**: Data fetching
- **Tailwind CSS**: Styling
- **Radix UI**: Accessible components
- **Lucide React**: Icons
- **Sonner**: Toast notifications

## 🔧 Configuration

### Environment Variables

Create `.env` file (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GTM_ID=your-gtm-id
```

### Constants

Application constants are centralized in `src/config/constants.ts`:
- Cache times
- Price thresholds
- Validation rules
- Animation config
- Escrow settings

## 🧪 Testing

```bash
# Run linter
npm run lint

# Run tests (when implemented)
npm test
```

## 📝 Code Style

- **TypeScript Strict Mode**: Enabled
- **ESLint**: Configured for React
- **Prettier**: Code formatting (if configured)
- **Conventions**: 
  - Use functional components
  - Prefer named exports
  - Type all props and state
  - Use constants for magic numbers

## 🚀 Deployment

### Build Process

```bash
npm run build
```

Outputs to `dist/` directory.

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API base URL set correctly
- [ ] Build succeeds without errors
- [ ] All routes work correctly
- [ ] Authentication flow tested
- [ ] Error boundaries tested
- [ ] Performance metrics checked

## 📚 Documentation

- **API Integration**: See `src/lib/api.ts`
- **Type Definitions**: See `src/types/api.ts`
- **Component Documentation**: JSDoc comments (in progress)
- **Accessibility Guide**: See `ACCESSIBILITY_IMPROVEMENTS.md`
- **Fixes Applied**: See `FIXES_APPLIED.md`

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
- Check TypeScript errors: `npm run build`
- Verify all imports are correct
- Ensure environment variables are set

**API Errors:**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration on backend
- Verify authentication tokens

**Performance Issues:**
- Run bundle analyzer: `npm run analyze`
- Check React Query cache configuration
- Verify code splitting is working

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use TypeScript types (no `any`)
3. Add ARIA labels to new components
4. Test accessibility with keyboard navigation
5. Follow existing code style
6. Update documentation as needed

## 📄 License

Proprietary - NXOLand Platform

## 🔗 Links

- Backend API: See `backend/README.md`
- Design System: See component documentation
- Deployment: See `CLOUDFLARE_DEPLOYMENT.md`

---

**Last Updated**: January 2025
