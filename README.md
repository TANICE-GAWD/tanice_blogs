# Tech Blog Site

A sleek, minimal tech blog built with Next.js 14, MongoDB, and Tailwind CSS. Perfect for developers who write about system design, DSA, career growth, and more.

## Features

- 🎨 **Modern Design**: Clean, responsive design with dark/light mode
- 📝 **Rich Text Editor**: TipTap editor with markdown support
- 🔐 **Admin Panel**: Secure admin interface for content management
- 📱 **Mobile Responsive**: Optimized for all devices
- 🚀 **Fast Performance**: Built with Next.js 14 App Router
- 🔍 **SEO Optimized**: Meta tags, structured data, and more
- 📊 **Analytics Ready**: View counts and engagement metrics

## Tech Stack

- **Framework**: Next.js 14 with App Router (TypeScript)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: Basic Auth middleware
- **Editor**: TipTap rich text editor
- **Deployment**: Vercel-ready

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd blog-site
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db?retryWrites=true&w=majority
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password_here
NODE_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog!

## Admin Access

1. Go to `/admin` 
2. Enter your admin credentials (from .env.local)
3. Start creating and managing blog posts

## Project Structure

```
/blog-site/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── blog/[slug]/       # Individual blog posts
│   ├── categories/        # Category pages
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Reusable components
├── lib/                   # Utilities and database
├── models/                # MongoDB schemas
└── public/                # Static assets
```

## Categories

The blog supports 5 main categories:

- 🏗️ **System Design**: Scalable architecture and distributed systems
- 🧮 **DSA**: Data structures and algorithms
- 💼 **LinkedIn**: Professional networking and career growth
- 🎯 **Interviews**: Technical interview preparation
- 🚀 **Startup Hiring**: Startup culture and hiring insights

## Customization

### 1. Update Site Information

Edit the following files:
- `app/layout.tsx` - Site metadata
- `components/Header.tsx` - Navigation and branding
- `components/Footer.tsx` - Footer links and info
- `app/about/page.tsx` - About page content

### 2. Styling

The site uses Tailwind CSS with a custom color scheme defined in:
- `app/globals.css` - Global styles and CSS variables
- `tailwind.config.js` - Tailwind configuration

### 3. Add New Categories

1. Update `lib/utils.ts` - Add to categories object
2. Update `models/Blog.ts` - Add to enum
3. Restart the development server

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Add to `.env.local` as `MONGODB_URI`

### Local MongoDB

```bash
# Install MongoDB locally
# Update MONGODB_URI to: mongodb://localhost:27017/blog_db
```

## Security

- Admin routes protected by HTTP Basic Auth
- Input validation and sanitization
- CORS headers configured
- Environment variables for sensitive data

## Performance

- Server-side rendering with Next.js
- Image optimization with Next.js Image
- Efficient database queries with Mongoose
- Caching strategies for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own blog!

## Support

If you encounter any issues:

1. Check the [GitHub Issues](your-repo-url/issues)
2. Review the documentation
3. Create a new issue with details

---

**Happy blogging!** 🚀