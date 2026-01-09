import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({
        success: true,
        images: [],
      });
    }

    const files = await readdir(uploadDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    const images = await Promise.all(
      files
        .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
        .map(async (file) => {
          const filePath = path.join(uploadDir, file);
          const stats = await stat(filePath);
          
          return {
            filename: file,
            url: `/uploads/${file}`,
            size: stats.size,
            uploadedAt: stats.birthtime,
          };
        })
    );

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({
      success: true,
      images,
    });

  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}