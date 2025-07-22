# Environment Variables

This project relies on a few environment variables for local and production setups.
Each variable has a sensible default so the stack runs out‑of‑the‑box.

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Base URL for the NestJS API used by the Next.js frontend. |
| `PORT` | `3001` | Port on which the NestJS API listens. |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed origin for CORS requests to the API. |
| `NODE_ENV` | `development` | Node runtime environment. |
| `MAX_UPLOAD_SIZE` | `52428800` | Maximum upload size in bytes (default 50MB). |
| `CI` | *unset* | When defined, Playwright will not reuse an existing dev server. |

These variables can be provided via `.env` files or your host environment.
