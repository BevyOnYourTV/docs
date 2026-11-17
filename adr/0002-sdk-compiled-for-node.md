# ADR-0002 — SDK compiled for Node, sources kept for bundlers

- **Status**: Accepted
- **Date**: 2026-11-17
- **Deciders**: project owner
- **Supersedes**: none

## Context

ADR-0001 put the SDK in an npm workspace. It was then shipped as TypeScript sources only, with
extensionless relative imports, which Vite and Vitest resolve but Node does not. The real-time
server in BevyOnYourTV/Main_app#69 runs compiled code with `node dist/main`, so it could not load
`@platform/sdk` and copied its schemas and action validation instead. Two copies of the protocol
drift apart with the first change.

## Options considered

1. **Compile the SDK and pick the entry with an export condition** — `dist/` for Node, `src/` for tools that ask for the `source` condition. One protocol for every consumer, no build needed to develop the front end; consumers must declare the condition, and the server must build the SDK first.
2. **Run TypeScript directly in Node** — no build; extensionless imports still fail, and it ties the server to Node's type stripping.
3. **Bundle the server** — the server inlines the SDK; it changes the server team's tooling to fix a problem of the SDK.

## Decision

Option 1. The SDK writes its relative imports with a `.ts` extension, which the compiler rewrites to
`.js`, and `npm run build` emits `dist/` with type declarations. Its package exports `source`
(`src/index.ts`) and `default` (`dist/index.js`). The web application, the simulator and the test
game resolve `source`; Node and any consumer without that condition get `dist/`.

## Consequences

- Positive: the server can import the SDK, so there is one protocol and one action validation.
- Positive: front-end development and tests still run without building the SDK.
- Negative / trade-offs accepted: a consumer that forgets the `source` condition silently uses `dist/`, which may be stale or missing; `dist/` must be built before the server runs or is packaged.
- Follow-up work: the server replaces its copy of the schemas with imports from `@platform/sdk`.
