// Simple file upload utility (can be extended with Cloudinary later)

// Utility to extract file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

// Utility to generate media placeholder
export function generateMediaPlaceholder(mediaId: string, type: string = 'image'): string {
  return `{{MEDIA:${type}_${mediaId}}}`;
}

// Utility to parse media placeholder
export function parseMediaPlaceholder(placeholder: string): { type: string; id: string } | null {
  const match = placeholder.match(/\{\{MEDIA:(\w+)_([^}]+)\}\}/);
  if (match) {
    return { type: match[1], id: match[2] };
  }
  return null;
}

// Simple local file upload (for development)
export async function uploadFile(file: File): Promise<{ url: string; mediaId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const data = await response.json();
  return {
    url: data.url,
    mediaId: data.mediaId || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}

// Validate file type
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => file.type.startsWith(type));
}

// Validate file size (in MB)
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}