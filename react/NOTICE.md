# Third-party notices

## COSS UI (AGPL-3.0-or-later)

The following directories contain source derived from the COSS UI package,
originally published at <https://github.com/cosscom/coss> under the terms of
the **GNU Affero General Public License v3.0 or later**. The full text of that
license is preserved at [`LICENSE-COSS`](./LICENSE-COSS).

```
src/components/*.tsx      (every component primitive)
src/base-ui/*.ts
src/hooks/*.ts
src/lib/utils.ts
src/styles/globals.css
```

Downstream consumers who redistribute **or run as a network-exposed service**
any modified version of the files listed above must comply with the AGPL-3.0
obligations (source availability, notice, same-license, §13 network-use).

## Retroma (MIT)

Everything else in this package — including `src/composites/**`,
`src/styles/retroma.css`, `src/styles/tokens.css`, `src/index.ts`,
`src/composites/index.ts`, build configuration, documentation, and the
upstream `theme.css` stylesheet — is licensed under the **MIT License** (see
[`../LICENSE.txt`](../LICENSE.txt) at the repo root).

When these two layers are distributed together as `@retroma/react`, the
package is effectively **dual-licensed**: MIT for the Retroma layer, AGPL-3.0
for the COSS-derived primitives. Users who want to avoid the AGPL obligations
can consume only the MIT-licensed composites tier by swapping in alternate
primitives that match the same API surface.
