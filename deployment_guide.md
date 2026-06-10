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

---

## 🔔 Step 4: Optional - Set Up Instant Mobile Notifications
You can get instant push notifications sent directly to your phone (via Telegram) or your email inbox every time a guest submits an inquiry.

### Option A: Telegram Push Notifications (100% Free & Instant)
This acts exactly like a native app alert on your phone.
1. Download **Telegram** on your phone (if you don't already have it).
2. Open Telegram and search for `@BotFather`.
3. Start a chat and type `/newbot`. Follow the steps to name your bot and choose a username.
4. Copy the **HTTP API Token** (looks like `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).
5. Next, search for `@userinfobot` on Telegram, start a chat, and copy your **Id** (a 9-10 digit number).
6. In your **Vercel Dashboard** → **Project Settings** → **Environment Variables**, add:
   * `TELEGRAM_BOT_TOKEN` = `[Your HTTP API Token]`
   * `TELEGRAM_CHAT_ID` = `[Your User ID]`
7. Redeploy your project. Every new inquiry will ping your phone instantly!

### Option B: Resend Email Notifications (3,000 Free Emails/Month)
Sends a clean HTML email containing all stay inquiry data.
1. Sign up for a free account at [Resend.com](https://resend.com/).
2. Create an API Key in your Resend dashboard and copy it.
3. In your **Vercel Dashboard** → **Project Settings** → **Environment Variables**, add:
   * `RESEND_API_KEY` = `[Your Resend API Key]`
   * `NOTIFICATION_EMAIL` = `[The email address you want to receive notifications at]`
4. Redeploy your project. Every new inquiry will send an email summary to your inbox!

### Option C: Twilio SMS Notifications (Trial/Paid Plan)
Sends standard SMS text messages to a cellular phone number.
1. Create a free account at [Twilio.com](https://www.twilio.com/).
2. Navigate to your Twilio console and get:
   * **Account SID**
   * **Auth Token**
   * **Twilio Phone Number** (which you get for free on sign-up)
3. If using a Twilio trial account, you must verify your client's mobile number under **Verified Caller IDs** in the Twilio console before you can send texts to them.
4. In your **Vercel Dashboard** → **Project Settings** → **Environment Variables**, add:
   * `TWILIO_ACCOUNT_SID` = `[Your Twilio Account SID]`
   * `TWILIO_AUTH_TOKEN` = `[Your Twilio Auth Token]`
   * `TWILIO_FROM_NUMBER` = `[Your Twilio Phone Number]`
   * `TWILIO_TO_NUMBER` = `[The client's mobile phone number (with country code, e.g. +91XXXXXXXXXX)]`
5. Redeploy your project. Every new inquiry will send an SMS alert!


