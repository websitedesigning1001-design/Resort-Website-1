# 🚀 Aura Cove 100% Free Deployment & Hosting Guide

This guide details the step-by-step process to deploy the full-stack **Aura Cove** website on **Render** (free application hosting) connected to **Neon.tech** (free PostgreSQL serverless database). 

By using Neon instead of Supabase, your database **automatically wakes up** when a user visits and never stays permanently paused. Pinned with a free keep-warm monitor, your Render server will stay active 24/7 without costing a cent!

---

## 🏗️ 1. Free Production Architecture
To keep hosting costs at exactly **$0.00** while keeping the site fast and reliable:
1. **Frontend + Backend:** Express backend serves compiled React assets statically on **Render (Free Tier)**.
2. **Database:** Serverless PostgreSQL on **Neon.tech (Free Tier)**. SQLite is only used for local development, while production automatically shifts to Neon when `DATABASE_URL` is configured.
3. **Uptime Keeping:** A free pinging service (like UptimeRobot) pings the site every 14 minutes to prevent Render's free instance from sleeping.

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

## ☁️ Step 2: Deploy Backend + Frontend on Render.com
Render will pull your code from GitHub, run the production build, and host the Express server.

1. Create a free account on [Render.com](https://render.com/).
2. Click **New** → **Web Service**.
3. Connect your GitHub repository containing the Aura Cove code.
4. Configure the **Build Settings**:
   * **Name:** `aura-cove`
   * **Region:** Same region as your Neon database.
   * **Branch:** `main` (or `master`)
   * **Runtime:** `Node`
   * **Build Command:** `npm run build:prod`
   * **Start Command:** `npm run start:prod`
   * **Instance Type:** `Free`
5. Click **Advanced** to add **Environment Variables**:
   * `NODE_ENV` = `production`
   * `JWT_SECRET` = `[Input a long, random secure string]`
   * `DATABASE_URL` = `[Paste your Neon.tech Connection String copied in Step 1]`
6. Click **Create Web Service**. Render will install dependencies, compile the React build, and boot the server.

---

## ⏰ Step 3: Keep the Website Warm (Prevent Sleeping)
Render's free tier spins down (sleeps) after 15 minutes of inactivity, causing the next visitor to experience a 50-second delay. You can bypass this sleep cycle for free:

1. Sign up for a free account at [UptimeRobot](https://uptimerobot.com/) or [cron-job.org](https://cron-job.org/).
2. Create a new **HTTP Monitor** / **Cron Job**:
   * **Friendly Name:** `Aura Cove Keep-Warm`
   * **URL:** `https://your-aura-cove-subdomain.onrender.com`
   * **Interval:** Every **14 minutes** (Render sleeps at 15 minutes, so 14 keeps it awake).
3. Save the monitor. This will ping your website automatically, keeping it active and fast 24/7 at no cost.

---

## 🛡️ Step 4: Verification Checklist
Once your build is complete:
1. Navigate to your custom Render URL (e.g., `https://aura-cove.onrender.com`).
2. Verify the website loads, smooth scrolling flows correctly, and all pages (Heritage, Experiences, Rooms) render.
3. Go to `/admin` and log in using the default admin credentials:
   * **Username:** `admin`
   * **Password:** `adminpassword123`
4. **Important:** Change your password immediately in the **Company Profile** tab of the dashboard to secure the site.
5. Inquiries and changes to CMS text will now persist indefinitely in Neon's database, even when deployments update!
