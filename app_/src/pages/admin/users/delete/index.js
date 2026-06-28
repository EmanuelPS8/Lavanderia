import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuUsers from '@/components/MenuUsers';

const API_URL = 'http://127.0.0.1:3000/api';

export default function DeleteUser() {
  const router = useRouter();
  const { id } = router.query;
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`);
      router.push('/admin/users');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erro ao excluir usuário.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-layout">
      <NavAdmin activeTab="usuarios" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Excluir Usuário</h1>
        </header>

        <section className="admin-content">
          <MenuUsers />

          <div className="table-container" style={{ padding: '30px', maxWidth: '600px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>Carregando dados...</div>
            ) : usuario ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  padding: '16px',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: '12px',
                  color: '#f87171',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Atenção: Esta ação é permanente e removerá todas as credenciais de acesso deste usuário.
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nome Completo</span>
                    <span className="detail-val">{usuario.nome}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">E-mail</span>
                    <span className="detail-val">{usuario.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Perfil de Acesso</span>
                    <span className="detail-val" style={{ textTransform: 'capitalize' }}>{usuario.perfil}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <button
                    className="btn-small primary"
                    style={{ background: '#ef4444' }}
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </button>
                  <button
                    className="btn-small secondary"
                    onClick={() => router.push('/admin/users')}
                    disabled={deleting}
                  >
                    Cancelar
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
