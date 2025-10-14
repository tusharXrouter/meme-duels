# Meme Duels

A Next.js application with TanStack Query for efficient data fetching and state management.

## Features

- ⚡ **Next.js 15** with App Router
- 🔄 **TanStack Query** for server state management
- 🎨 **Tailwind CSS** for styling
- 📝 **TypeScript** for type safety
- 🛠️ **Custom hooks** for API operations
- 📁 **Organized folder structure**

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── health/        # Health check endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── providers/         # Context providers
│   │   └── query-provider.tsx
│   └── health-status.tsx  # Health status component
├── hooks/                 # Custom React hooks
│   └── use-api.ts         # API hooks with TanStack Query
├── lib/                   # Library configurations
│   └── query-client.ts    # TanStack Query client config
├── types/                 # TypeScript type definitions
│   └── api.ts            # API response types
└── utils/                 # Utility functions
    ├── api.ts            # API utilities
    ├── format.ts         # Formatting utilities
    └── validation.ts     # Validation utilities
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## TanStack Query Setup

The application is configured with TanStack Query for efficient data fetching:

### Query Provider
- Located in `src/components/providers/query-provider.tsx`
- Wraps the entire application
- Includes React Query DevTools for development

### Custom Hooks
- `useApiQuery`: Generic hook for GET requests
- `useApiMutation`: Generic hook for POST/PUT/DELETE requests
- `useHealthCheck`: Specific hook for health check endpoint

### Configuration
- Default stale time: 1 minute
- Default garbage collection time: 10 minutes
- Retry attempts: 1
- Disabled refetch on window focus

## Available Utilities

### API Utilities (`src/utils/api.ts`)
- `fetchApi<T>`: Generic fetch wrapper with error handling
- `createApiUrl`: URL builder for API endpoints
- `ApiError`: Custom error class for API errors

### Format Utilities (`src/utils/format.ts`)
- `formatDate`: Format dates in readable format
- `formatDateTime`: Format date and time
- `formatRelativeTime`: Show relative time (e.g., "2 hours ago")
- `truncateText`: Truncate text with ellipsis
- `formatNumber`: Format numbers with K/M suffixes

### Validation Utilities (`src/utils/validation.ts`)
- `isValidEmail`: Email validation
- `isValidUrl`: URL validation
- `isNotEmpty`: Empty string validation
- `isValidLength`: Length validation

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns system status, timestamp, and uptime
- Used by the `HealthStatus` component

## Development

### Adding New API Endpoints
1. Create a new route in `src/app/api/`
2. Add corresponding types in `src/types/api.ts`
3. Create custom hooks in `src/hooks/use-api.ts`

### Adding New Components
1. Create component in `src/components/`
2. Use the provided utility functions
3. Leverage TanStack Query for data fetching

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Dependencies

### Core
- `next`: 15.4.7
- `react`: 19.1.0
- `react-dom`: 19.1.0

### Data Fetching
- `@tanstack/react-query`: TanStack Query for server state
- `@tanstack/react-query-devtools`: Development tools

### Development
- `typescript`: Type safety
- `tailwindcss`: Styling
- `eslint`: Code linting

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
