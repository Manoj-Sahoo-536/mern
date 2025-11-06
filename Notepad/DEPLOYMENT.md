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
6. **Network Access**:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
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
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: FREE

4. **Add Environment Variables**:
   Click "Advanced" → Add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_random_secret_key_min_32_chars
   ```
   
   Generate JWT_SECRET: Use any random string (32+ characters)
   Example: `my-super-secret-jwt-key-2024-notes-app-xyz123`

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
