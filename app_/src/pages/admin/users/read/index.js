import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuUsers from '@/components/MenuUsers';

const API_URL = 'http://127.0.0.1:3000/api';

export default function ReadUser() {
  const router = useRouter();
  const { id } = router.query;
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setUsuario(response.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar detalhes do usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <NavAdmin activeTab="usuarios" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Detalhes do Usuário</h1>
        </header>

        <section className="admin-content">
          <MenuUsers />

          <div className="table-container" style={{ padding: '30px', maxWidth: '600px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>Carregando...</div>
            ) : usuario ? (
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">ID de Registro</span>
                  <span className="detail-val">{usuario._id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nome Completo</span>
                  <span className="detail-val">{usuario.nome}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">E-mail de Acesso</span>
                  <span className="detail-val">{usuario.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Perfil de Permissões</span>
                  <span className="detail-val" style={{ textTransform: 'capitalize' }}>{usuario.perfil}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Situação Cadastral</span>
                  <span className="detail-val">
                    <span className={`badge ${usuario.ativo ? 'badge-success' : 'badge-danger'}`}>
                      {usuario.ativo ? 'Ativo no Sistema' : 'Inativo no Sistema'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Cadastrado Em</span>
                  <span className="detail-val">{new Date(usuario.created_at).toLocaleString('pt-BR')}</span>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    className="btn-small primary"
                    onClick={() => router.push(`/admin/users/update?id=${usuario._id}`)}
                  >
                    Editar Cadastro
                  </button>
                  <button
                    className="btn-small secondary"
                    style={{ marginLeft: '12px' }}
                    onClick={() => router.push('/admin/users')}
                  >
                    Voltar
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Usuário não encontrado.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
