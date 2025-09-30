# Admin Dashboard Setup Guide

This guide will help you set up and use the comprehensive admin dashboard for The Sunday Traveller blog.

## Prerequisites

1. **Firebase Project**: You need a Firebase project with Firestore enabled
2. **Environment Variables**: Configure your `.env.local` file
3. **Admin Users**: Create initial admin users

## 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database**:
   - Go to Firestore Database in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select a location for your database

4. Enable **Authentication** (optional but recommended):
   - Go to Authentication in the left sidebar
   - Configure sign-in methods as needed

5. Get your Firebase configuration:
   - Click the gear icon → "Project settings"
   - Scroll to "Your apps" section
   - Click "Add app" → Web app (</>) icon
   - Copy the configuration object

## 2. Environment Configuration

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Generate a NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

## 3. Create Admin Users

Run the admin user creation script:

```bash
npm run create-admin
```

This will create three users:
- **Admin**: admin@thesundaytraveller.com / admin123 (role: admin)
- **Editor**: editor@thesundaytraveller.com / editor123 (role: editor)
- **Author**: author@thesundaytraveller.com / author123 (role: author)

## 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 5. Access the Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Use one of the admin credentials created above
3. You'll be redirected to the admin dashboard

## Admin Dashboard Features

### Dashboard Overview
- **Statistics**: Real-time counts of posts, news, destinations, media, views, and visitors
- **Recent Activity**: Latest content creation and updates
- **Quick Actions**: Shortcuts to create new content

### Content Management
- **Posts**: Create, edit, publish, and manage blog posts
- **Pages**: Manage static pages and content sections
- **Categories**: Organize content with categories
- **Tags**: Add and manage content tags
- **Media Library**: Upload and manage external images

### User Management
- **User Accounts**: Create and manage user accounts
- **Role Management**: Assign roles (super_admin, admin, editor, author, user)
- **Permission Control**: Granular permissions based on roles

### Analytics
- **Traffic Analytics**: Page views, unique visitors, session data
- **Content Performance**: Top performing pages and referrers
- **Device Breakdown**: Desktop, mobile, tablet usage
- **Geographic Data**: User locations and sessions

### Settings
- **Site Configuration**: Basic website settings
- **SEO Settings**: Meta tags, Open Graph, social media
- **Content Settings**: Posts per page, excerpt length, comments
- **Notification Settings**: Email and system notifications

## Role-Based Permissions

### Super Admin & Admin
- Full access to all features
- User management
- System settings
- All content operations

### Editor
- Create, edit, publish posts
- Media management
- View analytics
- Basic settings

### Author
- Create and edit own posts
- Upload media
- Limited permissions

### User
- Read-only access
- View published content

## Security Features

- **CSRF Protection**: All state-changing operations are protected
- **Rate Limiting**: API endpoints have rate limiting
- **Input Validation**: All inputs are sanitized and validated
- **Authentication**: JWT-based authentication with NextAuth
- **Role-Based Access Control**: Granular permissions system

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**: Check if you're logged in and have proper permissions
2. **Database connection issues**: Verify Firebase configuration in `.env.local`
3. **Admin login not working**: Run `npm run create-admin` to create admin users
4. **Analytics not loading**: Check if Google Analytics is configured (optional)

### Debug Mode

To enable debug logging, add to your `.env.local`:
```env
DEBUG=1
```

## Production Deployment

1. **Environment Variables**: Ensure all production environment variables are set
2. **Firebase Security Rules**: Update Firestore security rules for production
3. **Domain Configuration**: Update `NEXTAUTH_URL` and site URLs
4. **SSL Certificate**: Ensure HTTPS is properly configured

## API Reference

### Admin Endpoints

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/recent-activity` - Get recent activity
- `GET /api/admin/posts` - Get all posts
- `POST /api/admin/posts` - Create new post
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/media` - Get media files
- `POST /api/admin/media` - Upload media
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/settings` - Get site settings
- `POST /api/admin/settings` - Update settings

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Firebase console for any errors
3. Check the browser console for JavaScript errors
4. Verify all environment variables are correctly set

The admin dashboard is now fully functional and provides comprehensive control over all aspects of your website!