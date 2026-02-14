import api from './api';
import type { Student, CreateStudentDTO, UpdateStudentDTO, ApiResponse } from '../@types/student.ts';

export const studentService = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get<ApiResponse<Student[]>>('/students');
    return response.data.data;
  },

  getById: async (id: number): Promise<Student> => {
    const response = await api.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStudentDTO): Promise<Student> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.photo) formData.append('photo', data.photo);

    const response = await api.post<ApiResponse<Student>>('/students', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  update: async (data: UpdateStudentDTO): Promise<Student> => {
    const formData = new FormData();

    formData.append('name', data.name || '');
    formData.append('email', data.email || '');
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.photo) formData.append('photo', data.photo);
    formData.append('_method', 'PATCH');

    const response = await api.post<ApiResponse<Student>>(`/students/${data.id}`, formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  }
};