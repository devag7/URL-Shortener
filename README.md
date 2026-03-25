# URL-Shortener

A full-stack URL shortener built with Next.js App Router and Tailwind CSS.

## Features

- Create short links from long URLs on the home page
- Random 6-character alphanumeric short code generation via Next.js API route
- Expiry selection per link: `1 day`, `7 days`, or `never`
- Local dashboard persistence in `localStorage` as:
  - `{ shortCode, originalUrl, clicks, createdAt, expiresAt, expiryType }`
- In-memory server resolution for shared short links while app is running
- Dynamic `/[code]` redirect route with server-first resolve and local fallback
- `/dashboard` table with search/filter, expired badges, copy + delete actions, and click stats
- QR code per short URL in dashboard (`qrcode.react`)
- Clicks bar chart (`recharts`)
- Copy-all CSV export action
- Toast notification on copy success
- Responsive minimal UI with hover animations and empty-state illustration

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000
