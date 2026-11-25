# Frontend Realtime Protocol

This guide is for the web console and mobile controller clients connecting to the realtime server. It lists the Socket.IO event payloads, validation rules, and routing behavior implemented by the server.

The game SDK also has a separate message protocol between the platform and a game running in an iframe. That protocol is documented in the [Game SDK message types](#game-sdk-message-types) section.

For connection order, lifecycle examples, permissions, reconnect behavior, and error handling, see the [Realtime Connection Lifecycle](./connection-lifecycle.md). The Zod schemas in [`src/protocol/realtime-protocol.schema.ts`](../src/protocol/realtime-protocol.schema.ts) and [`packages/sdk/src/protocol.ts`](../../../packages/sdk/src/protocol.ts) remain the validation source of truth.

## Socket.IO connection and envelope

- Namespace: `/realtime`
- Local URL: `http://localhost:3000/realtime`
- Protocol version: `0.2`
- Every application event carries this envelope:

```ts
type Envelope<T> = {
  v: 0.2
  timestamp: number // positive integer; Unix time in milliseconds
  payload: T
}

type RoomStatus = 'waiting' | 'playing' | 'paused' | 'finished'
type ScreenCommand = 'up' | 'down' | 'left' | 'right' | 'confirm' | 'back'
type JSONValue =
  | null | boolean | number | string
  | JSONValue[]
  | { [key: string]: JSONValue }
```

Example:

```ts
socket.emit('room:join', {
  v: 0.2,
  timestamp: Date.now(),
  payload: { roomCode: 'AB12CD', nickname: 'Alex' },
})
```

After connecting, send `session:hello` or `session:reconnect` before other application events. `session:hello` assigns the socket a `console` or `controller` role; it is not account authentication. A socket that does not complete the hello handshake within five seconds is disconnected.

## Client to server events

All payloads below are inside the common envelope.

| Event | Payload | Allowed sender / behavior |
|---|---|---|
| `session:hello` | `{ role: 'console' \| 'controller' }` | New connection; assigns its role and returns `session:ready`. |
| `session:reconnect` | `{ sessionToken: string }` | New socket resuming a disconnected session. Token length: 10–256 characters. |
| `room:create` | `{}` | Console role. Creates a room; the console becomes screen host. |
| `room:join` | `{ roomCode: string, nickname: string, avatar?: string }` | Controller role. Joins a room. Room code: 4–6 alphanumeric characters, trimmed and normalized to uppercase. Nickname: 1–32 characters after trimming. Avatar: optional, at most 64 characters. |
| `room:leave` | `{}` | Leaves the current room. |
| `room:kick` | `{ playerId: string }` | Screen host or master controller. Removes a current player. |
| `game:start` | `{ gameId: string }` | Screen host or master controller. Starts a game. |
| `game:input` | [`ControllerOutbound`](#controller-messages) | Joined controller. Accepted only during a running game and when the action matches that player's active layout. |
| `game:message` | [`ScreenOutbound`](#screen-messages) | Current screen host only. Sends a game SDK message to the server for routing. |
| `controller:command` | `{ command: 'up' \| 'down' \| 'left' \| 'right' \| 'confirm' \| 'back' }` | Master controller only. Forwarded to the screen host. |
| `controller:game-control` | `{ action: 'pause' \| 'resume' \| 'stop' }` | Master controller only. Applies a lifecycle transition if the current room status permits it. |
| `ping` | `{ id: number }` | Any assigned role. `id` is a nonnegative integer; responds to the same socket with `pong`. |

Shared validation details:

- `gameId`, `playerId`, component IDs, and option IDs are strings of 1–64 characters.
- Timestamps and protocol version are validated on every event. Unsupported versions produce `PROTOCOL_ERROR`.
- `room:join` room codes are trimmed and uppercased by validation before lookup. Nicknames are further normalized and filtered by the server.
- A room supports up to eight controllers.

## Server to client events

Each server event uses the same envelope. “Room” means the Socket.IO room, including the screen host and joined controllers unless the event is explicitly targeted.

| Event | Payload | Recipient / behavior |
|---|---|---|
| `session:ready` | `{ role: 'console' \| 'controller', sessionToken: string, playerId?: string }` | The connecting socket. `playerId` is included when a resumed session restores a room identity. |
| `room:created` | `{ roomCode: string, hostId: string }` | The screen host that created the room. |
| `room:joined` | `{ roomCode: string, playerId: string, hostId: string, masterControllerId: string \| null, players: Player[] }` | The controller that joined. |
| `room:state` | `{ roomCode: string, hostId: string, masterControllerId: string \| null, players: Player[], gameId?: string, status: RoomStatus }` | Room snapshot broadcast after room changes. Status is `waiting`, `playing`, `paused`, or `finished`. |
| `player:joined` | `{ player: Player }` | Existing room members when a controller joins. |
| `player:left` | `{ playerId: string }` | Room members when a controller leaves or is removed. |
| `player:action` | `{ playerId: string, action: ControllerAction }` | Screen host, after the server validates the action against the player's active layout. |
| `screen:command` | `{ controllerId: string, command: ScreenCommand }` | Screen host, forwarded from the master controller. |
| `host:changed` | `{ hostId: string }` | Room members when the screen host migrates. |
| `game:started` | `{ gameId: string }` | Room members when a game starts or resumes. |
| `game:paused` | `{ gameId?: string }` | Room members when a game pauses. |
| `game:ended` | `{ gameId?: string }` | Room members when a game ends. |
| `game:layout` | `{ layout: ControllerLayout, playerId?: string }` | All controllers or the addressed controller. |
| `game:private` | `{ data: JSONValue }` | Only the addressed controller. The target `playerId` is used for routing and is not repeated in the received payload. |
| `game:score` | `{ playerId: string, points: integer }` | Room members, when `playerId` belongs to a current player. |
| `pong` | `{ id: nonnegative integer, serverTimestamp: positive integer }` | The socket that sent `ping`. |
| `error` | `{ code: ErrorCode, message: string, details?: string[] }` | The socket whose event failed. `details` contains up to 16 validation issue strings. |

`Player` is `{ id: string, name: string, avatar?: string }`; `id` is 1–64 characters, `name` is 1–32 characters, and `avatar` is at most 64 characters.

`ErrorCode` is one of `PROTOCOL_ERROR`, `INVALID_PAYLOAD`, `ROOM_NOT_FOUND`, `ROOM_FULL`, `UNAUTHORIZED`, `RATE_LIMITED`, or `CONFLICT`. Error messages are 1–256 characters; each optional detail is at most 256 characters. `RATE_LIMITED` is reserved; rate limiting is not currently implemented.

## Controller layouts and actions

The screen host supplies a `ControllerLayout` using `game:message` with `type: 'set-controller'`. A layout has 1–16 components with unique IDs. Component labels are 1–80 characters.

```ts
type ControllerLayout = {
  components: ControllerComponent[]
}

type ControllerComponent =
  | { kind: 'button', id: string, label: string }
  | { kind: 'dpad', id: string, label: string }
  | {
      kind: 'choice', id: string, label: string,
      options: { id: string, label: string }[] // 2–8 options
    }

type ControllerAction = {
  componentId: string
  value: ActionValue
}

type ActionValue =
  | { kind: 'button', pressed: boolean }
  | { kind: 'dpad', direction: 'up' | 'down' | 'left' | 'right' | 'none' }
  | { kind: 'choice', optionId: string }
```

The `kind` in an action value must match the addressed component. A `choice` action must reference an option in that component. The server rejects invalid actions with `INVALID_PAYLOAD`.

Example controller action:

```ts
socket.emit('game:input', {
  v: 0.2,
  timestamp: Date.now(),
  payload: {
    type: 'action',
    action: {
      componentId: 'jump',
      value: { kind: 'button', pressed: true },
    },
  },
})
```

## Game SDK message types

These are the unwrapped `type`-discriminated messages exchanged between the platform and a game runtime through `@platform/sdk`. The SDK transport messages are not Socket.IO envelopes.

### Platform to screen game (`ScreenInbound`)

```ts
type ScreenInbound =
  | { type: 'players', players: Player[] }
  | { type: 'player-joined', player: Player }
  | { type: 'player-left', playerId: string }
  | { type: 'action', playerId: string, action: ControllerAction }
  | { type: 'ping', id: number } // integer
```

### Screen game to platform (`ScreenOutbound`)

```ts
type ScreenOutbound =
  | { type: 'ready' }
  | { type: 'pong', id: number } // integer
  | { type: 'set-controller', layout: ControllerLayout, playerId?: string }
  | { type: 'private', playerId: string, data: JSONValue }
  | { type: 'lifecycle', phase: 'start' | 'pause' | 'resume' | 'end' }
  | { type: 'score', playerId: string, points: number } // integer
```

The server currently treats `ready` and game-level `pong` as no-ops. `set-controller`, `private`, `lifecycle`, and `score` are routed as described above. A screen game's `lifecycle` message changes room status and broadcasts the corresponding event and updated room state.

### Platform to controller SDK (`ControllerInbound`)

```ts
type ControllerInbound =
  | { type: 'layout', layout: ControllerLayout }
  | { type: 'private', data: JSONValue }
```

### Controller SDK to platform (`ControllerOutbound`)

```ts
type ControllerOutbound = {
  type: 'action'
  action: ControllerAction
}
```

`JSONValue` means any JSON-serializable value. SDK message details and inferred TypeScript exports are defined in [`packages/sdk/src/protocol.ts`](../../../packages/sdk/src/protocol.ts); the SDK factories are in [`packages/sdk/src/screen.ts`](../../../packages/sdk/src/screen.ts) and [`packages/sdk/src/controller.ts`](../../../packages/sdk/src/controller.ts).

## Related documentation

- [Realtime Connection Lifecycle](./connection-lifecycle.md) — connection sequence, permissions, reconnect and failure behavior.
- [Controller Roles and Frontend Events](./controller-roles-and-events.md) — screen host, master controller, and regular controller capabilities.
- [Server README](../README.md) — local setup, examples, and realtime tester.
