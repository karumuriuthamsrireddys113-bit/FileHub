# 🚀 Production Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide provides end-to-end instructions for deploying **FileHub** into production:
- **Backend (Express + Prisma + MongoDB)** on [Render](https://render.com)
- **Frontend (React + Vite + TanStack Query)** on [Vercel](https://vercel.com)
- **Database** on [MongoDB Atlas](https://www.mongodb.com/atlas) (Free Tier M0)

---

## 📋 Overview Architecture

```
                    ┌─────────────────────────┐
                    │      User's Browser     │
                    └───────────┬─────────────┘
                                │
                                ▼
              ┌───────────────────────────────────┐
              │          Vercel (Frontend)        │
              │   https://filehub-client.vercel.app│
              └─────────────────┬─────────────────┘
                                │
                                │ API Requests (/api/...)
                                ▼
              ┌───────────────────────────────────┐
              │          Render (Backend)         │
              │  https://filehub-backend.onrender.com
              └─────────────────┬─────────────────┘
                                │
                                │ Prisma ORM
                                ▼
              ┌───────────────────────────────────┐
              │      MongoDB Atlas (Cluster)      │
              │     filehub.mongodb.net           │
              └───────────────────────────────────┘
```

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Free M0 Cluster)

Prisma with MongoDB requires a MongoDB Replica Set (standard in MongoDB Atlas).

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign in or create a free account.
2. Click **Create a Deployment** and select the **M0 Free Tier** (AWS, Azure, or Google Cloud in your closest region).
3. Under **Security Quickstart**:
   - **Database User**: Create a username (e.g. `filehub_user`) and a secure password. Save these credentials.
   - **Network Access**: Add IP Address `0.0.0.0/0` (Allow Access from Anywhere) so Render's cloud servers can connect to your database.
4. Click **Create User** and **Finish and Close**.
5. Go to your cluster overview and click **Connect** -> **Drivers** (Node.js).
6. Copy the connection string. It will look like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
7. Append `/filehub` before the `?` query parameters:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/filehub?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your actual database user credentials).*

---

## 🚀 Step 2: Push Repository to GitHub

Ensure your code is committed and pushed to your GitHub account:

```bash
# 1. Stage and commit all files
git add .
git commit -m "chore: prepare production deployment for Vercel and Render"

# 2. Add your GitHub remote repository (replace with your repository URL)
git remote add origin https://github.com/<your-username>/filehub.git

# 3. Push to main
git branch -M main
git push -u origin main
```

---

## ⚙️ Step 3: Deploy Backend to Render

Render will host the Node.js/Express server and run Prisma ORM.

### Option A: Using the Automated Blueprint (Recommended)

FileHub includes a pre-configured `render.yaml` Blueprint file at the repository root.

1. Sign up or log into [Render](https://dashboard.render.com).
2. Click the **New +** button in the top navigation bar and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will parse `render.yaml` and prompt you for the required environment variable:
   - `DATABASE_URL`: Paste your MongoDB Atlas connection string from Step 1.
5. Click **Apply**.
6. Render will automatically build the server (`npm install && npm run build`), run Prisma generate, and start the service on port 10000.
7. Once deployed, copy your Render service URL (e.g., `https://filehub-backend-xxxx.onrender.com`).

---

### Option B: Manual Web Service Setup on Render

If you prefer setting up the web service manually:

1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `filehub-backend`
   - **Language**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Under **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode & error handling |
   | `DATABASE_URL` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/filehub?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | *(Generate a 32+ character random string)* | Secret key for signing authentication JWT cookies |
   | `ALLOWED_ORIGINS` | `*` *(or your Vercel URL later)* | Allowed CORS origins |
5. Click **Deploy Web Service**.
6. Verify deployment by visiting `https://<your-render-app>.onrender.com/api/health` in your browser. You should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-10-26T...",
     "service": "FileHub API",
     "environment": "production"
   }
   ```

---

## 🌐 Step 4: Deploy Frontend to Vercel

Vercel will host the optimized React Vite Single-Page Application with global CDN distribution.

### Method 1: Using the Vercel Dashboard (Easiest)

1. Sign up or log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`filehub`).
4. In the **Configure Project** screen:
   - **Project Name**: `filehub` (or your chosen name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and choose `client`
   - **Build and Output Settings**:
     - Build Command: `npm run build` (default)
     - Output Directory: `dist` (default)
     - Install Command: `npm install` (default)
5. Under **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://<your-render-app>.onrender.com` |
   *(Replace `<your-render-app>` with your live Render backend URL from Step 3).*
6. Click **Deploy**.
7. Vercel will build and deploy your app in under 1 minute and assign you a production URL (e.g., `https://filehub.vercel.app`).

---

### Method 2: Using the Vercel CLI

If you have the Vercel CLI installed:

```bash
cd client
npx vercel
# Follow prompts to link project
# Set environment variable:
npx vercel env add VITE_API_URL production
# Enter your Render URL: https://<your-render-app>.onrender.com
# Deploy production build:
npx vercel --prod
```

---

## 🔒 Step 5: Tighten CORS Security (Optional but Recommended)

Now that both services are live:

1. Copy your Vercel production domain (e.g., `https://filehub.vercel.app`).
2. Go to your Render Dashboard -> select your `filehub-backend` service.
3. Go to **Environment** -> find or add `ALLOWED_ORIGINS`.
4. Update its value to:
   ```
   https://filehub.vercel.app,http://localhost:3000
   ```
5. Click **Save Changes**. Render will automatically redeploy with the strict CORS policy applied.

---

## 🩺 Production Health & Verification Checklist

- [ ] **Backend Health Check**: Open `https://<render-url>.onrender.com/health`. Expect HTTP 200 `{"status": "ok"}`.
- [ ] **Document API**: Open `https://<render-url>.onrender.com/api/documents`. Expect sample documents JSON.
- [ ] **Frontend Loads**: Open `https://<vercel-url>.vercel.app`. Verify the UI renders smoothly.
- [ ] **Create Document**: Click **+ Add Document**, fill in fields, and submit. Ensure toast confirms creation and card appears.
- [ ] **Edit Document**: Click edit on any document and update the title. Verify instant update.
- [ ] **Delete Document**: Test deleting a document and confirming removal.
- [ ] **Filter / Search**: Test searching and switching categories.

---

## 💡 Troubleshooting & Gotchas

### 1. Render Free Tier Cold Starts
- **Behavior**: Render free instances spin down after 15 minutes of inactivity. When the frontend makes a request to a dormant server, it may take 20–35 seconds to wake up.
- **Built-in Protection**: The FileHub Axios client is configured with a 45-second timeout and user-friendly cold-start notifications instead of failing immediately.

### 2. MongoDB Atlas Connection Timeout
- **Symptom**: `ServerSelectionTimeoutError` or `PrismaClientInitializationError`.
- **Solution**: Ensure your MongoDB Atlas Network Access has IP `0.0.0.0/0` allowed, and verify your username and password in `DATABASE_URL`.

### 3. Missing `VITE_API_URL` on Vercel
- **Symptom**: Network requests show 404 on `https://<vercel-domain>/api/documents`.
- **Solution**: In Vercel project settings, ensure `VITE_API_URL` is set to your Render URL (e.g. `https://<backend>.onrender.com`), and redeploy the latest commit.
