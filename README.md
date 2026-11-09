# docs

This repository holds the project's documentation and its Docusaurus site. The site's content is
in `docs/` and `blog/`; the documents listed below are not published on it.

## Documentation index

Every surface of this project — anything someone needs to know to build, run, test, ship, operate
or use it — has one document, listed here. A document is updated in the same change as what it
covers. What each kind of document must contain is described by the `project-sync` skill
(`doc-surfaces.md`).

The **Covers** column lists, in code spans, the paths a document describes. The docs check
(`scripts/check-docs.mjs`, at the workspace root) uses it: a top-level folder, `Dockerfile`, compose
file, CI pipeline, `.env.example`, API contract, schema or migrations folder that no document
covers is an error, and a document whose covered paths keep changing without it is reported as
possibly stale.

Links to `.assistant/` resolve from the workspace repository, which holds this one as a submodule.

| Document | What it answers | Covers | Update when |
|---|---|---|---|
| [brief.md](brief.md) | What to build and why: purpose, scope, priorities, success criteria | the intent of the project | the scope, priorities or success criteria change |
| [architecture.md](architecture.md) | How the code is organised and how its parts fit together | `Main_app/` `docs/` `poc_host_remote_connection/` | a module, folder, flow or convention is added, moved or removed |
| [running.md](running.md) | How to install and run each part locally | `Main_app/apps/web/package.json` `docs/package.json` | a prerequisite, command or setup step changes |
| [testing.md](testing.md) | What is tested and how to run it | `Main_app/apps/web/` | a test level, runner or command changes |
| [ci-deployment.md](ci-deployment.md) | Which pipelines exist and how each part ships | `Main_app/.github/workflows/ci.yml` `docs/.github/workflows/deploy.yml` `docs/.github/workflows/test-deploy.yml` | a workflow, trigger or deployment step changes |
| [technologies.md](technologies.md) | What the project relies on and how each item is used | `Main_app/apps/web/package.json` | a technology is added, replaced or reconfigured |
| [sdk.md](sdk.md) | What the SDK offers to games and controllers | `Main_app/packages/sdk/` | the SDK's API, protocol or manifest changes |
| [simulator.md](simulator.md) | How to run a room without phones or a server | `Main_app/packages/simulator/` | the room, virtual controllers, bots or watchdog change |
| [adr/](adr/) | Why the structural choices were made | decisions | a structural decision is made or reversed |
| [decisions-log.md](../.assistant/decisions-log.md) | Smaller choices and their reasons | decisions | a smaller choice is made |
| [lessons.md](../.assistant/lessons.md) | Mistakes made and what now prevents them | lessons | review, CI or the user catches a mistake |
| [README.md](README.md) | This index and the documentation tooling | `scripts/check-docs.mjs` | the docs check changes |
