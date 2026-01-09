# Portal Wall

A web-based desktop environment where multiple complete web applications run simultaneously in draggable, resizable windows - all within a single browser tab.

## 🎯 Concept

Portal Wall is like having multiple websites open in separate windows on your desktop, but everything runs in one browser tab. Each "window" is not a simple widget, but a **complete, full-featured web application** with its own routing, state management, and UI.

## 🏗️ Architecture

This project uses a **hybrid monorepo architecture** where:
- One Next.js application serves as the portal shell
- Each window is a complete mini-application within the monorepo
- Windows can have multiple pages, complex state, and full functionality

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

## 🪟 Planned Windows

- **Weather App**: Complete weather application with forecasts, maps, and multiple locations
- **Stock Tracker**: Full-featured stock tracking with charts, watchlists, and portfolio management
- **News Reader**: Comprehensive news site with categories, search, and saved articles
- **Calendar**: Event management and scheduling
- **Notes**: Full note-taking application
- **And more...**

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🛠️ Tech Stack

- **Next.js 14+** - App Router
- **React 18** - UI framework
- **TypeScript** - Type safety
- **react-rnd** - Draggable/resizable windows
- **Zustand** - Window state management
- **React Router DOM** - In-window routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## 📁 Project Structure

```
portal-wall/
├── src/
│   ├── app/                    # Next.js App Router (portal shell)
│   ├── components/portal/      # Window management components
│   ├── windows/                # Complete mini-applications
│   │   ├── weather/           # Full weather app
│   │   ├── stocks/            # Full stock tracking app
│   │   └── news/              # Full news reader app
│   └── lib/                    # Shared utilities
```

## 🎨 Features

- ✅ Draggable and resizable windows
- ✅ Each window is a complete application
- ✅ Window state persistence (positions, sizes)
- ✅ Minimize/maximize/close windows
- ✅ Taskbar with active windows
- ✅ Focus management
- 🔲 User accounts and preferences
- 🔲 Custom themes
- 🔲 Window snapping

## 📝 Adding New Windows

Each window is a self-contained application. See [ARCHITECTURE.md](./ARCHITECTURE.md) for guidelines on creating new windows.

## 👤 Git Configuration

This repository is configured with a custom author:
- **Name**: harip
- **Email**: charanp@gmail.com

## 📄 License

MIT
