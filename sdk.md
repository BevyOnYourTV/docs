# SDK

The link between a game and the platform, for anyone writing a game or changing the platform. The
code is `packages/sdk` in `Main_app`, published inside the workspace as `@platform/sdk`; the
reasoning is in [ADR-0001](adr/0001-sdk-architecture.md). It is not a game engine: games keep their
own libraries for display, animation and sound.

## Using the package

The package has two entries ([ADR-0002](adr/0002-sdk-compiled-for-node.md)):

- `source` points to `src/index.ts`. Vite, Vitest and TypeScript use it in the web application, the
  simulator and the test game, which declare the condition in their configuration
  (`resolve.conditions` and `customConditions`). Nothing needs building to develop or test them.
- `default` points to the compiled `dist/index.js`, for Node and any consumer without that condition.
  Build it first from `Main_app` with `npm run build --workspace @platform/sdk`; the root
  `npm run build` builds it before the other workspaces.

Relative imports inside `packages/sdk/src` end with `.ts`; the compiler rewrites them to `.js`.

## Screen and controller API

`createScreenSdk(transport)` is used by the game shown on the console, `createControllerSdk(transport)`
on the phone. Every function of both is described for game developers on the *SDK reference* page of
the documentation site (`docs/creating-a-game/sdk-reference.md` on the `main` branch): players,
lifecycle, turns, achievements, input, controllers for everyone, one player or a group, and private
or broadcast data.

Targeted controllers, private data, turns and achievements are delivered only to the phones they
target. Group controllers and broadcasts are sent as one message per player, so the real-time
server needs no extra field to keep them private.

## Controller layouts

A layout (format version 1) is a list of 1 to 16 components with unique ids, among seven kinds:
`button`, `dpad`, `joystick`, `touchpad`, `text`, `choice` and `drawing`, each with a label and an
optional accessibility description. The schemas are in `packages/sdk/src/protocol.ts`, which is the
reference for every message. What each component sends, and its accessibility, are described for
game developers on the *Controller components* page of the documentation site
(`docs/creating-a-game/controller-components.md` on the `main` branch).

`ControllerLayoutView`, in `apps/web/src/controller/components/`, renders a layout and reports
actions in the SDK format. It is not yet connected to the controller page.

## Game manifest

`parseGameManifest(input)` validates `id`, `name`, `version` (semantic), `entry`, `minPlayers` and
`maxPlayers` (at most 8), `controllerComponents` (any of the seven kinds) and `accessibility`, and
throws when it is invalid.

## Transport

`Transport` has `send`, `onMessage` and `close`. `createMemoryTransportPair()` returns two linked
endpoints for tests and simulation. It clones each message, so a value that could not cross an
iframe or a network fails there too. `createWindowTransport({ host, target, targetOrigin })` links a
page and a window such as a game iframe, and accepts messages only from `target`.

On creation the screen SDK sends `ready`, and it answers `ping` automatically with `pong`.

## Validation

`validateAction(layout, action)` is the generic check: a layout is displayed, the component exists,
the value has the right kind, a chosen option exists, and text fits the component's `maxLength`. The
real-time server (`apps/server`) and the simulator both run it. `ActionValidator` is the contract for
a game's own server-side rule; nothing runs it yet.

An invalid incoming message is passed to `onProtocolError`, which by default logs with
`console.error`; it does not crash the game. Invalid values given to `setController` throw.

## Not built yet

Sensors, vibration and the accessibility options.
