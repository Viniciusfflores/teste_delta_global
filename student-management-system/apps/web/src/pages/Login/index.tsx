import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './index.css';

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
        <div className="login-page">

            {/* Lado Esquerdo - Imagem de fundo */}
            <div
                className="login-bg-side"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Lado Direito - Formulário */}
            <div className="login-form-side">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Gestão de Alunos</h1>
                        <p>Acesse o painel administrativo</p>
                    </div>

                    {error && (
                        <div className="error-banner">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">E-mail Corporativo</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ex: admin@deltaglobal.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha segura"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verificando...' : 'Acessar Sistema'}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};