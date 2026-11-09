# ADR-0001 — SDK architecture: isolated games, pluggable transport, reusable simulator

- **Status**: Accepted
- **Date**: 2026-11-09
- **Deciders**: project owner
- **Supersedes**: none

## Context

The subject makes the SDK the link between a game and the platform: players, actions, controller
choice, private messages, game lifecycle. A game must be addable without changing the platform, a
crashing game must not lose the room, the server must validate player actions, and a developer
mode must simulate controllers without phones. The real-time server does not exist yet, and
`Main_app` holds one standalone npm project, `apps/web`.

## Options considered

Where game logic runs and who has authority:

1. **Mixed** — the game runs on the screen; the server validates each action generically, and a game may supply a server-side validator for its own rules. Meets the subject and keeps games simple; game-specific anti-cheat is opt-in.
2. **All on the server** — state and rules run server-side. Strongest anti-cheat; SDK and games far more complex, especially real-time action games.

Game isolation:

1. **iframe with `postMessage`** — a crash or hang is contained and the frame can be destroyed; messages must be serialisable.
2. **Same page, as modules** — simplest calls; a crash or hang affects the platform.

Code location:

1. **npm workspaces in `Main_app`** — separate packages for SDK and games in one repository; the lockfile moves to the root and CI changes.
2. **Inside `apps/web`** — no tooling change; nothing separates platform from games.
3. **Separate repository** — strong separation; one more source to synchronise.

Simulator:

1. **Headless package used by a UI** — reusable by unit tests, end-to-end tests and load tests.
2. **Developer page only** — quicker to build; other uses would have to rewrite it.

## Decision

- Mixed authority. The validator contract is defined in the SDK; until the server exists, the simulator applies the generic validation (player, component, format).
- Games run in an iframe and talk to the platform with `postMessage`.
- The SDK depends on a `Transport` interface, not on a network technology. An in-memory implementation comes first; the real-time server plugs in as another implementation.
- Packages are npm workspaces in `Main_app`: `packages/*` and `games/*` beside `apps/*`.
- The simulator is its own headless package that drives any number of virtual controllers through `Transport`, with no UI dependency. The developer page is one consumer; tests and server load bots are others.

The owner chose mixed authority, workspaces and a first slice built on the simulator, and asked for
the simulator to be general-purpose and scalable. The iframe choice was part of the validated plan.

## Consequences

- Positive: the SDK and games can be built and tested before the server exists.
- Positive: the same virtual controllers serve development, tests and load tests.
- Negative / trade-offs accepted: every message crossing the iframe must be serialisable, and game-specific anti-cheat depends on each game providing a validator.
- Follow-up work: real-time server `Transport`, running validators on the server, and an ADR for the server stack.
