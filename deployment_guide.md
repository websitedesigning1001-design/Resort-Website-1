# 🚀 Aura Cove: 100% Free Serverless Deployment Guide (Vercel + Neon.tech)

This guide details the step-by-step process to deploy the full-stack **Aura Cove** website using **Vercel** (frontend and serverless backend hosting) and **Neon.tech** (serverless PostgreSQL database).

This architecture is **completely free, highly secure, and requires no keep-warm pingers**. Because Vercel and Neon are serverless, they boot instantly when a user visits and never stay permanently offline.

---

## 🏗️ 1. Serverless Architecture
* **Frontend:** Hosted on Vercel's global CDN (always fast, never sleeps, 100% free).
* **Backend:** Express routes are served as Vercel Serverless Functions.
* **Database:** Serverless PostgreSQL on Neon.tech. 
* **Media Uploads:** In serverless mode, images uploaded by the admin are compressed to WebP/JPEG using `sharp` in-memory and stored directly inside Neon PostgreSQL as Base64 strings. This removes the need for file system write permissions or external file storage (like S3/Cloudinary), making the site completely self-contained and 100% free!

---

## 💾 Step 1: Create a Free Database on Neon.tech
Neon offers a serverless PostgreSQL database that auto-resumes instantly and does not require a credit card.

1. Go to [Neon.tech](https://neon.tech/) and sign up for a free account.
2. Click **Create Project**:
   * **Project Name:** `auracove-db`
   * **Database Version:** PostgreSQL 16 (default)
   * **Region:** Choose the region closest to your clients.
3. Once created, copy the **Connection String** from the dashboard. It will look like this:
   `postgresql://neondb_owner:xxxxxx@ep-xxxxxx.region.pooler.neon.tech/neondb?sslmode=require`

---

## ☁️ Step 2: Deploy to Vercel
Vercel will build your static Vite frontend and package your Express backend routes as Serverless Functions automatically using the project's root `vercel.json`.

1. Sign up for a free account at [Vercel.com](https://vercel.com/).
2. Click **Add New** → **Project**.
3. Import your GitHub repository containing the Aura Cove code.
4. In the configuration settings:
   * **Framework Preset:** `Vite` (Vercel auto-detects this)
   * **Root Directory:** `./`
   * **Build and Output Settings:** Leave as default (Vercel runs `npm run build` and serves the `dist` folder).
5. Expand the **Environment Variables** tab and add:
   * `DATABASE_URL` = `[Paste your Neon.tech Connection String from Step 1]`
   * `JWT_SECRET` = `[Input a long, random secure string (e.g. aura_cove_secret_2026)]`
6. Click **Deploy**. Vercel will build and launch your website.

---

## 🛡️ Step 3: Verification Checklist
Once your build is complete:
1. Navigate to your custom Vercel URL (e.g., `https://aura-cove.vercel.app`).
2. Verify all pages (Heritage, Experiences, Rooms, Contact) load instantly.
3. Go to `/admin` and log in using the default admin credentials:
   * **Username:** `admin`
   * **Password:** `adminpassword123`
4. **Important:** Change your password immediately in the **Company Profile** tab of the dashboard to secure the site.
5. Go to the **Media Library** tab and upload a test image. Once uploaded, verify it appears in the gallery (this checks the serverless memory upload and Base64 database storage).
