import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Student, CreateStudentDTO, UpdateStudentDTO } from '../@types/student';
import { studentService } from '../services/students';

interface StudentContextType {
  students: Student[];
  loading: boolean;
  loadStudents: () => Promise<void>;
  addStudent: (data: CreateStudentDTO) => Promise<void>;
  editStudent: (data: UpdateStudentDTO) => Promise<void>;
  removeStudent: (id: number) => Promise<void>;
}

const StudentContext = createContext<StudentContextType>({
  students: [],
  loading: false,
  loadStudents: async () => {},
  addStudent: async () => {},
  editStudent: async () => {},
  removeStudent: async () => {},
});

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStudents = useCallback(async () => {
    //console.log('Carregando alunos... [StudentService]');
    setLoading(true);
    try {
      const data = await studentService.getAll();
      //console.log('Alunos carregados:', data);
      setStudents(data || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setStudents([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  const addStudent = async (data: CreateStudentDTO) => {
    const newStudent = await studentService.create(data);
    setStudents(prev => [...prev, newStudent]);
  };

  const editStudent = async (data: UpdateStudentDTO) => {
    const updated = await studentService.update(data);
    setStudents(prev => prev.map(s => s.id === data.id ? updated : s));
  };

  const removeStudent = async (id: number) => {
    await studentService.delete(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return (
    <StudentContext.Provider value={{ students, loading, loadStudents, addStudent, editStudent, removeStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => useContext(StudentContext);