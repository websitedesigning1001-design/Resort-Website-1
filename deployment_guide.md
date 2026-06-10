# 🚀 Aura Cove Deployment & Hosting Guide

This guide details the step-by-step process to deploy the full-stack **Aura Cove** website on **Render** or **Railway**. 

---

## 🏗️ 1. Unified Deployment Architecture
To keep hosting costs at zero (or minimal) and completely eliminate CORS conflicts, the application has been optimized to run as a **single, unified service**:
1. During the build phase, the React frontend is compiled into static assets inside the `dist` directory.
2. The Express backend is configured to statically serve the compiled React app.
3. Any route that does not start with `/api` or `/uploads` is caught and redirected to `dist/index.html` (enabling smooth client-side React Router navigation).
4. SQLite is used as a lightweight database. Since SQLite is file-based, a **Persistent Volume (Disk)** must be attached to the service to prevent database resets and keep uploaded images safe when the server restarts.

---

## 🛠️ 2. Deployment Settings Overview
For both platforms, use the following root project settings:

* **Build Command:** `npm run build:prod` (Installs frontend deps, compiles assets, and installs backend deps).
* **Start Command:** `npm run start:prod` (Launches the Express production server on the allocated port).
* **Environment Variables:**
  * `NODE_ENV`: `production`
  * `JWT_SECRET`: A long, random string (e.g., `aura_cove_super_secure_production_key_2026`)
  * `PORT`: `5000` (or automatically set by the hosting provider)

---

## 🚂 Option A: Deploying on Railway (Recommended)
Railway is the fastest and most stable platform for full-stack Node.js + SQLite apps.

### Step 1: Create a Railway Account & Connect GitHub
1. Sign up on [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select the repository containing your website code.

### Step 2: Configure variables
1. In the service settings, go to the **Variables** tab.
2. Add the following variables:
   * `NODE_ENV` = `production`
   * `JWT_SECRET` = `[Choose a secure random key]`
   * `PORT` = `5000`

### Step 3: Add a Persistent Volume (Disk) for Database & Uploads
*Since SQLite is a file-based database, Railway's ephemeral container resets on every deployment. You must mount a persistent disk to retain your database and uploaded images.*

1. In your Railway service dashboard, click **Settings**.
2. Scroll down to **Volumes** and click **Add Volume**.
3. Create a volume:
   * **Name:** `auracove-storage`
   * **Mount Path:** `/app/server/uploads` (This maps to the image uploads directory)
   * **Size:** `1GB` to `5GB` (usually free or cheap)
4. Repeat to create a second volume for the database file:
   * **Name:** `auracove-db`
   * **Mount Path:** `/app/server/database.sqlite` (or mount a volume on `/app/server` to cover both database and uploads in one disk).

---

## ☁️ Option B: Deploying on Render
Render is a popular free-tier hosting alternative.

### Step 1: Create a Web Service
1. Log in to [Render.com](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.

### Step 2: Configure Build Settings
* **Runtime:** `Node`
* **Region:** Choose the region closest to your users.
* **Branch:** `main` (or your active dev branch)
* **Build Command:** `npm run build:prod`
* **Start Command:** `npm run start:prod`
* **Plan:** Free or Starter

### Step 3: Add Environment Variables
1. Go to the **Environment** tab.
2. Add the following variables:
   * `NODE_ENV` = `production`
   * `JWT_SECRET` = `[Your secure random key]`

### Step 4: Add Persistent Disk Mount
1. Go to the **Disks** tab.
2. Click **Add Disk**.
3. Configure the disk settings:
   * **Name:** `uploads-disk`
   * **Mount Path:** `/opt/render/project/src/server/uploads` (This is the absolute path to the server uploads folder on Render)
   * **Size:** `1GB` (Render free tier includes 1GB disk space)

---

## 🛡️ 3. Verification Checklist
Once your build is complete and the service is running:
1. Navigate to your custom domain or the provider URL (e.g. `https://your-app.up.railway.app` or `https://your-app.onrender.com`).
2. Verify the website loads, smooth scrolling flows correctly, and all pages (Heritage, Experiences, Rooms) render.
3. Go to `/admin` and log in using:
   * **Username:** `admin`
   * **Password:** `adminpassword123`
4. Change your password immediately in the **Company Profile** tab to secure your panel.
5. Upload a test image in the **Media Library** tab to verify that the persistent uploads disk is mounting and writing correctly.
