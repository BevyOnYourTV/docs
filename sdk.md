# SDK

The link between a game and the platform, for anyone writing a game or changing the platform. The
code is `packages/sdk` in `Main_app`, published inside the workspace as `@platform/sdk`; the
reasoning is in [ADR-0001](adr/0001-sdk-architecture.md). It is not a game engine: games keep their
own libraries for display, animation and sound.

## Screen side

`createScreenSdk(transport)` is used by the game shown on the console.

| Function | Purpose |
|---|---|
| `getPlayers()` | Current players |
| `onPlayerJoin(handler)`, `onPlayerLeave(handler)` | Arrivals and departures |
| `onAction(handler)` | Actions sent by the phones |
| `setController(layout, target?)` | Show a controller on every phone, or on one with `{ playerId }` |
| `sendToPlayer(playerId, data)` | Private data for one player; must be JSON |
| `start()`, `pause()`, `resume()`, `end()` | Game lifecycle |
| `recordScore(playerId, points)` | Record a score |
| `dispose()` | Stop listening |

## Controller side

`createControllerSdk(transport)` is used on the phone.

| Function | Purpose |
|---|---|
| `getLayout()`, `onLayout(handler)` | The controller to display |
| `onPrivateMessage(handler)` | Private data for this player |
| `sendAction(componentId, value)` | Send an action; returns a `ValidationResult`, and sends nothing if the action does not match the layout |
| `dispose()` | Stop listening |

## Controller layouts

A layout is a list of 1 to 16 components with unique ids: `button`, `dpad`, or `choice` with 2 to 8
options. The schemas are in `packages/sdk/src/protocol.ts`, which is the reference for every message.

## Game manifest

`parseGameManifest(input)` validates `id`, `name`, `version` (semantic), `entry`, `minPlayers` and
`maxPlayers` (at most 8), `controllerComponents` and `accessibility`, and throws when it is invalid.

## Transport

`Transport` has `send`, `onMessage` and `close`. `createMemoryTransportPair()` returns two linked
endpoints for tests and simulation. It clones each message, so a value that could not cross an
iframe or a network fails there too.

## Validation

`validateAction(layout, action)` is the generic check: a layout is displayed, the component exists,
the value has the right kind, and a chosen option exists. `ActionValidator` is the contract for a
game's own server-side rule. Nothing runs it yet, because the real-time server does not exist.

An invalid incoming message is passed to `onProtocolError`, which by default logs with
`console.error`; it does not crash the game. Invalid values given to `setController` throw.

## Not built yet

The iframe transport, sensors, vibration, the other controller components and the accessibility
options.
