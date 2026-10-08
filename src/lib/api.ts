import { compressImage } from './imageCompressor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  token?: string;
  user?: any;
  stats?: any;
  error?: string;
  [key: string]: any;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kpn_admin_token');
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: any) {
    console.warn(`[API Error: ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),

  // File Upload Helper (with auto client-side image compression for large photos)
  upload: async (file: File, folder = 'kpn_promoters'): Promise<{ url: string; publicId?: string }> => {
    const url = `${API_BASE_URL}/upload`;
    const token = getAuthToken();

    // Automatically optimize large camera images (>1.5MB) down to clean web resolution
    const fileToUpload = await compressImage(file);

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('folder', folder);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'File upload failed');
    }

    return data;
  },

  // Multiple Files Upload Helper
  uploadMultiple: async (
    files: File[],
    folder = 'kpn_promoters'
  ): Promise<Array<{ url: string; publicId?: string }>> => {
    if (!files || files.length === 0) return [];
    const url = `${API_BASE_URL}/upload/multiple`;
    const token = getAuthToken();

    // Compress all large images in parallel
    const compressedFiles = await Promise.all(files.map((f) => compressImage(f)));

    const formData = new FormData();
    compressedFiles.forEach((file) => formData.append('files', file));
    formData.append('folder', folder);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Batch file upload failed');
    }

    return data.files || [];
  },
};
