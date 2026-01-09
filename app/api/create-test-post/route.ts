import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function POST() {
  try {
    await dbConnect();
    
    // Create a test blog post
    const testPost = new Blog({
      title: 'Welcome to My Tech Blog',
      slug: 'welcome-to-my-tech-blog',
      content: `
        <h2>Welcome to My Tech Blog!</h2>
        <p>This is a test blog post to demonstrate the functionality of our blog system.</p>
        
        <h3>What You'll Find Here</h3>
        <ul>
          <li>System Design tutorials and insights</li>
          <li>Data Structures and Algorithms explanations</li>
          <li>Career growth and LinkedIn tips</li>
          <li>Interview preparation strategies</li>
          <li>Startup hiring insights</li>
        </ul>
        
        <h3>Code Example</h3>
        <pre><code>function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}</code></pre>
        
        <p>Stay tuned for more content!</p>
      `,
      excerpt: 'Welcome to my tech blog! Here you\'ll find insights on system design, DSA, career growth, and more.',
      category: 'system-design',
      tags: ['welcome', 'introduction', 'tech-blog'],
      published: true,
      readTime: 3,
      seoTitle: 'Welcome to My Tech Blog - System Design & Career Growth',
      seoDescription: 'Welcome to my tech blog featuring system design, data structures, algorithms, and career growth tips.',
    });

    await testPost.save();

    return NextResponse.json({
      success: true,
      message: 'Test post created successfully',
      post: {
        id: testPost._id.toString(),
        title: testPost.title,
        slug: testPost.slug,
        published: testPost.published,
      },
    });
  } catch (error) {
    console.error('Error creating test post:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}