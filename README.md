# URL-Shortener

A full-stack URL shortener built with Next.js 14 App Router and Tailwind CSS.

## Features

- Create short links from long URLs on the home page
- Random 6-character alphanumeric short code generation via Next.js API route
- Local persistence in `localStorage` as:
  - `{ shortCode, originalUrl, clicks, createdAt }`
- Dynamic `/[code]` redirect route with click-count increment
- `/dashboard` table with copy + delete actions and click stats
- Toast notification on copy success
- Responsive minimal UI

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000
