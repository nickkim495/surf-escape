<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Product copy

- The composite swell + wind metric is **Surf Score** in UI and user-facing copy — not “surf blend.” Types live in `lib/types.ts` as `SurfScore` / `SurfScoreBreakdown`.
- The combined rank (surf + price) badge is **Trip Score** in UI — not “Trip.” The field remains `tripScore` in types.
