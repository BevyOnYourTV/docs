# Technologies

What the project relies on and how each item is used, for newcomers. Versions are in each
`package.json`. No reasons are given because none are recorded; see
`../.assistant/decisions-log.md`. This page describes the `origin/develop` branch of `Main_app`.

## React and Vite

React 19 UI, built by Vite as three separate pages. Configuration: `apps/web/vite.config.ts`.

## Tailwind CSS and shadcn/ui

Tailwind v4 is the styling layer, with theme tokens in `apps/web/src/shared/styles/tailwind.css`
exposed as utilities such as `bg-air-background`. shadcn/ui provides conventional components in
`apps/web/src/components/ui/`, configured by `apps/web/components.json`.

Pitfall: class names must stay complete and statically detectable; do not build partial Tailwind
class names dynamically.

## Norigin spatial navigation

Arrow-key and remote-style navigation on the console. It is initialised in each entry point that
uses it. Its focus state is separate from browser focus, so both need styling; details are in
`apps/web/AGENTS.md`.

## React Router

Client-side routes for the console, under the `/console` base path.

## Vitest and Playwright

Vitest runs on `develop`. Playwright is on an unmerged branch. See [testing.md](testing.md).

## Zod

Validates the SDK's messages, controller layouts and game manifests at runtime, and gives their
TypeScript types. Schemas are in `packages/sdk/src/`.

## Docusaurus

Generates the documentation site from the `docs` repository. Only `docs/docs/` and `docs/blog/`
feed the site, so the project documents at the root of that repository are not published.
