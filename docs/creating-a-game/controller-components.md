---
title: Controller components
sidebar_position: 4
---

# Controller components

A game never draws the phone's screen. It describes a **controller layout**, and the phone renders it
with the platform's components, then sends back **actions** in a fixed format. This page is for game
developers; it describes what exists in `packages/sdk` and `apps/web/src/controller` of `Main_app`.

## Showing a controller

From the screen side of the SDK:

```ts
sdk.setController({
  version: 1,
  components: [
    { kind: 'joystick', id: 'steer', label: 'Steer' },
    { kind: 'button', id: 'boost', label: 'Boost', description: 'Doubles your speed for 2 seconds' },
  ],
})

// For one player only, for example a secret role:
sdk.setController(layout, { playerId })
```

The new layout replaces the previous one at once. A player who joins later receives the layout shown
to everyone.

## Layout rules

| Field | Rule |
|---|---|
| `version` | Optional; `1`, the only version. A layout without it is version 1. |
| `components` | 1 to 16 components, each with a unique `id` |
| `id` | 1 to 64 characters; actions refer to it |
| `label` | 1 to 80 characters; shown on the phone and used as the accessible name |
| `description` | Optional, up to 200 characters; shown under the control and read by screen readers as a hint |

## Components and their actions

Each action reaches the game through `sdk.onAction` as `{ playerId, action: { componentId, value } }`.

| `kind` | Extra fields | `value` sent to the game |
|---|---|---|
| `button` | none | `{ kind: 'button', pressed }`: `true` on press, `false` on release |
| `dpad` | none | `{ kind: 'dpad', direction }`: `up`, `down`, `left` or `right` on press, `none` on release |
| `joystick` | none | `{ kind: 'joystick', x, y }`: each from -1 to 1, `y` pointing up, within the unit circle; `0, 0` when released |
| `touchpad` | none | `{ kind: 'touchpad', phase, x, y }`: `phase` is `start`, `move` or `end`; `x` and `y` from 0 to 1, from the top left |
| `text` | `maxLength` (1 to 280, default 280), `placeholder` | `{ kind: 'text', text }`: sent when the player presses Send, trimmed, never empty |
| `choice` | `options`: 2 to 8 items with `id` and `label` | `{ kind: 'choice', optionId }` |
| `drawing` | none | `{ kind: 'drawing', points }`: one finished stroke, up to 256 `[x, y]` points from 0 to 1 |

Text typed by players is not filtered by the controller. Filter it before displaying it on the shared
screen.

## Validation

The platform rejects an action that does not match the controller the player sees: no layout shown,
unknown component, value of the wrong kind, unknown option, or text longer than the component allows.
A rejected action never reaches the game.

## Accessibility

Every control is at least 44 × 44 pixels and shows its label.

| Component | Without touch |
|---|---|
| `button`, `dpad`, `choice` | Native buttons: keyboard and screen readers |
| `joystick` | Focus it, then hold the arrow keys |
| `touchpad` | Focus it, move a cursor with the arrow keys, press Enter or Space to tap |
| `text` | Labelled text field and Send button |
| `drawing` | **No alternative**: offer another way to play, such as a `choice` |

The keyboard behaviour is tested; the components have not yet been tested with VoiceOver or TalkBack
on phones.

## Not available yet

Motion sensors, vibration, and the accessibility preferences of players.
