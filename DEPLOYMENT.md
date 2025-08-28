# Deployment Guide & Troubleshooting

## 🚀 Vercel Deployment

### Quick Deploy
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a Vite project
4. Deploy!

### Manual Configuration
If you need to configure manually:

**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Environment Variables
Add these in Vercel dashboard under Settings > Environment Variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_JOTFORM_CONTACT_ID=your_contact_form_id
VITE_JOTFORM_NEWSLETTER_ID=your_newsletter_form_id
VITE_JOTFORM_BOOK_ORDER_ID=your_book_order_form_id
```

## 🔧 Common Issues & Solutions

### 1. White Screen / Blank Page
**Symptoms:** Page loads but shows only white screen
**Causes & Solutions:**
- **Missing vercel.json:** ✅ Already included in project
- **JavaScript errors:** Check browser console for errors
- **Environment variables:** Ensure all required env vars are set
- **Build errors:** Check Vercel build logs

### 2. 404 Errors on Page Refresh
**Symptoms:** Direct URLs or page refresh shows 404
**Solution:** ✅ Already fixed with `vercel.json` rewrites configuration

### 3. Firebase Connection Issues
**Symptoms:** Auth/database features not working
**Solutions:**
- Verify all Firebase environment variables are set correctly
- Check Firebase project settings and permissions
- Ensure Firebase project is active and billing is enabled (if required)

### 4. Jotform Integration Issues
**Symptoms:** Forms not loading or submitting
**Solutions:**
- Verify Jotform IDs are correct
- Check Jotform account is active
- Ensure forms are published and public

### 5. CSS/Styling Issues
**Symptoms:** Styles not loading or appearing broken
**Solutions:**
- ✅ Tailwind CSS is properly configured
- Check for any CSS import errors in browser console
- Verify all font imports are working

## 🛠️ Debugging Steps

### 1. Local Testing
```bash
# Build locally to check for errors
npm run build

# Test production build locally
npm run preview
```

### 2. Check Build Logs
- Go to Vercel dashboard
- Click on your deployment
- Check "Functions" and "Build Logs" tabs for errors

### 3. Browser Console
- Open browser developer tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for failed requests

### 4. Environment Variables
```bash
# Verify env vars are loaded (in browser console)
console.log(import.meta.env)
```

## 📱 Performance Optimization

### Already Implemented:
- ✅ Code splitting with lazy loading
- ✅ Image optimization
- ✅ Chunk splitting for better caching
- ✅ Error boundaries for graceful error handling

### Additional Optimizations:
- Enable Vercel Analytics
- Add service worker for offline support
- Implement image CDN for better performance

## 🔍 Monitoring

### Vercel Analytics
Enable in Vercel dashboard for:
- Page views and performance metrics
- Core Web Vitals monitoring
- Real user monitoring

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## 📞 Support

If you're still experiencing issues:

1. **Check this guide first** - Most common issues are covered here
2. **Check Vercel documentation** - https://vercel.com/docs
3. **Check browser console** - Look for specific error messages
4. **Check build logs** - In Vercel dashboard
5. **Contact support** - Through the website contact form

## ✅ Deployment Checklist

Before deploying:
- [ ] All environment variables configured
- [ ] Firebase project set up and configured
- [ ] Jotform account and forms created
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate enabled (automatic with Vercel)
- [ ] Analytics configured (optional)

## 🌐 Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in site settings

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### GitHub Pages
Not recommended for this project due to client-side routing requirements.

---

**The website should now be fully functional on Vercel!** 🎉
