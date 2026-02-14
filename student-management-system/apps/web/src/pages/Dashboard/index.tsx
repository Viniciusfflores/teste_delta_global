import { useEffect, useState, useContext } from 'react';
import { useStudents } from '../../contexts/StudentContext';
import type { Student } from '../../@types/student';
import { Plus, Search, Edit2, Trash2, Users, Camera, X, LogOut } from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal/confirmModal';
import { AuthContext } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const avatarColors = [
  '#2563EB', '#0EA5E9', '#4F46E5', '#0891B2', '#7C3AED', '#334155'
];

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const getAvatarColor = (name: string) =>
  avatarColors[name.length % avatarColors.length];

export const Dashboard = () => {
  const { students, loading, loadStudents, addStudent, editStudent, removeStudent } = useStudents();
  const { signOut } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const handleOpenForm = (student?: Student) => {
    if (student) {
      setIsEditing(student);
      setName(student.name);
      setEmail(student.email);
      setPhone(student.phone || '');
      setAddress(student.address || '');
      setPhotoPreview(student.photo ? `${API_URL}/${student.photo}` : null);
    } else {
      setIsEditing(null);
      resetForm();
    }
    setPhoto(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setAddress('');
    setPhoto(null); setPhotoPreview(null);
  };

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await editStudent({ id: isEditing.id, name, email, phone, address, photo });
      } else {
        await addStudent({ name, email, phone, address, photo });
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
        try{
            setIsDeleting(true);
            await removeStudent(deleteId);
            setDeleteId(null);
        }catch(error){
            console.error('Erro ao excluir aluno:', error);
        }
        finally{
            setIsDeleting(false);
        }
    }
  };
 
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const recent = [...students].reverse().slice(0, 5);

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 transition-all duration-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-50 outline-none";

