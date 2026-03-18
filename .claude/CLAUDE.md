# Web Elements

Vanilla JS SDK for Basis Theory Elements — provides framework-agnostic web components for secure data collection.

## Development Workflow

This package is part of the `basistheory-elements` monorepo workspace. Build from the monorepo root or standalone:

```bash
yarn install
yarn build            # Build the package (uses Parcel)
yarn watch            # Watch mode for development
```

## Testing

```bash
yarn lint             # ESLint
yarn lint:fix         # Auto-fix
yarn test             # Unit tests (Jest)
npx jest --testPathPattern="<pattern>"   # Targeted test
```

## Feedback Loops

Use `yarn watch` for live rebuilds + `npx jest --testPathPattern="<pattern>"` for targeted tests.

When a failing test is discovered, always verify it passes using the appropriate feedback loop before considering the fix complete.

## Standards & Conventions

- TypeScript, Parcel for bundling, Jest for testing
- `yarn` for package management
- Generates SRI hashes for built assets

## Links

- [Web Elements docs](https://developers.basistheory.com/docs/sdks/web/javascript/)
