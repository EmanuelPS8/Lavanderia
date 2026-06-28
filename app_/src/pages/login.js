import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { User, Lock, Eye, EyeOff, ArrowRight, Sparkles, Clock, Truck, ShieldCheck } from 'lucide-react';
import NavHome from '@/components/NavHome';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Se o usuário já estiver logado, redireciona direto para o painel admin
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      router.push('/admin');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:3000/api/usuarios/login', {
        email,
        senha
      });

      if (response.data && response.data.usuario) {
        localStorage.setItem('admin_user', JSON.stringify(response.data.usuario));
        router.push('/admin');
      } else {
        setError('Ocorreu um erro inesperado no login.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Não foi possível conectar ao servidor backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavHome />
      <div className="app-container">
        {/* Presentation Panel */}
        <div className="presentation-panel">
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--green-light)',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Sparkles size={12} />
              Lavanderia Lofi
            </span>
            <h1>Área do Colaborador</h1>
            <p style={{ marginTop: '10px' }}>
              Insira suas credenciais para gerenciar clientes, lançar pedidos de serviços e acompanhar entregas.
            </p>
          </div>

          <div className="features-list" style={{ marginTop: '30px' }}>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Clock size={16} />
              </div>
              <div className="feature-info">
                <h3>Agilidade no Processamento</h3>
                <p>Controle de entrada e saída automática com datas previstas para entrega.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Truck size={16} />
              </div>
              <div className="feature-info">
                <h3>Rastreabilidade Total</h3>
                <p>Acompanhe o status das roupas e pedidos de lavagem em tempo real.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={16} />
              </div>
              <div className="feature-info">
                <h3>Controle de Acesso</h3>
                <p>Perfis diferenciados para administradores e operadores do sistema.</p>
              </div>
            </div>
          </div>

          <div className="presentation-footer" style={{ marginTop: '40px' }}>
            © {new Date().getFullYear()} BOFEGATU. Todos os direitos reservados.
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Bem-vindo de volta!</h2>
            <p>Por favor, insira suas informações de login.</p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              color: '#f87171',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">E-mail Corporativo</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@bofegatu.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="actions-group" style={{ marginTop: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