return (
    <div className="fixed inset-0 w-full h-screen bg-slate-100 font-['Inter',system-ui,sans-serif] text-slate-900 flex flex-col overflow-hidden">

      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 px-8 max-sm:px-4 h-16 flex items-center justify-between shadow-sm shrink-0 z-50">
        <span className="font-['DM_Sans',sans-serif] text-lg font-bold">Gerenciamento de alunos</span>
        <button  className="flex items-center gap-1 text-slate-600 hover:text-slate-800" onClick={() => signOut()}>
         <LogOut size={14} className="inline mr-1" /> Logout
        </button>
      </header>

      {/* Main Layout*/}
      <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden">

        {/* Left Panel*/}
        <div className="flex-1 flex flex-col h-full overflow-hidden p-8 max-sm:p-4">

          {/* Page Header */}
          <div className="flex justify-between items-end mb-6 shrink-0">
            <div>
              <h1 className="font-['DM_Sans',sans-serif] text-[28px] max-sm:text-[22px] font-bold tracking-tight m-0">
                Alunos
              </h1>
              <p className="mt-1 text-slate-600 text-sm">
                {filtered.length} {filtered.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
              </p>
            </div>
            <button
              className="bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(37,99,235,0.2)] hover:bg-blue-700 hover:-translate-y-px border-none"
              onClick={() => handleOpenForm()}
            >
              <Plus size={18} /> Novo Aluno
            </button>
          </div>

          {/* Search */}
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 mb-6 flex items-center gap-3 shadow-sm focus-within:border-blue-600 focus-within:ring-3 focus-within:ring-blue-50 shrink-0">
            <Search size={18} className="text-slate-400" />
            <input
              className="border-none outline-none flex-1 text-sm text-slate-900 bg-transparent"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="bg-slate-50 border-none rounded-full w-5 h-5 cursor-pointer flex items-center justify-center text-slate-600"
                onClick={() => setSearchTerm('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            {loading ? (
              <div className="py-16 px-6 text-center flex flex-col items-center">
                <div className="spinner mb-4" />
                <p className="text-slate-400">Carregando alunos...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 px-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Users size={32} />
                </div>
                <p className="text-slate-400">
                  {searchTerm ? 'Nenhum aluno encontrado para a busca.' : 'Nenhum aluno cadastrado ainda.'}
                </p>
                {!searchTerm && <p className="text-slate-400 text-sm mt-1">Clique em "Novo Aluno" para começar.</p>}
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-[60px_2fr_2fr_1.5fr_1.5fr_100px] max-lg:grid-cols-[50px_1.5fr_1.5fr_1fr_80px] px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <span />
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Nome</span>
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Email</span>
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider max-sm:hidden">Telefone</span>
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider max-lg:hidden">Endereço</span>
                  <span />
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto flex-1 p-0">
                  {filtered.map(student => (
                    <div
                      key={student.id}
                      className="grid grid-cols-[60px_2fr_2fr_1.5fr_1.5fr_100px] max-lg:grid-cols-[50px_1.5fr_1.5fr_1fr_80px] max-sm:grid-cols-[44px_1fr_1fr_80px] px-6 max-sm:px-4 py-4 max-sm:py-3 items-center border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        {student.photo ? (
                          <img src={`${API_URL}/${student.photo}`} alt={student.name} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                        ) : (
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: getAvatarColor(student.name) }}>
                            {getInitials(student.name)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold truncate pr-2">{student.name}</span>
                      <span className="text-[13px] text-slate-600 truncate pr-2">{student.email}</span>
                      <span className={`text-[13px] max-sm:hidden truncate pr-2 ${student.phone ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                        {student.phone || '—'}
                      </span>
                      <span className={`text-[13px] max-lg:hidden truncate pr-2 ${student.address ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                        {student.address || '—'}
                      </span>
                      <div className="flex justify-end gap-1.5 min-w-[80px]">
                        <button className="w-[50px] h-[34px] border border-slate-200 rounded-md flex items-center justify-center transition-all duration-200 hover:bg-blue-50 hover:border-blue-600" onClick={() => handleOpenForm(student)} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="w-[50px] h-[34px] border border-slate-200 rounded-md flex items-center justify-center transition-all duration-200 hover:bg-red-50 hover:border-red-500" onClick={() => setDeleteId(student.id)} title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex w-[320px] bg-white border-l border-slate-200 py-8 px-6 h-full overflow-y-auto flex-col gap-6 shrink-0">
          <h2 className="font-['DM_Sans',sans-serif] text-[15px] font-bold m-0">Resumo</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-blue-600">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Total de alunos</p>
            <p className="font-['DM_Sans',sans-serif] text-[32px] font-bold m-0 leading-none">{students.length}</p>
          </div>

          {recent.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Adicionados recentemente</p>
              {recent.map(s => (
                <div key={s.id} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
                  {s.photo ? (
                    <img src={`${API_URL}/${s.photo}`} alt={s.name} className="w-7 h-7 rounded-full object-cover border border-slate-100" />
                  ) : (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold" style={{ backgroundColor: getAvatarColor(s.name) }}>
                      {getInitials(s.name)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="text-[13px] font-semibold truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{s.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>

      {/* Modais (continuam iguais) */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex justify-center items-center" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-[480px] max-sm:w-[92%] rounded-xl shadow-lg overflow-hidden border border-slate-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <h2 className="font-['DM_Sans',sans-serif] text-xl font-bold m-0">
                {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
              </h2>
              <button className="border-none bg-transparent cursor-pointer text-slate-400 p-1 transition-colors hover:text-red-500" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <label className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden bg-slate-50 text-slate-400 transition-all duration-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoChange(e.target.files ? e.target.files[0] : null)} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Nome *</label>
                <input type="text" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Email *</label>
                <input type="email" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Telefone</label>
                <input type="tel" placeholder="(00) 00000-0000" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Endereço</label>
                <input type="text" placeholder="Rua, número, cidade" value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <button type="button" className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="button" className="bg-blue-600 text-white border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(37,99,235,0.2)] hover:bg-blue-700 hover:-translate-y-px" onClick={handleSubmit}>
                  {isEditing ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <ConfirmModal
          message="Deseja realmente excluir este aluno?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default Dashboard;