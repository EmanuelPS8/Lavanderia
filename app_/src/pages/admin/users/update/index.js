import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuUsers from '@/components/MenuUsers';

const API_URL = 'http://127.0.0.1:3000/api';

export default function UpdateUser() {
  const router = useRouter();
  const { id } = router.query;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('operador');
  const [ativo, setAtivo] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin_user');
    if (!saved) {
      router.push('/login');
    } else {
      const u = JSON.parse(saved);
      if (u.perfil !== 'admin') {
        router.push('/admin');
      } else if (id) {
        fetchUser();
      }
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios/${id}`);
      const user = response.data;
      setNome(user.nome || '');
      setEmail(user.email || '');
      setPerfil(user.perfil || 'operador');
      setAtivo(user.ativo ?? true);
      setSenha(user.senha_hash || '');
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.put(`${API_URL}/usuarios/${id}`, {
        nome,
        email,
        senha_hash: senha,
        perfil,
        ativo
      });
      router.push('/admin/users');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erro ao atualizar dados do usuário.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-layout">
      <NavAdmin activeTab="usuarios" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Atualizar Cadastro de Usuário</h1>
        </header>

        <section className="admin-content">
          <MenuUsers />

          <div className="table-container" style={{ padding: '30px', maxWidth: '600px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>Carregando dados...</div>
            ) : (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <label className="input-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '20px' }}
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">E-mail de Login</label>
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '20px' }}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Senha (Altere se necessário)</label>
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '20px' }}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Perfil de Acesso</label>
                  <div className="select-wrapper">
                    <select
                      className="form-select"
                      value={perfil}
                      onChange={(e) => setPerfil(e.target.value)}
                      disabled={submitting}
                    >
                      <option value="operador">Operador (Atendimento)</option>
                      <option value="admin">Administrador (Total)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                    disabled={submitting}
                  />
                  <label className="input-label" style={{ padding: 0, cursor: 'pointer' }}>Usuário Ativo no Sistema</label>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                  <button
                    type="button"
                    className="btn-small secondary"
                    onClick={() => router.push('/admin/users')}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-small primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
