# Deployment Guide - Notes Keeper App

## Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Vercel account (free)
- Render account (free)

---

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login → Create a FREE cluster
3. Choose: **M0 Sandbox (FREE)**
4. Click "Create"
5. **Security Setup**:
   - Username: `notesapp` (or your choice)
   - Password: Generate a strong password → **SAVE IT**
   - Click "Create User"
6. **Network Access** (CRITICAL for Render):
   
   **How to find Network Access:**
   - After logging into MongoDB Atlas, you'll see your dashboard
   - Look at the **LEFT SIDEBAR** (dark green/black background)
   - Under the "SECURITY" section, find and click **"Network Access"**
   - (It's usually between "Database Access" and "Data API")
   
   **Add IP Whitelist:**
   - If you already have an IP address listed, **KEEP IT** (that's for local development)
   - Click the green **"+ ADD IP ADDRESS"** button (top right)
   - In the popup, click **"ALLOW ACCESS FROM ANYWHERE"** button
   - This will auto-fill: `0.0.0.0/0`
   - Optional: Add comment "Render deployment"
   - Click **"Confirm"**
   - You should now see **BOTH** IPs in the list (your local IP + 0.0.0.0/0)
   - Status should show "Active" for `0.0.0.0/0`
   - **WAIT 2-3 minutes** for changes to take effect
7. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://notesapp:<password>@cluster0...`)
   - Replace `<password>` with your actual password
   - **SAVE THIS STRING**

---

## Step 2: Deploy Backend to Render

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to [render.com](https://render.com) → Sign up with GitHub

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your notes app repo
   - Configure:
     - **Name**: `notes-backend` (or your choice)
     - **Root Directory**: Leave BLANK or set to `Notepad/backend` (depending on your repo structure)
       - If your GitHub repo root contains the `backend` folder directly, leave it BLANK
       - If your repo has a parent folder (like `Notepad`), set it to the full path
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && node server.js`
     - **Plan**: FREE

4. **Add Environment Variables**:
   - Scroll down and click "Advanced" button
   - In the "Environment Variables" section, click "Add Environment Variable"
   - Add these three variables one by one:
   
   **Variable 1:**
   - Key: `PORT`
   - Value: `5000`
   
   **Variable 2:**
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string from Step 1
   - Example: `mongodb+srv://notesapp:yourpassword@cluster0.xxxxx.mongodb.net/noteskeeper?retryWrites=true&w=majority`
   
   **Variable 3:**
   - Key: `JWT_SECRET`
   - Value: Any random string (minimum 32 characters)
   - Example: `my-super-secret-jwt-key-2024-notes-app-xyz123`
   - You can generate one at: https://randomkeygen.com/

5. Click "Create Web Service"

6. Wait 2-3 minutes for deployment

7. **Copy your backend URL**: 
   - Will be like: `https://notes-backend-xxxx.onrender.com`
   - **SAVE THIS URL**

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - Click "Edit" on Environment Variables

3. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Use the Render URL from Step 2, add `/api` at the end)

4. Click "Deploy"

5. Wait 1-2 minutes

6. **Your app is live!** 🎉
   - Vercel will give you a URL like: `https://your-app.vercel.app`

---

## Step 4: Test Your Deployed App

1. Open your Vercel URL
2. Sign up with a new account
3. Create a note
4. Test all features

---

## Important Notes

### Free Tier Limitations:
- **Render**: Backend sleeps after 15 min inactivity (wakes in ~30s on first request)
- **MongoDB Atlas**: 512MB storage (plenty for personal use)
- **Vercel**: Unlimited bandwidth for personal projects

### Troubleshooting:

**Render Deployment Failed?**

1. **Build Failed / "Cannot find module" Error:**
   - **CRITICAL**: Check your Root Directory setting:
     - Go to Render Dashboard → Settings → Build & Deploy
     - If error shows `/opt/render/project/src/server.js` not found:
       - Set Root Directory to BLANK (empty)
       - Set Build Command to: `cd backend && npm install`
       - Set Start Command to: `cd backend && node server.js`
     - Click "Save Changes" and manually redeploy
   - Verify package.json is in the backend folder
   - Check Render logs for missing dependencies

2. **Deploy Failed / Won't Start:**
   - Verify `Start Command` is `node server.js`
   - Check all 3 environment variables are set correctly:
     - PORT=5000
     - MONGODB_URI (no spaces, correct password)
     - JWT_SECRET (minimum 32 characters)
   - Go to Render Dashboard → Your Service → "Environment" tab to verify

3. **MongoDB Connection Error ("Could not connect to any servers"):**
   - **MOST COMMON ISSUE**: IP not whitelisted
     - Go to MongoDB Atlas → Network Access
     - Ensure `0.0.0.0/0` is in the IP Access List
     - If not, click "Add IP Address" → "Allow Access from Anywhere"
     - Wait 2-3 minutes after adding, then redeploy on Render
   - Verify MongoDB Atlas connection string is correct in Render environment variables
   - Check password has no special characters (or is URL-encoded)
   - Verify connection string format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`

4. **Service Running but Not Responding:**
   - Wait 30-60 seconds (free tier cold start)
   - Check Render logs for errors
   - Visit: `https://your-service.onrender.com` (should show "Notes API is running")

**Backend not responding?**
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure environment variables are set

**Frontend can't connect to backend?**
- Check REACT_APP_API_URL is correct
- Must include `/api` at the end
- Redeploy frontend after changing env variables

**CORS errors?**
- Backend already has CORS enabled
- If issues persist, check Render logs

---

## Updating Your App

### Update Backend:
```bash
git add .
git commit -m "Update backend"
git push
```
Render auto-deploys from GitHub

### Update Frontend:
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys from GitHub

---

## Custom Domain (Optional)

### Vercel:
- Go to Project Settings → Domains
- Add your custom domain (free SSL included)

### Render:
- Go to Settings → Custom Domain
- Add your domain (free SSL included)

---

## Cost: $0/month ✅

You're all set! Your app is now live and accessible worldwide for FREE.
