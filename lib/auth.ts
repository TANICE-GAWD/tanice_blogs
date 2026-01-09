// Simple client-side auth helper
export function getAuthCredentials(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check if credentials are stored in sessionStorage
  const stored = sessionStorage.getItem('admin_credentials');
  if (stored) return stored;
  
  // Prompt for credentials
  const username = prompt('Enter admin username:');
  const password = prompt('Enter admin password:');
  
  if (!username || !password) return null;
  
  const credentials = btoa(`${username}:${password}`);
  sessionStorage.setItem('admin_credentials', credentials);
  
  return credentials;
}

export function clearAuthCredentials(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin_credentials');
  }
}