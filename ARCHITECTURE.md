# Portal Wall Architecture

## Vision

Portal Wall reimagines how we interact with multiple web applications. Instead of opening dozens of browser tabs or switching between different websites, all applications run simultaneously in **separate windows within a single page** - creating a desktop-like experience in the browser.

## Core Concept: Windows vs Widgets

⚠️ **Important Distinction**: 

- **NOT Widgets**: Simple, single-purpose UI components (clock, weather icon, etc.)
- **Windows**: Complete, full-featured web applications that happen to run within the portal

Each window is a **standalone application** with:
- Multiple pages/views with internal routing
- Complex state management
- Full feature sets (not simplified versions)
- Independent data fetching and APIs
- Rich, interactive UIs

Think of it as running multiple separate websites simultaneously, not a dashboard with simple widgets.

## Architecture Choice: Option 3 - Hybrid Monorepo

### Why This Approach?

After evaluating three options, we chose the **Hybrid Single Monorepo** architecture:

**✅ Advantages:**
- Single Next.js application - easier development workflow
- Each window is still a complete, isolated application
- Easy code sharing between windows
- Single deployment and build process
- No iframe complexity or cross-origin issues
- Can migrate to separate apps later if needed

**Compared to alternatives:**
- **vs Separate Repos + iframes**: Simpler, but less isolation
- **vs Module Federation**: Easier to set up, less complex tooling

### Project Structure

```
portal-wall/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main portal shell
│   │   ├── layout.tsx            # Root layout
│   │   └── api/                  # Shared API routes (optional)
│   │
│   ├── components/
│   │   └── portal/               # Window management system
│   │       ├── PortalShell.tsx   # Main container
│   │       ├── Window.tsx        # Draggable/resizable wrapper
│   │       ├── WindowHeader.tsx  # Title bar + controls
│   │       ├── Taskbar.tsx       # Bottom taskbar
│   │       └── WindowManager.tsx # Window state coordinator
│   │
│   ├── windows/                  # Each subfolder is a complete app
│   │   ├── weather/
│   │   │   ├── WeatherApp.tsx    # Root component (entry point)
│   │   │   ├── pages/            # Internal pages/views
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Forecast.tsx
│   │   │   │   ├── Maps.tsx
│   │   │   │   └── Settings.tsx
│   │   │   ├── components/       # Weather-specific components
│   │   │   ├── hooks/            # Custom hooks
│   │   │   ├── lib/              # Utilities
│   │   │   ├── api/              # Data fetching
│   │   │   ├── types/            # TypeScript types
│   │   │   └── store/            # State management (zustand)
│   │   │
│   │   ├── stocks/
│   │   │   ├── StocksApp.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Watchlist.tsx
│   │   │   │   ├── Portfolio.tsx
│   │   │   │   └── Charts.tsx
│   │   │   └── ...
│   │   │
│   │   └── news/
│   │       ├── NewsApp.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── stores/
│   │   │   └── windowStore.ts    # Global window management state
│   │   ├── hooks/
│   │   │   └── useWindowManager.ts
│   │   └── utils/
│   │       └── localStorage.ts   # Persist window positions
│   │
│   └── types/
│       └── window.ts             # Window interface definitions
│
├── public/
└── package.json
```

## Technical Details

### Window Management

Each window has:
```typescript
interface Window {
  id: string;
  type: 'weather' | 'stocks' | 'news' | ...;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}
```

### State Management

- **Global (Zustand)**: Window positions, sizes, open/closed state, focus management
- **Local (React State/Zustand)**: Each window app manages its own internal state independently

### Routing Strategy

- **Portal Level**: Next.js App Router (`/` route)
- **Window Level**: React Router DOM for in-window navigation
  - Example: Weather window internally routes between `/forecast`, `/maps`, `/settings`
  - These routes don't affect the browser URL

### Communication Between Windows

Windows can communicate via:
1. **Zustand store** - Shared state for inter-window communication
2. **Custom events** - Event-driven messaging
3. **Shared API routes** - Server-side data coordination

## Adding New Windows

### Step 1: Create Window Structure

```bash
src/windows/my-new-app/
├── MyNewApp.tsx           # Entry point
├── pages/                 # Internal views
├── components/            # App-specific components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
├── api/                   # Data fetching
└── store/                 # State management
```

### Step 2: Register Window Type

Update `src/types/window.ts`:
```typescript
type WindowType = 'weather' | 'stocks' | 'news' | 'my-new-app';
```

### Step 3: Add to Window Registry

Update `src/components/portal/WindowManager.tsx` to render your app when window type matches.

### Step 4: Add Launcher

Add a button/icon to open the new window in the portal shell.

## Design Principles

1. **Isolation**: Each window app should be self-contained
2. **Independence**: Windows don't depend on each other's internal state
3. **Consistency**: Use shared UI components from `components/portal/` for window chrome
4. **Performance**: Lazy load window apps, unmount when closed
5. **Persistence**: Save window positions and states to localStorage

## Future Considerations

### When to Migrate to Separate Repos

Consider splitting into separate applications (Option 1) when:
- Individual windows exceed 10,000+ LOC
- Different teams own different windows
- Windows need independent deployment cycles
- Performance isolation becomes critical

### Potential Migrations

```
Single App → Turborepo Monorepo → Independent Repos + Module Federation
```

Each window can be extracted without changing its internal structure.

## Technologies

| Purpose | Technology | Why |
|---------|-----------|-----|
| Framework | Next.js 14+ | App Router, React Server Components |
| Drag/Resize | react-rnd | Proven library for window management |
| State | Zustand | Lightweight, easy to use |
| Routing | React Router DOM | Client-side routing within windows |
| Styling | Tailwind CSS | Utility-first, rapid development |
| Animation | Framer Motion | Smooth window transitions |

## Performance Considerations

### Window Lifecycle
- **Mounting**: Windows lazy-load when opened
- **Unmounting**: Windows unmount when closed to free memory
- **Minimized**: Minimized windows remain mounted but hidden (can be optimized later)

### Data Fetching
- Each window manages its own data fetching
- Consider using SWR or React Query for caching
- Shared data can use Next.js API routes

### Optimization Strategies
- Code splitting per window app
- Virtualization for window lists if many windows open
- Debounce window position updates during drag
- Throttle resize calculations

## Security Considerations

- Sanitize all user inputs in window apps
- Validate data from external APIs
- Use Content Security Policy headers
- Implement rate limiting on API routes

## Testing Strategy

### Unit Tests
- Test individual window components
- Test window management logic
- Test state management

### Integration Tests
- Test window interactions
- Test drag/resize functionality
- Test window focus management

### E2E Tests
- Test complete user workflows
- Test multiple windows open simultaneously
- Test window state persistence

## References

- Initial architecture discussion: January 8, 2026
- Design decisions: This document
- Window development guide: See "Adding New Windows" section above
