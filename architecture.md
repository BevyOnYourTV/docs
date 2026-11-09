# Architecture

How the code is organised and how its parts fit together. The *why* of each choice is in
[`adr/`](adr/); this page describes **what exists now**.

This document is kept true by whoever changes the structure, in the same change. Paths under
`apps/web/` describe the `origin/develop` branch of `Main_app`, not its `main` branch, which is
still the template scaffold; the docs check ignores those paths for that reason. Sections are
added when the thing they describe exists, not before.

## 1. Layout

```
bevyonyourtv/                     workspace repository; holds the three below as submodules
├── Main_app/                     the product
│   ├── .github/                  CI workflow, and placeholder templates
│   ├── package.json              npm workspaces root and shared lockfile
│   └── apps/web/                 the web application
├── docs/                         this documentation and the Docusaurus site
└── poc_host_remote_connection/   throwaway reference (HTTPS static server, template apps)
```

The web application on `develop`:

```
apps/web/
├── index.html, console/index.html, controller/index.html    the three pages
├── src/home/          landing page for choosing a screen
├── src/console/       TV and desktop console: pages, components, mock data, router
├── src/controller/    phone controller: a placeholder page
├── src/shared/        accessibility helpers, app shell, configuration, Tailwind styles
├── src/components/ui/ shadcn/ui components
└── tests/             Vitest tests, by surface
```

## 2. Runtime and flows

The application is entirely client-side: `apps/web/vite.config.ts` builds three independent
entry points, and no server or real-time link exists yet.

- `/` loads `apps/web/src/home/main.tsx`.
- `/console/` loads `apps/web/src/console/main.tsx`, which initialises spatial navigation and
  mounts the router in `apps/web/src/console/router.tsx`: main menu, `games`,
  `games/:gameId/lobby`, `lobby` and `settings`.
- `/controller/` loads `apps/web/src/controller/main.tsx`, which shows a static page.

Data: the players, the room code and the game catalogue are hard-coded mocks. The only persisted
state is the selected game id, in `sessionStorage`
(`apps/web/src/console/data/selectedGameSession.ts`).

No environment variable is read and no external service is called.

## 3. Conventions in place

| Convention | Where | How consistently |
|---|---|---|
| Console and controller do not import each other; shared code goes in `src/shared` | stated in `apps/web/README.md` | Stated rule on `develop`; not enforced by tooling |
| Focusable screens use `useFocusable` and `FocusContext.Provider` | `apps/web/src/console/pages/` | Inspected pages follow it |
| Components have one file each and a test | `apps/web/AGENTS.md`, `apps/web/tests/` | Stated in `AGENTS.md`; 23 test files exist, and some components have none, such as `LobbyJoinDetails` and `PlayerStatus` |
| Commit messages look like Conventional Commits | `git log` on `develop` | Followed by the non-merge commits; not enforced |

These are observations, not project rules. Which of them become rules is an open question in
`CLAUDE.md`.

## 4. Decisions

See [`adr/`](adr/) for the recorded decisions and `../.assistant/decisions-log.md` for smaller
ones.
