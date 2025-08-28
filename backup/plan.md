# CreatorGrid Plan

## Overview
CreatorGrid is a simple web app for content creators to dump and organize ideas.  
Stack: Next.js 14 (App Router), React, TypeScript, Tailwind, shadcn/ui, next-themes.  
Style: Clean, minimal, rounded edges, light/dark mode, responsive, Aesthetically pretty with clean and smooth gradients.
Package manager: npm.

## Pages
- **Home**: Greeting (“Welcome [NAME]”), “What are you cooking?”, input to set `[NAME]` (stored in localStorage). Navigation buttons to other pages.
- **Brain Dump**: Page to jot down quick notes/ideas. Start with text input; voice recording/transcription can be added later.
- **Projects**: Organized list of content projects with details (Title, Type, Status, Script link, Publish Date, Sponsor/Ad). Add button for new project.
- **Calendar**: Visual calendar of scheduled uploads. Syncs with project publish dates. Future: connect with Google/Apple Calendar.

## Navbar
- Visible on all pages except Home.
- Links: Brain Dump, Projects, Calendar.
- Theme toggle (light/dark).

## Notes
- Build in small steps. 
- Prioritize testing/previewing each page before adding complexity.
Phase 1 data is client-side only via localStorage.

## Developer Goals
- Keep code modular and organized so new features can be added later.  
- Write clean, minimal, and well-commented code.  
- Prefer simplicity over unnecessary libraries or complexity.  
- Ensure responsiveness and accessibility from the start.  
- Future-proof where possible (voice input, calendar sync, more platforms).

## Roadmap
- **Phase 1 (MVP)**: Home, Brain Dump (text only), Projects (basic fields), Calendar (basic view).  
- **Phase 2 (Future)**: Voice input + transcription, external calendar sync, additional platforms beyond YouTube, advanced project tracking. 

## Acceptance (Phase 1 quick checks)
- Home: name persists to localStorage, buttons navigate, navbar hidden.
- Brain Dump: can add/edit/delete a text note; persists for the session.
- Projects: can add a project with Title/Type/Status/Script/Publish Date/Sponsor; list renders.
- Calendar: shows items for chosen Publish Dates from Projects.