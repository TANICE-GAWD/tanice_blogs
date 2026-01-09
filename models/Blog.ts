import mongoose from 'mongoose';

// Sub-schema for media items
const MediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'code', 'gist', 'tweet', 'embed'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  alt: String,
  caption: String,
  width: Number,
  height: Number,
  position: {
    type: Number,
    required: true,
  },
  metadata: mongoose.Schema.Types.Mixed,
});

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  media: Array<{
    type: 'image' | 'video' | 'code' | 'gist' | 'tweet' | 'embed';
    url: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    position: number;
    metadata?: any;
  }>;
  rawContent?: string;
  excerpt?: string;
  category: 'system-design' | 'dsa' | 'linkedin' | 'interviews' | 'startup-hiring';
  tags: string[];
  coverImage?: string;
  published: boolean;
  publishedAt: Date;
  readTime: number;
  views: number;
  lastViewed?: Date;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Blog Schema with Media Support
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
  // Store content as HTML with media placeholders
  content: {
    type: String, // HTML content with {{MEDIA:id}} placeholders
    required: true,
  },
  // Store media separately with their positions
  media: [MediaSchema],
  
  // Store raw content for editing
  rawContent: String,
  
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
  },
  readTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  lastViewed: {
    type: Date,
  },
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);