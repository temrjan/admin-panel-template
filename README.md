# Admin Panel Template

Modern admin panel built with React, TypeScript, TanStack Query, and shadcn/ui.

## Features

- **React 18** + **TypeScript** + **Vite**
- **TanStack Query** for data fetching and caching
- **shadcn/ui** components (Radix UI based)
- **Tailwind CSS** for styling
- **Dark/Light/System** theme support
- **Responsive** sidebar navigation
- **Lazy loading** routes with code splitting
- **Zustand** for state management
- **React Hook Form** + **Zod** for form validation
- **Recharts** for dashboard charts
- **Framer Motion** for animations

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix UI) |
| Data Fetching | TanStack Query |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

## Project Structure

```
src/
├── app/                    # App configuration
│   ├── layouts/            # Layout components (MainLayout)
│   ├── providers/          # React providers (Query, Theme)
│   └── routes/             # Route components (PrivateRoute)
├── features/               # Feature modules (FSD architecture)
│   ├── auth/               # Authentication
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── types/
│   ├── dashboard/          # Dashboard with charts
│   ├── products/           # Products CRUD
│   ├── categories/         # Categories CRUD
│   ├── orders/             # Orders management
│   ├── users/              # Users management
│   └── settings/           # App settings
└── shared/                 # Shared code
    ├── api/                # API client, endpoints
    ├── components/         # Reusable components
    │   ├── common/         # ErrorBoundary, PageLoader, etc.
    │   ├── ui/             # shadcn/ui components
    │   └── upload/         # Image uploader
    └── types/              # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/admin-panel-template.git
cd admin-panel-template

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=/api/v1
```

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Customization

### 1. Update Branding

- Edit `src/app/layouts/MainLayout.tsx` - change logo and app name
- Replace `public/favicon.svg` with your favicon

### 2. Configure API Endpoints

Edit `src/shared/api/endpoints.ts`:

```typescript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  // Add your endpoints...
}
```

### 3. Add New Features

Create a new feature module in `src/features/`:

```
src/features/your-feature/
├── api/
│   └── yourFeatureApi.ts
├── hooks/
│   └── useYourFeature.ts
├── pages/
│   └── YourFeaturePage.tsx
├── components/
│   └── YourComponent.tsx
└── types/
    └── yourFeature.types.ts
```

### 4. Add Routes

Edit `src/App.tsx` to add new routes:

```tsx
const YourFeaturePage = lazy(() => import('./features/your-feature/pages/YourFeaturePage'))

// In Routes:
<Route
  path='/your-feature'
  element={
    <PrivateRoute>
      <MainLayout>
        <YourFeaturePage />
      </MainLayout>
    </PrivateRoute>
  }
/>
```

### 5. Update Navigation

Edit `src/app/layouts/MainLayout.tsx`:

```tsx
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/your-feature", label: "Your Feature", icon: YourIcon },
  // ...
]
```

## Nginx Configuration

Example nginx config for production:

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    root /var/www/your-app/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## License

MIT
