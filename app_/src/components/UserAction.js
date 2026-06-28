import React from 'react';
import Link from 'next/link';
import { Info, Edit2, Trash2 } from 'lucide-react';

export default function UserAction({ userId }) {
  return (
    <div className="actions-cell" style={{ display: 'flex', gap: '8px' }}>
      <Link href={`/admin/users/read?id=${userId}`} style={{ textDecoration: 'none' }} title="Ver Detalhes">
        <button className="btn-icon">
          <Info size={14} />
        </button>
      </Link>
      <Link href={`/admin/users/update?id=${userId}`} style={{ textDecoration: 'none' }} title="Editar">
        <button className="btn-icon edit">
          <Edit2 size={14} />
        </button>
      </Link>
      <Link href={`/admin/users/delete?id=${userId}`} style={{ textDecoration: 'none' }} title="Excluir">
        <button className="btn-icon delete">
          <Trash2 size={14} />
        </button>
      </Link>
    </div>
  );
}
