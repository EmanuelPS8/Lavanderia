import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, Truck, ShieldCheck } from 'lucide-react';
import NavHome from '@/components/NavHome';

export default function Home() {
  return (
    <>
      <NavHome />
      <div className="app-container" style={{ minHeight: '500px' }}>
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
            <h1>Sistema de Controle de Lavanderia</h1>
            <p style={{ marginTop: '10px' }}>
              Gerencie seus pedidos, clientes, roupas e serviços em um único painel intuitivo e moderno com a equipe BOFEGATU.
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

        {/* Action Panel */}
        <div className="form-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>Área de Trabalho</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', maxWidth: '340px' }}>
            Faça login com sua conta administrativa ou de operador para gerenciar o sistema de lavanderia.
          </p>
          <Link href="/login" style={{ textDecoration: 'none', width: '100%', maxWidth: '300px' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Acessar Painel
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
