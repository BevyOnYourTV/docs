# Simulator

Runs a room without phones or a server, for anyone testing a game or the platform. The code is
`packages/simulator` in `Main_app`, inside the workspace as `@platform/simulator`. It has no user
interface, so tests, a developer page and load bots can all use it; see
[ADR-0001](adr/0001-sdk-architecture.md).

## Room

`createRoom({ screen })` connects one screen to any number of controllers over any `Transport`, and
applies the generic action validation.

| Option | Default | Purpose |
|---|---|---|
| `screen` | required | The transport linked to the game |
| `maxPlayers` | 8 | Room limit; raise it for load tests |
| `logLimit` | 500 | Number of log entries kept |
| `latencyTimeoutMs` | 2000 | Time allowed for a latency measure |
| `now` | `Date.now` | Clock, replaceable in tests |

The room exposes `attachController`, `getPlayers`, `getPhase`, `getScores`, `getLog`, `onLog`,
`measureLatency` and `dispose`. Each log entry states its direction, its player and any rejection
reason.

`measureLatency()` times a round trip to the game. It does not include a phone's network, because
none is involved.

## Virtual controllers and bots

`addVirtualController(room, player)` joins as a simulated phone, using the real controller SDK.
`createRandomBot(sdk, random?)` plays one random valid action on each `step()`; inject `random` to
make a run reproducible.

## Watchdog

`startWatchdog({ ping, onUnresponsive, intervalMs? })` calls `onUnresponsive` once when a ping
fails, so a hung game can be stopped. Pass `room.measureLatency` as `ping`.

## Limits

The room runs in one JavaScript process, so it does not measure real network behaviour. Reconnection
and host change are not implemented.
