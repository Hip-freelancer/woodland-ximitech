This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin Panel & Database Setup

This project features a comprehensive Admin interface and uses MongoDB with Cloudflare R2 for media upload.

### 1. Environment Setup
Copy the `.env.example` file to `.env.local` and fill in your Cloudflare R2 and MongoDB credentials.
```bash
cp .env.example .env.local
```

### 2. Seeding the Database
For the first time setup, you will need to populate the database with initial categories, products, and articles (both English and Vietnamese).

Run the seeded script:
```bash
npx tsx src/scripts/seed.ts
```

### 3. Accessing Admin Panel
Once the app is running (`npm run dev`), navigate to `/admin`.
You will be prompted for Basic Authentication. Use the credentials defined in your `.env.local` (`ADMIN_USER` and `ADMIN_PASS`).
