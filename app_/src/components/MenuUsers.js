import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UsersRound, Plus } from 'lucide-react';

export default function MenuUsers() {
  const router = useRouter();

  const getButtonClass = (path) => {
    return router.pathname === path
      ? 'btn-small primary'
      : 'btn-small secondary';
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      alignItems: 'center'
    }}>
      <Link href="/admin/users" style={{ textDecoration: 'none' }}>
        <button className={getButtonClass('/admin/users')}>
          <UsersRound size={16} />
          Listar Usuários
        </button>
      </Link>
      <Link href="/admin/users/create" style={{ textDecoration: 'none' }}>
        <button className={getButtonClass('/admin/users/create')}>
          <Plus size={16} />
          Cadastrar Usuário
        </button>
      </Link>
    </div>
  );
}
