export interface Link {
  id: number;
  name: string;
  url: string;
  categoryId?: number | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  linkCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LinkFilters {
  search?: string;
  categoryId?: number;
  favorite?: boolean;
  sort?: 'createdAt' | 'name' | 'favorite';
  order?: 'asc' | 'desc';
}

