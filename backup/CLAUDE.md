# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CreatorGrid is a content creator productivity app built with Next.js 14, TypeScript, and Tailwind CSS. The app provides tools for brain dumping ideas, managing content projects, and tracking publishing schedules.

## Tech Stack & Dependencies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Theme**: next-themes for light/dark mode switching
- **Storage**: localStorage for user preferences and data
- **Package Manager**: npm

## Development Commands

```bash
# Project setup (if not already initialized)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking (add to package.json)

# shadcn/ui component installation
npx shadcn-ui@latest init -y
npx shadcn-ui@latest add [component-name]

# Extra dependencies
npm install next-themes class-variance-authority tailwind-merge lucide-react
```


## Project Architecture
Pages:
- **Home (`/`)**: Greeting with name input (persisted via localStorage), navigation hub.
- **Brain Dump (`/brain-dump`)**: Quick note-taking interface (text-only for Phase 1).
- **Projects (`/projects`)**: Content project management with fields for title, type, status, script link, publish date, sponsor/ad info.
- **Calendar (`/calendar`)**: Visual calendar view synced with project dates.

Core components:
- `components/navbar.tsx`: Navigation (all pages except Home).
- `components/theme-toggle.tsx`: Light/dark mode switcher.
- `components/ui/`: shadcn/ui component library.
- `app/layout.tsx`: Root layout with theme provider.
- `app/globals.css`: Global styles.

Data: Use localStorage for name, projects, and notes. Client-side only for Phase 1. Structure data with TypeScript interfaces.

## Development Approach
- **Phase 1 (MVP)**: Home with name persistence, Brain Dump (text-only), Projects (basic fields), Calendar (basic visual view).
- **Phase 2**: Voice input, external calendar sync, advanced tracking, export/import.

Coding standards: Prioritize simplicity and clarity, write modular reusable components, ensure responsiveness, test each page thoroughly, and use TypeScript interfaces for data.

File Organization:
```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page
├── brain-dump/page.tsx     # Note-taking interface
├── projects/page.tsx       # Project management
├── calendar/page.tsx       # Calendar view
└── globals.css             # Global styles

components/
├── ui/                     # shadcn/ui components
├── navbar.tsx              # Main navigation
└── theme-toggle.tsx        # Theme switcher
```

### Future Enhancements (Phase 2)
- Voice recording and transcription for brain dump
- External calendar API integration (Google Calendar, etc.)
- Advanced project tracking and analytics
- Export/import functionality

## Design Principles
- Clean, minimal interface focusing on productivity
- Accessibility and responsive design prioritized
- Iterative development in small, testable increments
- Future-proof architecture for planned enhancements

## Testing Instructions
After each code step, Claude must provide:
1. Full file tree and changed/created files  
2. Exact terminal commands for Mac (npm)  
3. URL to open (`http://localhost:3000`)  
4. Simple checklist of what to verify (e.g., navigation works, name persists, theme toggle works)  

## Git Workflow Reminder
Source control is handled manually. After each major milestone (e.g., Home page working, Brain Dump added, Projects table created, Calendar view live), run:

```bash
git add .
git commit -m "Milestone: [short description]"
git push