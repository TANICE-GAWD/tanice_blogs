import mongoose from 'mongoose';

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
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
  lastViewed: {
    type: Date,
  },
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);