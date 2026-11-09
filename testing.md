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

## End-to-end tests

Playwright exists only on the unmerged `origin/playwright_testing` branch: one spec in
`e2e/navigation.spec.ts` and `playwright.config.ts`, both under `apps/web`.

```bash
npx playwright test
```

Not run at takeover.

## Not tested

- There is no coverage gate.
- There is no automated accessibility check.
- Server and game logic do not exist yet, so they have no tests.
- The `docs` site's only check is its build, in CI.
