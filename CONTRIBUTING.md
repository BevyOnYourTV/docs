# Contributing to the AirConsole Documentation

Thank you for helping improve the AirConsole documentation. Contributions may include correcting inaccurate or outdated content, clarifying instructions, adding examples, improving navigation, or documenting new project behavior.

## Before you start

- Search the repository's open and closed issues to avoid duplicating existing work.
- Open an issue before making a large structural change or adding a substantial new documentation section. Small corrections may be submitted directly as a pull request.
- Do not include credentials, private session data, personal information, or other sensitive content in documentation, examples, screenshots, or logs.
- Report security vulnerabilities using the [security policy](SECURITY.md), not a public issue.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) in all project discussions.

## Set up the documentation site

The site is built with Docusaurus. You need Node.js 20 or later and npm.

From the documentation repository root, install the locked dependencies:

```bash
npm ci
```

Start the local development server:

```bash
npm run start
```

Docusaurus will print the local URL in the terminal. Most content changes appear in the browser without restarting the server.

## Build and validate changes

Create a production build before opening a pull request:

```bash
npm run build
```

The generated site is written to `build/`. This command also detects many invalid links and Docusaurus configuration errors.

For changes to TypeScript, React components, configuration, or theme code, also run:

```bash
npm run typecheck
```

You can preview the production build locally after building it:

```bash
npm run serve
```

Do not commit generated `build/` or `.docusaurus/` content.

## Documentation structure

- `docs/` contains the Markdown and MDX documentation pages.
- `docs/user/` contains guidance for players and hosts.
- `docs/creating-a-game/` contains game-development guides and references.
- `docs/developer/` contains architecture, application, operations, and contributor documentation.
- `src/` contains custom React pages and styling.
- `static/` contains files copied directly into the generated site.
- `sidebars.ts` defines sidebar navigation.
- `docusaurus.config.ts` contains site-wide Docusaurus configuration.

Place new content in the section for its intended audience. Update navigation when adding or moving pages, and repair links that change as a result.

## Writing guidance

- Use clear, direct language and explain unfamiliar terms when they first appear.
- Keep each page focused on one subject and use descriptive headings to make it easy to scan.
- Prefer tested, copyable examples. Include the language after fenced code markers when applicable.
- Use relative links for pages and files within this repository.
- Add meaningful alternative text to informative images. Do not use images as the only way to communicate essential instructions.
- Verify commands, paths, configuration names, and UI labels against the current project behavior.
- Clearly identify placeholders and values that readers must replace.
- Avoid duplicating material already maintained elsewhere; link to the authoritative source instead.

When changing documented behavior, coordinate the documentation with the relevant application change so readers do not receive instructions for unreleased or unsupported functionality.

## Issues and pull requests

Use the repository's documentation-specific issue templates when reporting an error, proposing content, or tracking documentation work.
