# Testing

What is tested and how to run it, for anyone changing the web application. It describes the
`origin/develop` branch of `Main_app`.

## Unit and component tests

- Runner: Vitest with jsdom, configured in `apps/web/vitest.config.ts`.
- Location: `apps/web/tests/`, split into `console/unit`, `controller/unit` and `shared`.
- Scope: rendering and behaviour of pages and components, and the selected-game session helper.
- State on 2026-11-09: 23 files, 27 tests, all passing.

From the root of `Main_app`, for every workspace:

```bash
npm test
```

From `Main_app/apps/web`, for that workspace only:

```bash
npm run test:watch
npx vitest run tests/console/unit/MainMenu.test.tsx
```

## SDK tests

Vitest in `packages/sdk/tests/`, without a browser: transport, manifest, validation, and the screen
and controller SDKs. Run them alone from `Main_app` with `npm test --workspace @platform/sdk`.

## Simulator tests

Vitest in `packages/simulator/tests/`, without a browser: room routing, bots and the watchdog. One
test fills a room with 500 virtual controllers. Run them alone with
`npm test --workspace @platform/simulator`. See [simulator.md](simulator.md).

## Test game

Vitest in `games/test-game/tests/`, without a browser: game logic, manifest, and full games through
a simulated room, including eight random bots. Run them with
`npm test --workspace @platform/test-game`.

## End-to-end tests

Playwright, configured in `apps/web/playwright.config.ts`, with specs in `apps/web/e2e/`. It starts the
dev server itself and runs on Chromium, Firefox and WebKit. One spec exists: navigation from the home
page to the console. From `Main_app/apps/web`:

```bash
npx playwright install
npm run ptest
```

CI runs it on every PR to `develop` or `main`; see [ci-deployment.md](ci-deployment.md). The
developer page and the test game are not covered by an end-to-end test yet.

## Not tested

- There is no coverage gate.
- There is no automated accessibility check.
- Server and game logic do not exist yet, so they have no tests.
- The `docs` site's only check is its build, in CI.
