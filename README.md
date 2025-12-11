## Advocate Finder

A Next.js application for searching and browsing advocates. Features both client-side and server-side pagination implementations.

### Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL

### Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup (Optional)

The app works out of the box with mock data. To use a real database:

1. Start PostgreSQL (via Docker or locally):

```bash
docker compose up -d
```

2. Create the database and push the schema:

```bash
npx drizzle-kit push
```

3. Seed the database:

```bash
curl -X POST http://localhost:3000/api/seed
```
