# freshmen68

A monorepo for the freshmen68 project that includes various components and services.

## Project Structure
- `apps/`: Contains the main applications.
  - `api/`: The backend API service. Handle Authentication and tRPC Handlers written in TypeScript.
  - `web/`: The frontend web application. Built with SvelteKit
- `packages/`: Contains shared libraries and utilities.
  - `auth/`: BetterAuth configuration for authentication.
  - `trpc/`: tRPC handlers and utilities.
  - `db/`: Database utilities and migrations.
  - `typescript-config/`: Shared TypeScript configuration (seem to be broken).
- `turbo.json`: Configuration for Turborepo to manage tasks and dependencies across the monorepo.

## Development

We use bun as the package manager and task runner. To get started, install bun if you haven't already:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then, install the dependencies:

```bash
bun install
```

Setting up environment variables:
- `apps/api/example.dev.vars` rename to `.dev.vars` and fill in the required values. (You mosly need to set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for Google OAuth)
- `apps/web/.env.example` rename to `.env` (no need to fill in anything, just rename it).

For sake of simplicity, run the following command to rename the files:

```bash
mv apps/api/example.dev.vars apps/api/.dev.vars && mv apps/web/.env.example apps/web/.env
```

Push database schema changes:

```bash
bun turbo db:push
```

Then start the development server:

```bash
bun run dev
```

Navigate to `http://localhost:5173` to see the web application and `http://localhost:8787` for the API.
