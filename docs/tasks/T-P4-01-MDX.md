# Task: P4-01 - Add MDX Rendering Dependency

## Justification for New Dependency

- **Dependency:** `react-markdown` and `remark-gfm`
- **What it does:** Renders raw Markdown/MDX strings into React components.
- **Why it's needed:** The project case studies are written in MDX (`content/projects/*.mdx`). We need to render the body content into HTML on the `projects/[id]` pages. Since the content doesn't use complex JSX components yet, `react-markdown` is the most stable and lightweight choice for React 19.
- **Size:** Very small (≈15kB gzipped).
- **Licence:** MIT.
- **Free-tier impact:** None.

We will install this in `apps/web`.
