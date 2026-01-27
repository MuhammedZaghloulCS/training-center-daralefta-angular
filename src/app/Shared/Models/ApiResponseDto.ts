export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
