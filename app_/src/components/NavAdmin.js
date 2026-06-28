import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Shirt,
  ShoppingBag,
  UsersRound,
  LogOut
} from 'lucide-react';

export default function NavAdmin({ activeTab }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('admin_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    } else {
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.push('/login');
  };

  const getClassName = (tabName, routePrefix = null) => {
    if (routePrefix && router.pathname.startsWith(routePrefix)) {
      return 'admin-menu-item active';
    }
    return activeTab === tabName ? 'admin-menu-item active' : 'admin-menu-item';
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <div className="admin-logo">
            <div className="brand-icon">
              <Shirt size={18} />
            </div>
            <span className="brand-name">BOFEGATU<span> Admin</span></span>
          </div>
        </Link>

        <nav className="admin-menu">
          <Link href="/admin?tab=dashboard" style={{ textDecoration: 'none' }}>
            <button className={getClassName('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
          </Link>

          <Link href="/admin?tab=clientes" style={{ textDecoration: 'none' }}>
            <button className={getClassName('clientes')}>
              <Users size={18} />
              Clientes
            </button>
          </Link>

          <Link href="/admin?tab=servicos" style={{ textDecoration: 'none' }}>
            <button className={getClassName('servicos')}>
              <Briefcase size={18} />
              Serviços
            </button>
          </Link>

          <Link href="/admin?tab=tiposRoupa" style={{ textDecoration: 'none' }}>
            <button className={getClassName('tiposRoupa')}>
              <Shirt size={18} />
              Tipos de Roupa
            </button>
          </Link>

          <Link href="/admin?tab=pedidos" style={{ textDecoration: 'none' }}>
            <button className={getClassName('pedidos')}>
              <ShoppingBag size={18} />
              Pedidos
            </button>
          </Link>

          {currentUser && currentUser.perfil === 'admin' && (
            <Link href="/admin/users" style={{ textDecoration: 'none' }}>
              <button className={getClassName('usuarios', '/admin/users')}>
                <UsersRound size={18} />
                Usuários
              </button>
            </Link>
          )}
        </nav>
      </div>

      {currentUser && (
        <div className="admin-user-info">
          <div className="admin-user-name">{currentUser.nome}</div>
          <div className="admin-user-role">{currentUser.perfil}</div>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              padding: '6px 0',
              width: 'fit-content'
            }}
          >
            <LogOut size={16} />
            Sair do Sistema
          </button>
        </div>
      )}
    </aside>
  );
}
