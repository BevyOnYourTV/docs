# CI and deployment

Which pipelines exist and how each part is shipped, for anyone changing the build or release
process.

## Documentation repository

| Pipeline | Trigger | Steps |
|---|---|---|
| `.github/workflows/test-deploy.yml` | PR to `main` | `npm ci`, `npm run build` on Node 24 |
| `.github/workflows/deploy.yml` | push to `main` | Build, then deploy to GitHub Pages |

These run in the `docs` repository and use no custom secrets. `docs/docusaurus.config.ts` sets
`baseUrl` to `/docs/` and still has a placeholder `url`.

Unknown: whether the Pages deployment is live — someone with access to the repository settings.

## Main application

| Pipeline | Trigger | Steps |
|---|---|---|
| `.github/workflows/ci.yml` | PR to `develop` or `main` | In `apps/web`, on Node 24: `npm ci`, `npm run lint`, `npm test`, `npm run build` |

The pipeline was added by [PR #55](https://github.com/BevyOnYourTV/Main_app/pull/55). It uses no
secrets. A failing run does not block a merge: GitHub refuses branch protection on this private
repository with the organisation's current plan.

There is no deployment. One issue-template file states that none is planned for now.

On the unmerged `playwright_testing` branch, `.github/workflows/playwright.yml` runs Playwright on
pushes to that branch and PRs to `main`.

Run the checks a pipeline would run, from `Main_app/apps/web`:

```bash
npm ci
npm run lint
npm test
npm run build
```

Unknown: the hosting target for the console, controller and real-time server — the group.
