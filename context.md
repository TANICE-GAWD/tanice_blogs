# Context: Tech Blog Site Development

## **Project Overview**
Build a sleek, minimal tech blog site for a developer who writes about:
1. System Design
2. DSA (Data Structures & Algorithms)
3. LinkedIn Networking
4. Interview Preparation
5. Startup Hiring

## **Technology Stack**
- **Framework**: Next.js 14 with App Router (TypeScript)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: Simple password protection via middleware
- **Editor**: TipTap (rich text editor)
- **Deployment**: Vercel

## **File Structure**
```
/blog-site/
├── .env.local
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js
├── middleware.ts
├── lib/
│   ├── db.ts
│   └── utils.ts
├── models/
│   └── Blog.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── categories/
│   │   └── [category]/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── blogs/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   └── components/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── BlogCard.tsx
│       ├── CategoryCard.tsx
│       └── Admin/
│           ├── BlogEditor.tsx
│           └── Sidebar.tsx
└── public/
    └── (images, favicon, etc.)
```

## **Environment Variables (.env.local)**
Create `.env.local` file with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db?retryWrites=true&w=majority
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password_here
NODE_ENV=production
```

## **Database Schema (models/Blog.ts)**
```typescript
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  excerpt: {
    type: String,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
    enum: ['system-design', 'dsa', 'linkedin', 'interviews', 'startup-hiring'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  coverImage: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
```

## **Database Connection (lib/db.ts)**
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

## **Authentication Middleware (middleware.ts)**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the route is under /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for basic auth headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access"',
        },
      });
    }

    // Decode credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Verify credentials
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username !== validUsername || password !== validPassword) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

## **Design Specifications**

### **Color Palette**
```css
Light Mode:
- Background: #ffffff
- Surface: #f8fafc
- Primary: #3b82f6 (blue-600)
- Secondary: #64748b (slate-500)
- Text Primary: #0f172a (slate-900)
- Text Secondary: #475569 (slate-600)
- Border: #e2e8f0

Dark Mode:
- Background: #0f172a (slate-900)
- Surface: #1e293b (slate-800)
- Primary: #60a5fa (blue-400)
- Secondary: #94a3b8 (slate-400)
- Text Primary: #f1f5f9 (slate-100)
- Text Secondary: #cbd5e1 (slate-300)
- Border: #334155
```

### **Typography**
- Font Family: Inter (from Google Fonts)
- Base Size: 16px
- Scale: 0.875rem (sm), 1rem (base), 1.125rem (lg), 1.25rem (xl), 1.5rem (2xl), 1.875rem (3xl), 2.25rem (4xl)
- Line Height: 1.5 (body), 1.2 (headings)

### **Layout Principles**
- Max width: 80rem (1280px)
- Content width: 65ch (blog posts)
- Use CSS Grid/Flexbox for layouts
- Mobile-first responsive design
- Consistent spacing: 4px base unit (0.25rem in Tailwind)

## **Component Specifications**

### **1. Homepage (app/page.tsx)**
```typescript
// Structure:
// 1. Hero Section: Brief introduction (2-3 sentences)
// 2. Featured Posts: Grid of 3 latest posts from different categories
// 3. Category Grid: 5 category cards with icons and counts
// 4. Recent Posts: List of 6 most recent posts with minimal design

// Introduction text example:
"Hi, I'm [Your Name]. I write about system design, data structures, career growth, and startup hiring. Practical insights from my experience in tech."
```

### **2. Category Cards**
Create 5 cards with:
- Distinctive icon (emoji or simple SVG)
- Category name
- Post count
- Subtle color coding
- Hover effect: slight scale transform

### **3. Blog Card Component**
```typescript
Props: {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: Date;
  readTime: number;
  slug: string;
  coverImage?: string;
}

// Design: Clean card with category badge, title, excerpt, and metadata
```

### **4. Blog Post Page (app/blog/[slug]/page.tsx)**
```typescript
// Layout:
// - Breadcrumb navigation
// - Title and metadata
// - Table of contents (auto-generated from h2/h3)
// - Content with proper typography
// - Code syntax highlighting
// - Share buttons
// - Related posts section
```

### **5. Category Pages (app/categories/[category]/page.tsx)**
```typescript
// Show all posts in that category
// Filter by tags
// Sort by date or popularity
```

### **6. Admin Dashboard (/admin/dashboard)**
```typescript
// Simple dashboard showing:
// - Total posts count
// - Drafts count
// - Recent posts (with edit/delete buttons)
// - "Create New Post" button
```

### **7. Blog Editor (/admin/create & /admin/edit/[id])**
```typescript
// Features:
// - Title input
// - Slug auto-generation from title
// - Category select dropdown
// - Tags input (comma separated)
// - Rich text editor (TipTap)
// - Live preview toggle
// - SEO fields (optional)
// - Publish/Save as draft buttons
```

## **API Routes Specifications**

### **1. GET /api/blogs**
```typescript
// Query parameters:
// - category: filter by category
// - tag: filter by tag
// - page: pagination
// - limit: items per page (default: 10)
// - sort: 'newest', 'oldest', 'popular'

// Returns: { blogs: Blog[], total: number, page: number }
```

### **2. GET /api/blogs/[slug]**
```typescript
// Returns single blog post
// Increments view count
```

### **3. POST /api/blogs**
```typescript
// Admin only - create new blog
// Requires authentication
// Body: Blog data
```

### **4. PUT /api/blogs/[id]**
```typescript
// Admin only - update blog
// Requires authentication
```

### **5. DELETE /api/blogs/[id]**
```typescript
// Admin only - delete blog
// Requires authentication
```

### **6. POST /api/upload**
```typescript
// Image upload endpoint
// Returns URL of uploaded image
```

## **Required Packages**
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "mongoose": "^7.5.0",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "@tiptap/extension-code-block-lowlight": "^2.1.0",
    "lowlight": "^3.0.0",
    "date-fns": "^3.0.0",
    "react-hot-toast": "^2.4.1",
    "gray-matter": "^4.0.3",
    "remark": "^14.0.0",
    "remark-html": "^15.0.0",
    "prismjs": "^1.29.0",
    "lucide-react": "^0.284.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0",
    "@types/mongoose": "^5.11.97"
  }
}
```

## **Tailwind Configuration**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

## **Next.js Configuration**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  experimental: {
    serverActions: true,
  },
}
```

## **Implementation Instructions for LLM**

### **Step-by-Step Development Order**
1. **Setup Project**
   - Initialize Next.js with TypeScript and Tailwind
   - Install all required packages
   - Set up environment variables
   - Configure Tailwind and Next.js

2. **Database Setup**
   - Create MongoDB connection
   - Define Blog schema
   - Create utility functions for DB operations

3. **Layout & Components**
   - Create main layout with Header/Footer
   - Implement dark/light mode toggle
   - Create reusable components (BlogCard, CategoryCard)

4. **Public Pages**
   - Homepage with introduction
   - Blog listing page
   - Individual blog post page
   - Category pages

5. **Admin System**
   - Create middleware for authentication
   - Build admin dashboard
   - Create blog editor with TipTap
   - Implement CRUD operations

6. **API Routes**
   - Create blog API endpoints
   - Implement image upload
   - Add search functionality

7. **Styling & Polish**
   - Apply color scheme
   - Ensure responsive design
   - Add loading states
   - Implement error handling

### **Important Notes for LLM**
- Use TypeScript strictly with proper types
- Implement proper error handling in all API routes
- Make all components server components where possible
- Use Suspense for loading states
- Implement proper SEO with metadata
- Add proper aria-labels for accessibility
- Use Next.js Image component for all images
- Implement proper cache headers for performance

### **Testing Instructions**
Before deployment, test:
1. Database connection
2. Admin authentication (username/password)
3. Blog creation/editing/deletion
4. Image upload
5. Responsive design on mobile/tablet/desktop
6. Dark/light mode toggle
7. All navigation links

### **Deployment Instructions**
1. Push to GitHub repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - MONGODB_URI
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
4. Deploy production build

## **Security Considerations**
1. Never expose admin routes in navigation
2. Use HTTPS in production
3. Sanitize HTML content from editor
4. Validate all form inputs
5. Implement rate limiting on API routes
6. Use proper CORS headers

## **Success Criteria**
The blog site should:
1. Load quickly (< 2s first load)
2. Have clean, readable typography
3. Work perfectly on mobile devices
4. Allow easy blog management via admin
5. Display content in organized categories
6. Be visually consistent across all pages

---

**Note to LLM**: Generate complete, working code for each file mentioned above. Ensure all imports are correct and all dependencies are properly installed. The code should be production-ready with proper error handling and TypeScript types.