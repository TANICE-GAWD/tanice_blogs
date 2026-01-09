# Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Setup Environment Variables

Copy `.env.local` and update with your values:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
NODE_ENV=development
```

## 3. Start Development Server

```bash
npm run dev
```

## 4. Access Admin Panel

1. Go to `http://localhost:3000/admin`
2. Enter your admin credentials
3. Start creating blog posts!

## 5. Customize Your Blog

- Update site information in `app/layout.tsx`
- Modify colors in `app/globals.css`
- Add your profile image to `public/profile.jpg`
- Update about page content in `app/about/page.tsx`

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify username/password

### Admin Access Issues
- Check environment variables are loaded
- Verify ADMIN_USERNAME and ADMIN_PASSWORD
- Clear browser cache

### Build Issues
- Run `npm run build` to check for errors
- Ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`