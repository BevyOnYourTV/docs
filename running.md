# Running the project

How to install and run each part locally, for anyone working on the project.

## Prerequisites

- Git, with SSH access to the BevyOnYourTV organisation.
- Node.js. `docs/package.json` requires 20 or above and its CI uses 24; the web app declares no
  version and was verified on 25.2.1.

## Clone

```bash
git clone --recurse-submodules git@github.com:BevyOnYourTV/workspace.git
```

## Web application

Current work is on `develop`; `main` is still the template scaffold.

```bash
cd Main_app
git switch develop
cd apps/web
npm ci
npm run dev
```

Vite prints the local URL. The pages are `/`, `/console/` and `/controller/`.

No environment variable is needed.

## Documentation site

```bash
cd docs
npm ci
npm start
```

Not verified at takeover. The site still shows the Docusaurus default content.

## POC

`poc_host_remote_connection/server/server2.js` reads `tmp/certificates/local-key.pem` and
`local-cert.pem` relative to the working directory. Those files are not in the repository, so it
will not start without generating them. It is a throwaway reference.
