import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Search } from 'lucide-react';
import NavAdmin from '@/components/NavAdmin';
import MenuUsers from '@/components/MenuUsers';
import UserAction from '@/components/UserAction';

const API_URL = 'http://127.0.0.1:3000/api';

export default function UsersList() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add('admin-page');

    const saved = localStorage.getItem('admin_user');

    if (!saved) {
      router.push('/login');
    } else {
      const u = JSON.parse(saved);

      if (u.perfil !== 'admin') {
        router.push('/admin');
      } else {
        fetchUsers();
      }
    }

    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsers(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();

    return (
      (u._id || '').toLowerCase().includes(term) ||
      (u.nome || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.perfil || '').toLowerCase().includes(term) ||
      (u.ativo ? 'ativo' : 'inativo').includes(term) ||
      (u.created_at
      ? (
          new Date(u.created_at).toLocaleDateString('pt-BR').includes(searchTerm) ||
          String(u.created_at).includes(searchTerm)
        ): false) ||
      (u.updated_at
        ? new Date(u.updated_at).toLocaleDateString('pt-BR').includes(searchTerm)
        : false)
    );
  });

  return (
    <div className="admin-layout">
      <NavAdmin activeTab="usuarios" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Gerenciamento de Usuários</h1>
        </header>

        <section className="admin-content">
          <MenuUsers />

          <div className="table-container">
            <div className="table-header-actions">
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Pesquisar por ID, nome, e-mail ou data..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="crud-table-wrapper">
              {loading ? (
                <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Carregando...</div>
              ) : (
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Perfil</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((usuario) => (
                      <tr key={usuario._id}>
                        <td>{usuario.nome}</td>
                        <td>{usuario.email}</td>
                        <td>
                          <span className="badge badge-info">{usuario.perfil}</span>
                        </td>
                        <td>
                          <span className={`badge ${usuario.ativo ? 'badge-success' : 'badge-danger'}`}>
                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <UserAction userId={usuario._id} />
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          Nenhum usuário cadastrado ou correspondente à busca.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
