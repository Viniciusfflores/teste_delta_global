import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useContext(AuthContext);

  const bgImage = '/delta_modal.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn({ email, password });
    } catch (err: any) {
      const message =
        err.response?.data?.messages?.error ||
        err.response?.data?.message ||
        'Erro ao autenticar. Verifique suas credenciais.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">

      {/* Background Side */}
      <div
        className="hidden md:block flex-1 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-10 max-md:p-6 bg-gray-100">
        <div className="w-full max-w-[420px] bg-white max-md:bg-transparent rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] max-md:shadow-none px-10 py-[50px] max-md:px-0 max-md:py-5">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-[1.6rem] text-gray-800 mb-1.5">Gestão de Alunos</h1>
            <p className="text-gray-500 text-[0.9rem]">Acesse o painel administrativo</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-800 p-2.5 rounded-md text-[0.85rem] mb-4 text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-1.5 text-gray-700 text-[0.9rem] font-medium">
                E-mail Corporativo
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ex: admin@deltaglobal.com"
                required
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-600/10 outline-none"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-1.5 text-gray-700 text-[0.9rem] font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha segura"
                required
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-600/10 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer mt-2.5 transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-wait"
            >
              {isSubmitting ? 'Verificando...' : 'Acessar Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};