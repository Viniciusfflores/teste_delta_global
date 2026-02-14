export interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: File | null;
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {
  id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  total?: number;
  errors?: Record<string, string>;
}