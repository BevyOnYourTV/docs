---
title: SDK reference
sidebar_position: 3
---

# SDK reference

Every function a game and a phone controller can call. The SDK is the package `@platform/sdk`
(`packages/sdk` in `Main_app`); the code in `packages/sdk/src` is the reference when this page and the
code disagree.

The SDK is not a game engine: keep your own libraries for drawing, animation and sound. It connects
your game to the players and their phones, whatever links them: the simulator in developer mode, or
the real-time server.

## Screen side

The game shown on the console creates one screen SDK:

```ts
import { createScreenSdk, createWindowTransport } from '@platform/sdk'

const sdk = createScreenSdk(
  createWindowTransport({ host: window, target: window.parent, targetOrigin: '*' }),
)
```

### Players

| Function | Purpose |
|---|---|
| `getPlayers()` | Players currently in the game, each with `id`, `name` and an optional `avatar` |
| `onPlayerJoin(handler)` | A player arrives; also during a game |
| `onPlayerLeave(handler)` | A player leaves; the handler receives the player id |

### Game lifecycle

| Function | Purpose |
|---|---|
| `start()`, `pause()`, `resume()`, `end()` | Tell the platform the state of the game |
| `recordScore(playerId, points)` | Record a player's score; the last value sent counts |
| `setTurn(playerId)` | Give the turn to a player; `setTurn(null)` gives it to nobody. Each phone learns only whether it is its turn, never whose it is. |
| `unlockAchievement(playerId, achievementId)` | Unlock an achievement; only that player's phone is told |
| `dispose()` | Stop listening, for example before the game frame closes |

### Input and messages

| Function | Purpose |
|---|---|
| `onAction(handler)` | Receive `{ playerId, action }` for each validated action; see [Controller components](./controller-components.md) for each `action.value` |
| `setController(layout)` | Show a controller on every phone |
| `setController(layout, { playerId })` | Show it on one phone |
| `setController(layout, { playerIds })` | Show it on a group of phones; the others keep theirs |
| `sendToPlayer(playerId, data)` | Send JSON data to one player, such as a hand of cards or a secret role |
| `sendToAll(data)` | Send the same JSON data to every current player |

Private data, controllers for one player or a group, turns and achievements are delivered only to the
phones they target.

## Controller side

The phone runs one controller SDK. The platform's controller page does this for you; you only need it
to build your own controller.

| Function | Purpose |
|---|---|
| `getLayout()`, `onLayout(handler)` | The controller to display, or `null` before the game sends one |
| `sendAction(componentId, value)` | Send an action. It returns `{ ok: true }`, or `{ ok: false, reason }` without sending anything when the action does not match the displayed controller. |
| `onPrivateMessage(handler)` | Data sent with `sendToPlayer` or `sendToAll` |
| `isMyTurn()`, `onTurn(handler)` | Whether it is this player's turn |
| `onAchievement(handler)` | An achievement this player unlocked |
| `dispose()` | Stop listening |

## Errors

A malformed message received by the SDK is ignored and reported to `onProtocolError`, an option of
both `createScreenSdk` and `createControllerSdk`; by default it is logged. Invalid arguments, such as
an invalid layout or an empty `playerIds` list, throw immediately.
