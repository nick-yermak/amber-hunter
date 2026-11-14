# Angular Engineering Conventions

## Angular Style Guide

Follow the [Angular Style Guide](https://angular.dev/style-guide). Use kebab-case filenames that reflect the primary TypeScript identifier. Co-locate a component's TypeScript, template, styles, and unit tests. Give external templates and styles the same stem as the TypeScript file and use `.spec.ts` for unit tests. Small inline templates are fine. Organize code by feature, prefer `inject()`, and keep components and directives focused on presentation and interaction.

## Amber Hunter naming

Use short names that describe responsibility. Omit the `Component` suffix and avoid redundant prefixes such as `App`, `Custom`, `Base`, `Global`, and `Shared`. Use `Service`, `Pipe`, and `Store` when they clarify the role. Keep existing names unless renaming is approved within the issue scope. The root component is `App` in [app.ts](../../apps/web/src/app/app.ts). Preserve the `app-` convention for element selectors.

| Artifact | Identifier | File |
| --- | --- | --- |
| Shell component | `Header` | `header.ts` |
| Shell component | `MobileNavigation` | `mobile-navigation.ts` |
| Feature component | `BeachCard` | `beach-card.ts` |
| Service | `ForecastService` | `forecast-service.ts` |
| Pipe | `WindDirectionPipe` | `wind-direction-pipe.ts` |
| Directive | `AutoFocus` | `auto-focus.ts` |
| Signal-based state | `ForecastStore` | `forecast-store.ts` |
| Domain type | `BeachForecast` | `beach-forecast.ts` |

## Ownership and imports

Use these boundaries under `apps/web/src/app/` as code is added.

- **Core** owns the application shell and application-wide infrastructure. For AH-010, place `Header` in `core/header/header.ts` and `MobileNavigation` in `core/mobile-navigation/mobile-navigation.ts`. Keep root composition, configuration, and route registration in the existing app entry files.
- **Features** own product areas such as Home, Map, Beaches, and Academy. Keep each area's components, services, pipes, directives, types, state, and utilities near their consumers. For example, start `BeachCard` in Beaches. Cross-feature imports must target an explicitly exposed entry point, such as a named route export. Avoid private implementation imports and circular dependencies. A direct import of an exposed file is sufficient.
- **Shared** contains feature-independent code with demonstrated reuse or an explicit architectural boundary. Candidates include generic UI primitives, directives, pipes, and pure utilities. Shared code must be usable without importing feature internals. Keep services and types with their owner by default. Cross-package domain and transport contracts follow the [architecture baseline](../baseline/ARCHITECTURE.md).

## DI, state, and UI

- Use standalone components and strict TypeScript. Choose providers by lifetime and ownership. Use root scope for application-lifetime instances, route providers for dependencies scoped to a route subtree, and component providers for per-instance dependencies. A root-provided service may still belong to a feature.
- Use Signals for local reactive state where appropriate and `computed()` for derived values. Use the Angular Router as the source of navigation state, including active links. Avoid duplicate state and unnecessary manual subscriptions.
- Prefer Angular template control flow for conditions and loops. Use semantic HTML and accessible native interactions. Reuse [Baltic Explorer tokens](../baseline/DESIGN_SYSTEM.md#light-theme-tokens). Use Angular CDK when native HTML and CSS cannot meet the interaction requirements.

## Abstraction and review

Prefer a pure function when logic needs neither dependency injection nor managed state. Extract reusable code once real consumers or an explicit boundary justify the move. Avoid generic base classes, wrappers around trivial functions, barrel files for every folder, empty scaffolding, and additional state-management or infrastructure packages. Keep reorganizations within the issue scope.

In PR review, check that new files have a clear owner, imports respect feature boundaries, and providers and state match the lifetime of their consumers. Ask for a concrete consumer or boundary when code moves into `shared`.
