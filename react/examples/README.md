# Example: assembling Retroma with React

`App.tsx` composes the full set of `@retroma/react` components into a working
Obsidian-lookalike workspace: ribbon, file explorer, tabbed editor,
properties sidebar, command palette, settings modal, and status bar.

To run it locally, pair with any React bundler (Vite, Next.js, …) and import:

```tsx
import ExampleApp from "../react/examples/App";
```

Make sure the CSS is imported once:

```ts
import "@retroma/react/styles.css";
```
