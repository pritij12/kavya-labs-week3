# Kavya Labs, Week 3: Admin dashboard

Brief: user management + analytics. Tech: Next.js 14, NextAuth.js (Google), Prisma + Supabase (Postgres), Tailwind CSS.
This includes Week 1 (landing page) and Week 2 (login).

## What is new in Week 3

```
week3-admin/
├── app/admin/page.js                     Admin dashboard: number cards, 7-day signup chart, user table
├── app/api/admin/users/[id]/route.js     Admin actions: make admin, suspend, delete (admins only)
├── prisma/schema.prisma                  Database tables (User has role, status, lastLoginAt)
├── lib/prisma.js                         Database connection
├── lib/auth.js                           Login + roles + first admin + suspended users blocked
├── components/Buttons.jsx                Now also has the admin action buttons
├── app/dashboard/page.js                 Shows your role, link to admin if you are admin
└── middleware.js                         Protects /dashboard and /admin
```

## Set up

1. **Database (Supabase):** create a free project at supabase.com, click **Connect**, and copy two connection strings: the Transaction pooler (port 6543) for `DATABASE_URL` and the Session pooler or Direct one (port 5432) for `DIRECT_URL`.
2. **Google login:** same as Week 2 (OAuth client, redirect URI `http://localhost:3000/api/auth/callback/google`).
3. Copy `.env.example` to `.env.local` and fill everything in. `ADMIN_EMAIL` = the Google email you will sign in with. It becomes the first admin.
4. Install, create the tables, run:
   ```
   npm install
   npx prisma db push
   npm run dev
   ```
5. Sign in with your ADMIN_EMAIL account, open **Dashboard**, then **Open admin dashboard**.
   To test user management, sign in once with a second Google account (add it as a Test user in Google). It will appear in the table.

## Submit (GitHub + Vercel)

1. Upload the folder to a new GitHub repository (for example `kavya-labs-week3`). Never upload `.env.local`.
2. Import it on vercel.com. In **Environment Variables** add all 7 values: `DATABASE_URL`, `DIRECT_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (your Vercel address) and `ADMIN_EMAIL`.
3. Deploy. Add `https://YOUR-APP.vercel.app/api/auth/callback/google` to Google's redirect URIs.
4. Run `npx prisma db push` once from your computer (the tables must exist in Supabase).
5. Test on the live link: sign in, open the admin dashboard, make/remove admin, suspend, delete.

Note: this version uses Postgres (Supabase) instead of a local file, because Vercel cannot keep database files.

Kavya Labs is a fictional company from a virtual startup exercise. While the Google consent screen is in Testing mode, only the test users you added can sign in.
