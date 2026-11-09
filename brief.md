# Brief

What this project is meant to be: the owner's statement of intent, and the source of truth for
*what* to build. `CLAUDE.md` says how to work, `architecture.md` says how it is built, this says
what for.

Keep it short. Changing the scope, the priorities or the success criteria is a decision: update
this file and record the change with the `adr-new` skill (a decisions-log line is enough for a
small one). Never edit it silently. The external assignment is the EpiAirConsole subject, a PDF
kept locally at the workspace root (`EpiAirConsole_FR.pdf`, not committed); this page summarises it.

## Purpose

A game console in the browser. The console opens on a computer or connected TV and each player
joins with a smartphone that becomes the controller: no hardware to buy. The core of the project
is the platform (game rooms, real-time communication, dynamic controllers and an SDK that lets any
developer create a game); the delivered games prove the platform works.

## Users

- **Host**: opens the console, creates a room, picks and launches a game, manages players.
- **Player**: joins from a phone by QR code or room code, as a guest or with an optional account.
- **External game developer**: builds a game with the SDK without touching the platform.
- **The jury**: plays a live game on their phones at the defense.

## Scope

In scope, as listed in the subject's deliverables:

- Console: rooms, catalogue, profiles, leaderboards, end-of-game screen.
- Real-time server: rooms, reconnection, server-side action validation, documented load tests.
- SDK (screen and controller sides), controller components, accessibility options, developer mode.
- Three original games of different genres (real-time action, party, turn-based), one playable without sight.
- Web controller on smartphone, with no install, on iOS Safari and Android Chrome, with sensors and vibration.
- Automatically deployed online environment.
- Clean GitHub repository with the required files, tests, CI/CD and GitHub Projects board.
- Product identity (short brand guide and sound identity).
- User, technical and game-developer documentation.
- Accessibility audit and statement; AI-usage declaration in the README.

Out of scope:

- `poc_host_remote_connection`: a throwaway reference, not part of the product.
- Real money in any form.
- Distribution beyond the project.

Optional bonuses, valued but not required: spectator mode, games between remote rooms, a fourth game.

## Priorities

Add features up to the defense. The owner has not ranked the deliverables yet; see *Open questions*.

## Success criteria

- The deliverables above are presented at the defense: live game with the jury, SDK demo, accessible walkthrough, questions on the code.
- Latency under 100 ms between controller press and on-screen reaction, on a local network, displayed in developer mode.
- Up to 8 players per room, with several rooms in parallel on one server.
- Interfaces meet WCAG 2.2 AA.
- An outside developer can, from the README alone, run the console, join a room with the controller simulator and run the tests in under 15 minutes.

## Constraints

- Group of 3 students; 19 October 2026 to the end of January 2027. Optional follow-up in December, resit in February.
- Stack is free but must be justified in the technical documentation.
- The product has its own brand: no use of AirConsole's name, logo or interface, and no reference to Epitech.
- Games, characters and assets are original or freely licensed and credited.
- No payment, in-app purchase or advertising.
- Playing needs no account; player-entered text is filtered before display.
- AI use is allowed and must be declared in the README; each member must be able to explain any part of the code.
- Documentation stays in one language throughout.

## Open questions

- The product's real name and brand — the group.
- The order of priority among deliverables — the group.
- Hosting target for the console, controller and real-time server — the group.
