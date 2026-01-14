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
│   │   ├── globals.css           # Global styles + CSS vars
│   │   └── api/                  # Shared API routes
│   │
│   ├── components/
│   │   ├── portal/               # Portal management system
│   │   │   ├── Portal.tsx        # Wrapper shell for portals
│   │   │   ├── PortalManager.tsx # Layout coordinator (Grid vs Carousel)
│   │   │   └── ...
│   │   ├── DashboardHeader.tsx   # Live greeting + pulse
│   │   ├── PortalIconBar.tsx     # The Native Dock
│   │   └── ThemeWatcher.tsx      # Dynamic accent coordinator
│   │
│   ├── portals/                  # Each subfolder is a complete app
│   │   ├── weather/              # Weather Portal
│   │   ├── crypto/               # Crypto Portal
│   │   ├── voice/                # Voice Memo (IndexedDB)
│   │   ├── ai/                   # AI Tech Portal
│   │   └── ...                   # Other apps
│   │
│   ├── lib/
│   │   ├── stores/
│   │   │   └── portalStore.ts    # Global portal management
│   │   └── storage.ts            # LocalStorage & IndexedDB utils
│   │
│   └── types/
│       └── portal.ts             # Portal interface definitions
│
├── public/
└── package.json
```

## Technical Details

### Window Management

Each portal has:
```typescript
interface PortalState {
  id: string;
  type: PortalType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  isOpen: boolean;
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

### Step 1: Create Portal Structure

```bash
src/portals/my-new-app/
├── MyNewApp.tsx           # Entry point
├── components/            # App-specific components
├── store.ts               # State management
└── ...
```

### Step 2: Register Portal Type

Update `src/types/portal.ts`:
```typescript
export type PortalType = 'weather' | 'crypto' | 'news' | 'my-new-app' | ...;
```

### Step 3: Add to Portal Registry

Update `src/components/portal/PortalManager.tsx` to render your app when portal type matches.

### Step 4: Add Launcher

Add to the `portalIcons` array in `src/components/PortalIconBar.tsx`.

## UI/UX Design System
 
### Core Philosophy: Minimalist Glassmorphism
 
The UI is built on a "Glass OS" metaphor—clean, translucent layers that feel like a unified operating system, not just a website.
 
### Strict Design Rules for Portals

1.  **Fixed Chrome**:
    *   The portal frame *is* the header. Titles are managed centrally in `Portal.tsx`.
    *   Content area should never repeat the app title.

2.  **Navigation & Tabs**:
    *   Use the integrated tab system for sub-views.
    *   Active tabs use a subtle white/20 overlay; inactive are translucent.

3.  **Dynamic Aesthetics (Pro-Level Features)**:
    *   **3D Tilt**: Portals use `framer-motion` to respond to mouse movement with a subtle 3D rotation, creating depth.
    *   **Accent Theming**: The dashboard uses a `ThemeWatcher` to update `--accent-primary` variables based on time of day (Sunrise, Day, Sunset, Night).
    *   **Z-Index Peek**: Hovering over a dock icon triggers a glow and scale effect on the corresponding portal.

4.  **Mobile-First Interaction**:
    *   **Native Dock**: The bottom toolbar uses horizontal scrolling with faded glass edges and scroll-snapping.
    *   **Card Deck Layout**: On small screens, portals switch from a grid to a horizontal carousel with pagination dots.
    *   **Responsive Forms**: Input sections (like in QuickSave) stack vertically on mobile to maximize tap targets.

5.  **Storage Standards**:
    *   **Metadata**: LocalStorage for UI state and small preferences.
    *   **Binary/Large Data**: IndexedDB (via `idb`) for high-performance storage (e.g., Voice Memos).

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
| Framework | Next.js 14+ | App Router, Dynamic UX |
| State | Zustand | Lightweight storage & UI sync |
| Animation | Framer Motion | 3D Tilt, Card Deck transitions |
| Storage | IndexedDB | High-capacity binary storage (Voice) |
| Audio | MediaRecorder API | Native high-quality audio capture |
| Styling | Tailwind + CSS Vars | Dynamic themes and layout |

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
