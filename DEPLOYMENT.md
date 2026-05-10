# TaskFlow - Deployment Guide

This guide covers deploying TaskFlow to Render using a monorepo structure.

## Prerequisites

- GitHub repository (already have your code pushed)
- Render account (https://render.com)
- MongoDB Atlas account (for database)
- Generated JWT_SECRET

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user with username and password
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/taskflow`
5. Keep this safe - you'll need it for environment variables

## Step 2: Deploy Backend on Render

### Option A: Using GitHub Connection (Recommended)

1. **Create Web Service on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your TaskFlow repository

2. **Configure Backend Service:**
   - **Name:** taskflow-backend (or similar)
   - **Root Directory:** `backend` ⚠️ (Important!)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
   - **Instance Type:** Free (or Starter if Free unavailable)

3. **Add Environment Variables:**
   - Click "Environment"
   - Add these variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
     JWT_SECRET=generate_a_strong_random_secret_here
     NODE_ENV=production
     PORT=5000
     ```

4. **Deploy:**
   - Render will automatically build and deploy
   - Copy your service URL (e.g., `https://taskflow-backend.onrender.com`)
   - Wait for "Live" status (2-3 minutes)

### Option B: Manual Deployment from CLI

```bash
# 1. Install Render CLI
npm install -g @render-com/cli

# 2. Log in
render login

# 3. Deploy backend
cd backend
render deploy --name taskflow-backend
```

## Step 3: Deploy Frontend on Render (or Vercel)

### Option A: Deploy on Render

1. **Create Web Service for Frontend:**
   - "New +" → "Web Service"
   - Connect GitHub repository
   - Select TaskFlow repo

2. **Configure Frontend:**
   - **Name:** taskflow-frontend
   - **Root Directory:** `frontend`
   - **Runtime:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npx serve -s build`
   - **Instance Type:** Free

3. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://taskflow-backend.onrender.com
   NODE_ENV=production
   ```

4. **Deploy** and wait for live status

### Option B: Deploy Frontend on Vercel (Better for React)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Select project

3. **Configure Frontend:**
   - **Framework:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build`

4. **Set Environment Variables:**
   ```
   REACT_APP_API_URL=https://taskflow-backend.onrender.com
   ```

5. **Deploy** - Vercel will handle it automatically

## Step 4: Post-Deployment Testing

### Test Backend
```bash
curl https://taskflow-backend.onrender.com/health
```

### Test Frontend
- Open your frontend URL in browser
- Try logging in / creating tasks
- Check browser console for errors

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check backend logs on Render, verify environment variables |
| CORS errors | Ensure backend CORS config includes frontend URL |
| MongoDB connection fails | Verify MONGODB_URI and IP whitelist in Atlas |
| Blank frontend | Check REACT_APP_API_URL in environment variables |
| API calls timeout | Free tier on Render may be slow - upgrade if needed |

## Step 5: Connect Domains (Optional)

### Add Custom Domain to Render Backend
1. Go to Web Service → Settings → Domains
2. Add custom domain
3. Update DNS records

### Add Custom Domain to Vercel Frontend
1. Go to Project Settings → Domains
2. Add custom domain
3. Follow DNS instructions

## Environment Variables Checklist

### Backend (Render)
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ NODE_ENV=production
- ✅ PORT=5000

### Frontend (Vercel/Render)
- ✅ REACT_APP_API_URL=<backend-url>
- ✅ NODE_ENV=production

## Monitoring & Maintenance

### View Backend Logs
- Render Dashboard → Select Service → Logs

### Check Uptime
- Render provides uptime status

### Update Deployment
- Push to GitHub → Auto-redeploy (if connected)
- Or manually redeploy from Render Dashboard

## Troubleshooting Commands

```bash
# Check if backend is running
curl -I https://taskflow-backend.onrender.com

# View render.yaml (backend config)
cat backend/render.yaml

# Test API locally before deployment
cd backend
npm start
curl http://localhost:5000
```

## Next Steps

1. ✅ Deploy backend first
2. ✅ Get backend URL
3. ✅ Update frontend REACT_APP_API_URL
4. ✅ Deploy frontend
5. ✅ Test end-to-end
6. ✅ Add custom domains (optional)

---

**Need Help?**
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Vercel Docs: https://vercel.com/docs
