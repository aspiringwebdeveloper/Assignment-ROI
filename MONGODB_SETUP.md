# MongoDB Atlas Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google/Email
3. Choose **FREE** tier (M0)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `roi_user` (or any name)
5. Set password: `YourSecurePassword123` (save this!)
6. User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - Or add your specific IP for better security
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://roi_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Add to Your Project
1. Create file `.env.local` in project root
2. Add this line (replace with your actual connection string):
   ```
   MONGODB_URI=mongodb+srv://roi_user:YourSecurePassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. **Important**: Replace `<password>` with your actual password!

### Step 7: Test Connection
```bash
npm run dev
```

Visit `http://localhost:3000` and try saving a scenario. If it works, MongoDB is connected! ✅

---

## 🔍 Troubleshooting

### Error: "MONGODB_URI not found"
- Make sure `.env.local` file exists in project root
- Check the variable name is exactly `MONGODB_URI`
- Restart the dev server after creating `.env.local`

### Error: "Authentication failed"
- Check your password in the connection string
- Make sure you created a database user (not just Atlas account)
- Password should not contain special characters like `@`, `#`, `%`

### Error: "Connection timeout"
- Check Network Access whitelist includes your IP
- Try adding `0.0.0.0/0` to allow all IPs
- Check your firewall/VPN settings

### Error: "Cannot connect to cluster"
- Wait 1-2 minutes for cluster to finish deploying
- Check cluster status in Atlas dashboard
- Verify connection string is correct

---

## 📝 Example .env.local File

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://roi_user:MyPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

---

## ✅ Verification

After setup, you should be able to:
1. ✅ Save scenarios
2. ✅ Load scenarios
3. ✅ Delete scenarios
4. ✅ See data persist after server restart
5. ✅ Deploy to Vercel with same data

---

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - Key: `MONGODB_URI`
   - Value: Your connection string
4. Deploy!

Your data will now persist across all users and deployments! 🎉

---

## 💡 Free Tier Limits

MongoDB Atlas Free Tier (M0):
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Perfect for demos and small projects

This is more than enough for your ROI simulator!
