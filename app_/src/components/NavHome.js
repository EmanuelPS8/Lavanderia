import React from 'react';
import Link from 'next/link';
import { Shirt } from 'lucide-react';

export default function NavHome() {
  return (
    <header style={{
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      padding: '24px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div className="brand" style={{ margin: 0 }}>
          <div className="brand-icon">
            <Shirt size={20} />
          </div>
          <span className="brand-name">BOFEGATU<span> Laundry</span></span>
        </div>
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/login" style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--green-light)',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '9999px',
          border: '1px solid var(--green-border)',
          transition: 'var(--transition-smooth)'
        }} className="btn-secondary">
          Login Admin
        </Link>
      </div>
    </header>
  );
}
