# Softgen Build Rules (Project Standard)

## Public UI Safety
- Never show environment variable names, file paths, database details, internal endpoints, or stack traces on public-facing pages.
- Public pages must use user-friendly, non-technical language.

## Admin vs Public
- Configuration guidance belongs in admin-only tools or documentation, not public UI.

## Database Discipline
- Always validate schema before writing queries.
- Prefer minimal, reversible migrations.
- Respect RLS; never bypass authorization in the frontend.

## Build Discipline (Token-efficient)
- Ship a working baseline first, validate, then iterate.
- Avoid broad refactors when a scoped change works.