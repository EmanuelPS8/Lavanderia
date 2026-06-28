import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Clock,
  Truck,
  ShieldCheck,
  Mail,
  Plus,
  Trash2,
  Edit2,
  Info,
  LogOut,
  Users,
  Briefcase,
  Shirt,
  ShoppingBag,
  UsersRound,
  LayoutDashboard,
  Search,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:3000/api';

export default function App() {
  // Autenticação
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Navegação
  const [activeTab, setActiveTab] = useState('dashboard');

  // Listagens de Entidades
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [tiposRoupa, setTiposRoupa] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidoItens, setPedidoItens] = useState([]);
  const [pedidoItemServicos, setPedidoItemServicos] = useState([]);

  // Estados dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeEntity, setActiveEntity] = useState(null); // 'clientes' | 'servicos' | 'tiposRoupa' | 'usuarios' | 'pedidos'
  const [editId, setEditId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  // Estados dos Formulários de Cadastro
  const [clientForm, setClientForm] = useState({ nome: '', email: '', telefone: '', cpf_cnpj: '', observacoes: '' });
  const [serviceForm, setServiceForm] = useState({ nome: '', descricao: '', preco: '', ativo: true });
  const [tipoRoupaForm, setTipoRoupaForm] = useState({ nome: '', descricao: '' });
  const [userForm, setUserForm] = useState({ nome: '', email: '', senha_hash: '', perfil: 'operador', ativo: true });
  const [pedidoForm, setPedidoForm] = useState({ cliente_id: '', status: 'pendente', data_prevista: '', valor_total: '0', observacoes: '' });

  // Estados dos Sub-itens do Pedido
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemForm, setEditItemForm] = useState({ tipo_roupa_id: '', quantidade: 1, descricao: '', status: 'pendente', valor_total: 0 });
  const [newItemForm, setNewItemForm] = useState({ tipo_roupa_id: '', quantidade: 1, descricao: '', status: 'pendente', valor_total: 0 });
  const [newServiceForm, setNewServiceForm] = useState({});

  // Pesquisas / Filtros
  const [searchTerm, setSearchTerm] = useState('');

  // Efeitos de Carregamento de Dados
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (tiposRoupa.length > 0 && !newItemForm.tipo_roupa_id) {
      setNewItemForm(prev => ({ ...prev, tipo_roupa_id: tiposRoupa[0]._id }));
    }
  }, [tiposRoupa]);

  const loadAllData = () => {
    fetchData('clientes', setClientes);
    fetchData('servicos', setServicos);
    fetchData('tipos-roupa', setTiposRoupa);
    fetchData('usuarios', setUsuarios);
    fetchData('pedidos', setPedidos);
    fetchData('pedidos-itens', setPedidoItens);
    fetchData('pedido-item-servicos', setPedidoItemServicos);
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await axios.get(`${API_URL}/${endpoint}`);
      setter(res.data);
    } catch (err) {
      console.error(`Erro ao carregar ${endpoint}:`, err);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/usuarios/login`, { email: loginEmail, senha: loginPassword });
      setSuccess('Login efetuado com sucesso!');
      localStorage.setItem('admin_user', JSON.stringify(res.data.usuario));
      setTimeout(() => {
        setUser(res.data.usuario);
        setLoading(false);
        setActiveTab('dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'E-mail ou senha incorretos.');
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    setActiveTab('dashboard');
    setSuccess('');
    setError('');
    setLoginEmail('');
    setLoginPassword('');
  };

  // Abertura de Formulário de Cadastro (Novo)
  const openNewForm = (entity) => {
    setActiveEntity(entity);
    setEditId(null);
    setIsFormModalOpen(true);

    // Resetar formulário correspondente
    if (entity === 'clientes') setClientForm({ nome: '', email: '', telefone: '', cpf_cnpj: '', observacoes: '' });
    if (entity === 'servicos') setServiceForm({ nome: '', descricao: '', preco: '', ativo: true });
    if (entity === 'tiposRoupa') setTipoRoupaForm({ nome: '', descricao: '' });
    if (entity === 'usuarios') setUserForm({ nome: '', email: '', senha_hash: '', perfil: 'operador', ativo: true });
    if (entity === 'pedidos') setPedidoForm({ cliente_id: clientes[0]?._id || '', status: 'pendente', data_prevista: '', valor_total: '0', observacoes: '' });
  };

  // Abertura de Formulário de Edição
  const openEditForm = (entity, item) => {
    setActiveEntity(entity);
    setEditId(item._id);
    setIsFormModalOpen(true);

    if (entity === 'clientes') {
      setClientForm({
        nome: item.nome || '',
        email: item.email || '',
        telefone: item.telefone || '',
        cpf_cnpj: item.cpf_cnpj || '',
        observacoes: item.observacoes || '',
      });
    }
    if (entity === 'servicos') {
      setServiceForm({
        nome: item.nome || '',
        descricao: item.descricao || '',
        preco: item.preco || '',
        ativo: item.ativo ?? true,
      });
    }
    if (entity === 'tiposRoupa') {
      setTipoRoupaForm({
        nome: item.nome || '',
        descricao: item.descricao || '',
      });
    }
    if (entity === 'usuarios') {
      setUserForm({
        nome: item.nome || '',
        email: item.email || '',
        senha_hash: item.senha_hash || '',
        perfil: item.perfil || 'operador',
        ativo: item.ativo ?? true,
      });
    }
    if (entity === 'pedidos') {
      setPedidoForm({
        cliente_id: item.cliente_id?._id || item.cliente_id || '',
        status: item.status || 'pendente',
        data_prevista: item.data_prevista ? item.data_prevista.split('T')[0] : '',
        valor_total: item.valor_total || '0',
        observacoes: item.observacoes || '',
      });
    }
  };

  // Detalhes da Entidade
  const openDetail = (entity, item) => {
    setActiveEntity(entity);
    setDetailData(item);
    setIsDetailModalOpen(true);
  };

  // Exclusão de Registro (Delete)
  const handleDelete = async (entity, id) => {
    if (!window.confirm('Tem certeza que deseja apagar este registro?')) return;

    let endpoint = '';
    if (entity === 'clientes') endpoint = 'clientes';
    if (entity === 'servicos') endpoint = 'servicos';
    if (entity === 'tiposRoupa') endpoint = 'tipos-roupa';
    if (entity === 'usuarios') endpoint = 'usuarios';
    if (entity === 'pedidos') endpoint = 'pedidos';

    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao apagar o registro.');
    }
  };

  // Gravação de Dados (Create e Update)
  const handleSave = async (e) => {
    e.preventDefault();
    let endpoint = '';
    let bodyData = {};

    if (activeEntity === 'clientes') {
      endpoint = 'clientes';
      bodyData = clientForm;
    } else if (activeEntity === 'servicos') {
      endpoint = 'servicos';
      bodyData = { ...serviceForm, preco: Number(serviceForm.preco) };
    } else if (activeEntity === 'tiposRoupa') {
      endpoint = 'tipos-roupa';
      bodyData = tipoRoupaForm;
    } else if (activeEntity === 'usuarios') {
      endpoint = 'usuarios';
      bodyData = userForm;
    } else if (activeEntity === 'pedidos') {
      endpoint = 'pedidos';
      bodyData = {
        ...pedidoForm,
        usuario_id: user.id, // O usuário logado é o autor do pedido
        valor_total: Number(pedidoForm.valor_total),
      };
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${endpoint}/${editId}`, bodyData);
      } else {
        await axios.post(`${API_URL}/${endpoint}`, bodyData);
      }
      setIsFormModalOpen(false);
      setEditId(null);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao salvar o registro.');
    }
  };

  // Handlers para Itens de Pedido
  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItemForm.tipo_roupa_id) {
      alert('Selecione um tipo de roupa');
      return;
    }
    try {
      await axios.post(`${API_URL}/pedidos-itens`, {
        pedido_id: detailData._id,
        tipo_roupa_id: newItemForm.tipo_roupa_id,
        quantidade: Number(newItemForm.quantidade || 1),
        descricao: newItemForm.descricao,
        status: newItemForm.status,
        valor_total: Number(newItemForm.valor_total || 0)
      });
      setNewItemForm({
        tipo_roupa_id: tiposRoupa[0]?._id || '',
        quantidade: 1,
        descricao: '',
        status: 'pendente',
        valor_total: 0
      });
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao criar item do pedido.');
    }
  };

  const handleEditItem = (item) => {
    setEditingItemId(item._id);
    setEditItemForm({
      tipo_roupa_id: item.tipo_roupa_id?._id || item.tipo_roupa_id || '',
      quantidade: item.quantidade || 1,
      descricao: item.descricao || '',
      status: item.status || 'pendente',
      valor_total: item.valor_total || 0
    });
  };

  const handleUpdateItem = async (itemId) => {
    try {
      await axios.put(`${API_URL}/pedidos-itens/${itemId}`, {
        pedido_id: detailData._id,
        tipo_roupa_id: editItemForm.tipo_roupa_id,
        quantidade: Number(editItemForm.quantidade || 1),
        descricao: editItemForm.descricao,
        status: editItemForm.status,
        valor_total: Number(editItemForm.valor_total || 0)
      });
      setEditingItemId(null);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao atualizar item do pedido.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Tem certeza que deseja apagar este item?')) return;
    try {
      await axios.delete(`${API_URL}/pedidos-itens/${itemId}`);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao apagar item do pedido.');
    }
  };

  // Handlers para Serviços do Item do Pedido
  const handleAddService = async (itemId) => {
    const form = newServiceForm[itemId];
    let servicoId = form?.servico_id;
    let quant = Number(form?.quantidade || 1);

    if (!servicoId) {
      if (servicos.length > 0) {
        servicoId = servicos[0]._id;
      } else {
        alert('Selecione um serviço');
        return;
      }
    }

    const selectedService = servicos.find(s => s._id === servicoId);
    if (!selectedService) return;

    try {
      await axios.post(`${API_URL}/pedido-item-servicos`, {
        pedido_item_id: itemId,
        servico_id: servicoId,
        preco_unitario: selectedService.preco,
        quantidade: quant
      });
      setNewServiceForm({
        ...newServiceForm,
        [itemId]: { servico_id: servicos[0]?._id || '', quantidade: 1 }
      });
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao adicionar serviço ao item.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Tem certeza que deseja apagar este serviço?')) return;
    try {
      await axios.delete(`${API_URL}/pedido-item-servicos/${serviceId}`);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao apagar serviço do item.');
    }
  };

  // LOGIN PAGE VIEW
  if (!user) {
    return (
      <div className="app-container">
        {/* Painel Esquerdo - Apresentação da Lavanderia */}
        <div className="presentation-panel">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>
            <div className="brand-name">BOFEGATU Lavanderias</div>
          </div>

          <div className="presentation-content">
            <h1>Sua lavanderia inteligente e sem complicações.</h1>
            <p>Cuidamos das suas roupas com tecnologia de ponta, processos ecológicos e a praticidade que você precisa no seu dia a dia.</p>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <Clock size={16} />
                </div>
                <div className="feature-info">
                  <h3>Agendamento Inteligente</h3>
                  <p>Escolha o melhor dia e horário para coleta ou entrega.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <Truck size={16} />
                </div>
                <div className="feature-info">
                  <h3>Leva & Traz Express</h3>
                  <p>Suas roupas coletadas e entregues limpas na sua porta.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <ShieldCheck size={16} />
                </div>
                <div className="feature-info">
                  <h3>Proteção de Tecidos</h3>
                  <p>Processos adequados para fios delicados e cores vivas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="presentation-footer">&copy; 2026 BOFEGATU. Tecnologia e Cuidado para suas roupas.</div>
        </div>

        {/* Painel Direito - Formulário de Login */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Acessar Painel</h2>
            <p>Bem-vindo de volta! Insira suas credenciais para entrar.</p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">
                E-mail
              </label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="exemplo@email.com"
                  className="form-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Senha
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Senha"
                  className="form-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="actions-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span>Autenticando...</span>
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN LAYOUT VIEW
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo">
            <Sparkles size={24} style={{ color: 'var(--green-light)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>BOFEGATU</h2>
          </div>

          <nav className="admin-menu">
            <button
              className={`admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('dashboard');
                setSearchTerm('');
              }}
            >
              <LayoutDashboard size={18} />
              Painel Geral
            </button>
            <button
              className={`admin-menu-item ${activeTab === 'clientes' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('clientes');
                setSearchTerm('');
              }}
            >
              <Users size={18} />
              Clientes
            </button>
            <button
              className={`admin-menu-item ${activeTab === 'servicos' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('servicos');
                setSearchTerm('');
              }}
            >
              <Briefcase size={18} />
              Serviços
            </button>
            <button
              className={`admin-menu-item ${activeTab === 'tiposRoupa' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tiposRoupa');
                setSearchTerm('');
              }}
            >
              <Shirt size={18} />
              Tipos de Roupa
            </button>
            <button
              className={`admin-menu-item ${activeTab === 'pedidos' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('pedidos');
                setSearchTerm('');
              }}
            >
              <ShoppingBag size={18} />
              Pedidos
            </button>
            <button
              className={`admin-menu-item ${activeTab === 'usuarios' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('usuarios');
                setSearchTerm('');
              }}
            >
              <UsersRound size={18} />
              Usuários
            </button>
          </nav>
        </div>

        <div>
          <div className="admin-user-info" style={{ marginBottom: '15px' }}>
            <span className="admin-user-name">{user.nome}</span>
            <span className="admin-user-role">{user.perfil}</span>
          </div>

          <button className="admin-menu-item" onClick={handleLogout} style={{ color: '#f87171' }}>
            <LogOut size={18} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>
              {activeTab === 'dashboard' && 'Painel de Controle'}
              {activeTab === 'clientes' && 'Gestão de Clientes'}
              {activeTab === 'servicos' && 'Gestão de Serviços'}
              {activeTab === 'tiposRoupa' && 'Tipos de Roupas'}
              {activeTab === 'pedidos' && 'Pedidos de Lavanderia'}
              {activeTab === 'usuarios' && 'Gestão de Usuários'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
              {activeTab === 'dashboard' && 'Visão geral do sistema BOFEGATU.'}
              {activeTab === 'clientes' && 'Cadastro, edição e remoção de clientes cadastrados.'}
              {activeTab === 'servicos' && 'Tipos de lavagens, secagens e serviços adicionais.'}
              {activeTab === 'tiposRoupa' && 'Roupas aceitas no sistema e suas descrições.'}
              {activeTab === 'pedidos' && 'Gerenciamento de tickets de lavanderia.'}
              {activeTab === 'usuarios' && 'Controle de funcionários com acesso ao sistema.'}
            </p>
          </div>

          {activeTab !== 'dashboard' && (
            <button className="btn-small primary" onClick={() => openNewForm(activeTab)}>
              <Plus size={16} />
              Novo Registro
            </button>
          )}
        </header>

        {/* CONTROLLING ACTIVE TABS */}
        <div className="admin-content">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <Users size={22} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Clientes</h3>
                    <p>{clientes.length}</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <ShoppingBag size={22} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Pedidos Totais</h3>
                    <p>{pedidos.length}</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <Briefcase size={22} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Serviços Ativos</h3>
                    <p>{servicos.filter((s) => s.ativo).length}</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <UsersRound size={22} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Usuários</h3>
                    <p>{usuarios.length}</p>
                  </div>
                </div>
              </div>

              <div className="table-container" style={{ marginTop: '20px' }}>
                <div className="table-header-actions">
                  <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Pedidos Recentes</h3>
                </div>
                <div className="crud-table-wrapper">
                  <table className="crud-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Valor Total</th>
                        <th>Entrada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.slice(0, 5).map((pedido, idx) => (
                        <tr key={pedido._id || idx}>
                          <td>{(pedido._id || '').slice(-6).toUpperCase()}</td>
                          <td>{pedido.cliente_id?.nome || 'Desconhecido'}</td>
                          <td>
                            <span
                              className={`badge ${pedido.status === 'finalizado' || pedido.status === 'entregue'
                                  ? 'badge-success'
                                  : pedido.status === 'em andamento'
                                    ? 'badge-info'
                                    : 'badge-warning'
                                }`}
                            >
                              {pedido.status}
                            </span>
                          </td>
                          <td>R$ {(pedido.valor_total || 0).toFixed(2)}</td>
                          <td>{pedido.data_entrada ? new Date(pedido.data_entrada).toLocaleDateString('pt-BR') : '-'}</td>
                        </tr>
                      ))}
                      {pedidos.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            Nenhum pedido registrado no sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTES TAB */}
          {activeTab === 'clientes' && (
            <div className="table-container">
              <div className="table-header-actions">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquisar por nome..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Telefone</th>
                      <th>CPF/CNPJ</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes
                      .filter((c) => c.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((cliente, index) => (
                        <tr key={cliente._id || index}>
                          <td>{cliente.nome}</td>
                          <td>{cliente.email || 'Não informado'}</td>
                          <td>{cliente.telefone || 'Não informado'}</td>
                          <td>{cliente.cpf_cnpj || 'Não informado'}</td>
                          <td className="actions-cell">
                            <button className="btn-icon" onClick={() => openDetail('clientes', cliente)} title="Ver Detalhes">
                              <Info size={14} />
                            </button>
                            <button className="btn-icon edit" onClick={() => openEditForm('clientes', cliente)} title="Editar">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete('clientes', cliente._id)} title="Excluir">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {clientes.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          Nenhum cliente cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SERVICOS TAB */}
          {activeTab === 'servicos' && (
            <div className="table-container">
              <div className="table-header-actions">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquisar por serviço..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Preço</th>
                      <th>Descrição</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos
                      .filter((s) => s.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((servico, index) => (
                        <tr key={servico._id || index}>
                          <td>{servico.nome}</td>
                          <td>R$ {(servico.preco || 0).toFixed(2)}</td>
                          <td>{servico.descricao || 'Sem descrição'}</td>
                          <td>
                            <span className={`badge ${servico.ativo ? 'badge-success' : 'badge-danger'}`}>{servico.ativo ? 'Ativo' : 'Inativo'}</span>
                          </td>
                          <td className="actions-cell">
                            <button className="btn-icon edit" onClick={() => openEditForm('servicos', servico)} title="Editar">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete('servicos', servico._id)} title="Excluir">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {servicos.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          Nenhum serviço cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TIPOS DE ROUPA TAB */}
          {activeTab === 'tiposRoupa' && (
            <div className="table-container">
              <div className="table-header-actions">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquisar tipo de roupa..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiposRoupa
                      .filter((t) => t.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((tipo, index) => (
                        <tr key={tipo._id || index}>
                          <td>{tipo.nome}</td>
                          <td>{tipo.descricao || 'Sem descrição'}</td>
                          <td className="actions-cell">
                            <button className="btn-icon edit" onClick={() => openEditForm('tiposRoupa', tipo)} title="Editar">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete('tiposRoupa', tipo._id)} title="Excluir">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {tiposRoupa.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          Nenhum tipo de roupa cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PEDIDOS TAB */}
          {activeTab === 'pedidos' && (
            <div className="table-container">
              <div className="table-header-actions">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquisar cliente do pedido..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Pedido ID</th>
                      <th>Cliente</th>
                      <th>Valor Total</th>
                      <th>Status</th>
                      <th>Entrada</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos
                      .filter((p) => p.cliente_id?.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((pedido, index) => (
                        <tr key={pedido._id || index}>
                          <td>{(pedido._id || '').slice(-6).toUpperCase()}</td>
                          <td>{pedido.cliente_id?.nome || 'Desconhecido'}</td>
                          <td>R$ {(pedido.valor_total || 0).toFixed(2)}</td>
                          <td>
                            <span
                              className={`badge ${pedido.status === 'finalizado' || pedido.status === 'entregue'
                                  ? 'badge-success'
                                  : pedido.status === 'em andamento'
                                    ? 'badge-info'
                                    : 'badge-warning'
                                }`}
                            >
                              {pedido.status}
                            </span>
                          </td>
                          <td>{pedido.data_entrada ? new Date(pedido.data_entrada).toLocaleDateString('pt-BR') : '-'}</td>
                          <td className="actions-cell">
                            <button className="btn-icon" onClick={() => openDetail('pedidos', pedido)} title="Ver Detalhes">
                              <Info size={14} />
                            </button>
                            <button className="btn-icon edit" onClick={() => openEditForm('pedidos', pedido)} title="Editar">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete('pedidos', pedido._id)} title="Excluir">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {pedidos.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          Nenhum pedido cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USUARIOS TAB */}
          {activeTab === 'usuarios' && (
            <div className="table-container">
              <div className="table-header-actions">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquisar por funcionário..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="crud-table-wrapper">
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
                    {usuarios
                      .filter((u) => u.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((usr, index) => (
                        <tr key={usr._id || index}>
                          <td>{usr.nome}</td>
                          <td>{usr.email}</td>
                          <td style={{ textTransform: 'capitalize' }}>{usr.perfil}</td>
                          <td>
                            <span className={`badge ${usr.ativo ? 'badge-success' : 'badge-danger'}`}>{usr.ativo ? 'Ativo' : 'Inativo'}</span>
                          </td>
                          <td className="actions-cell">
                            <button className="btn-icon edit" onClick={() => openEditForm('usuarios', usr)} title="Editar">
                              <Edit2 size={14} />
                            </button>
                            {usr.email !== 'admin@bofegatu.com' && (
                              <button className="btn-icon delete" onClick={() => handleDelete('usuarios', usr._id)} title="Excluir">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    {usuarios.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          Nenhum usuário cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FORM DIALOG MODAL (CREATE AND UPDATE) */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <header className="modal-header">
              <h3>
                {editId ? 'Alterar Registro' : 'Novo Registro'} -{' '}
                {activeEntity === 'clientes'
                  ? 'Cliente'
                  : activeEntity === 'servicos'
                    ? 'Serviço'
                    : activeEntity === 'tiposRoupa'
                      ? 'Tipo de Roupa'
                      : activeEntity === 'usuarios'
                        ? 'Usuário'
                        : 'Pedido'}
              </h3>
              <button className="modal-close" onClick={() => setIsFormModalOpen(false)}>
                ✕
              </button>
            </header>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* CLIENTE FORM FIELDS */}
                  {activeEntity === 'clientes' && (
                    <>
                      <div className="input-group">
                        <label className="input-label">Nome Completo</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={clientForm.nome}
                          onChange={(e) => setClientForm({ ...clientForm, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">E-mail</label>
                        <input
                          type="email"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={clientForm.email}
                          onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Telefone</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={clientForm.telefone}
                          onChange={(e) => setClientForm({ ...clientForm, telefone: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">CPF / CNPJ</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={clientForm.cpf_cnpj}
                          onChange={(e) => setClientForm({ ...clientForm, cpf_cnpj: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Observações</label>
                        <textarea
                          className="form-textarea"
                          value={clientForm.observacoes}
                          onChange={(e) => setClientForm({ ...clientForm, observacoes: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {/* SERVICO FORM FIELDS */}
                  {activeEntity === 'servicos' && (
                    <>
                      <div className="input-group">
                        <label className="input-label">Nome do Serviço</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={serviceForm.nome}
                          onChange={(e) => setServiceForm({ ...serviceForm, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Descrição</label>
                        <textarea
                          className="form-textarea"
                          value={serviceForm.descricao}
                          onChange={(e) => setServiceForm({ ...serviceForm, descricao: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Preço (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={serviceForm.preco}
                          onChange={(e) => setServiceForm({ ...serviceForm, preco: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', paddingLeft: '4px' }}>
                        <input
                          type="checkbox"
                          id="servico_ativo"
                          checked={serviceForm.ativo}
                          onChange={(e) => setServiceForm({ ...serviceForm, ativo: e.target.checked })}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <label htmlFor="servico_ativo" style={{ cursor: 'pointer', fontSize: '13px' }}>
                          Serviço Ativo
                        </label>
                      </div>
                    </>
                  )}

                  {/* TIPO ROUPA FORM FIELDS */}
                  {activeEntity === 'tiposRoupa' && (
                    <>
                      <div className="input-group">
                        <label className="input-label">Nome do Tipo</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={tipoRoupaForm.nome}
                          onChange={(e) => setTipoRoupaForm({ ...tipoRoupaForm, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Descrição</label>
                        <textarea
                          className="form-textarea"
                          value={tipoRoupaForm.descricao}
                          onChange={(e) => setTipoRoupaForm({ ...tipoRoupaForm, descricao: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {/* USUARIO FORM FIELDS */}
                  {activeEntity === 'usuarios' && (
                    <>
                      <div className="input-group">
                        <label className="input-label">Nome Completo</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={userForm.nome}
                          onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">E-mail</label>
                        <input
                          type="email"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Senha</label>
                        <input
                          type="password"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={userForm.senha_hash}
                          onChange={(e) => setUserForm({ ...userForm, senha_hash: e.target.value })}
                          required={!editId}
                          placeholder={editId ? 'Preencha apenas se quiser alterar' : ''}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Perfil de Acesso</label>
                        <div className="select-wrapper">
                          <select className="form-select" value={userForm.perfil} onChange={(e) => setUserForm({ ...userForm, perfil: e.target.value })}>
                            <option value="admin">Administrador</option>
                            <option value="operador">Operador</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', paddingLeft: '4px' }}>
                        <input
                          type="checkbox"
                          id="usuario_ativo"
                          checked={userForm.ativo}
                          onChange={(e) => setUserForm({ ...userForm, ativo: e.target.checked })}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <label htmlFor="usuario_ativo" style={{ cursor: 'pointer', fontSize: '13px' }}>
                          Usuário Ativo
                        </label>
                      </div>
                    </>
                  )}

                  {/* PEDIDO FORM FIELDS */}
                  {activeEntity === 'pedidos' && (
                    <>
                      <div className="input-group">
                        <label className="input-label">Cliente</label>
                        <div className="select-wrapper">
                          <select
                            className="form-select"
                            value={pedidoForm.cliente_id}
                            onChange={(e) => setPedidoForm({ ...pedidoForm, cliente_id: e.target.value })}
                            required
                          >
                            {clientes.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.nome}
                              </option>
                            ))}
                            {clientes.length === 0 && <option value="">Cadastre um cliente primeiro</option>}
                          </select>
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-label">Status do Pedido</label>
                        <div className="select-wrapper">
                          <select className="form-select" value={pedidoForm.status} onChange={(e) => setPedidoForm({ ...pedidoForm, status: e.target.value })}>
                            <option value="pendente">Pendente</option>
                            <option value="em andamento">Em Andamento</option>
                            <option value="pronto">Pronto</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="entregue">Entregue</option>
                          </select>
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-label">Data Prevista</label>
                        <input
                          type="date"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={pedidoForm.data_prevista}
                          onChange={(e) => setPedidoForm({ ...pedidoForm, data_prevista: e.target.value })}
                        />
                      </div>

                      <div className="input-group">
                        <label className="input-label">Valor Total (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-input"
                          style={{ paddingLeft: '20px' }}
                          value={pedidoForm.valor_total}
                          onChange={(e) => setPedidoForm({ ...pedidoForm, valor_total: e.target.value })}
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label className="input-label">Observações</label>
                        <textarea
                          className="form-textarea"
                          value={pedidoForm.observacoes}
                          onChange={(e) => setPedidoForm({ ...pedidoForm, observacoes: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn-small secondary" onClick={() => setIsFormModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-small primary">
                  Salvar Registro
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL DIALOG (READ DETAILS) */}
      {isDetailModalOpen && detailData && (
        <div className="modal-overlay">
          <div className="modal-container">
            <header className="modal-header">
              <h3>Detalhes do Registro</h3>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                ✕
              </button>
            </header>

            <div className="modal-body">
              <div className="detail-grid">
                {/* CLIENT DETAILS */}
                {activeEntity === 'clientes' && (
                  <>
                    <div className="detail-item">
                      <span className="detail-label">Nome Completo</span>
                      <span className="detail-val">{detailData.nome}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">E-mail</span>
                      <span className="detail-val">{detailData.email || 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Telefone</span>
                      <span className="detail-val">{detailData.telefone || 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">CPF / CNPJ</span>
                      <span className="detail-val">{detailData.cpf_cnpj || 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Observações</span>
                      <span className="detail-val" style={{ whiteSpace: 'pre-wrap' }}>
                        {detailData.observacoes || 'Sem observações.'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Criado em</span>
                      <span className="detail-val">{new Date(detailData.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                  </>
                )}

                {/* PEDIDO DETAILS */}
                {activeEntity === 'pedidos' && (
                  <>
                    <div className="detail-item">
                      <span className="detail-label">Pedido ID</span>
                      <span className="detail-val">{(detailData._id || '').toUpperCase()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cliente</span>
                      <span className="detail-val">{detailData.cliente_id?.nome || 'Desconhecido'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cadastrado por</span>
                      <span className="detail-val">{detailData.usuario_id?.nome || 'Desconhecido'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span
                        className={`badge ${detailData.status === 'finalizado' || detailData.status === 'entregue'
                            ? 'badge-success'
                            : detailData.status === 'em andamento'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                      >
                        {detailData.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Valor Total</span>
                      <span className="detail-val">R$ {(detailData.valor_total || 0).toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Data de Entrada</span>
                      <span className="detail-val">{new Date(detailData.data_entrada).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Data Prevista</span>
                      <span className="detail-val">
                        {detailData.data_prevista ? new Date(detailData.data_prevista).toLocaleDateString('pt-BR') : 'Não agendada'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Observações</span>
                      <span className="detail-val" style={{ whiteSpace: 'pre-wrap' }}>
                        {detailData.observacoes || 'Sem observações.'}
                      </span>
                    </div>

                    {/* SEÇÃO DE ITENS DO PEDIDO E SEUS SERVIÇOS */}
                    <div style={{ gridColumn: 'span 2', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '15px', color: 'var(--green-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shirt size={18} /> Itens do Pedido
                      </h4>

                      {/* Lista de itens existentes */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {pedidoItens
                          .filter(item => (item.pedido_id?._id || item.pedido_id) === detailData._id)
                          .map((item, idx) => {
                            const isEditing = editingItemId === item._id;
                            const itemServices = pedidoItemServicos.filter(s => (s.pedido_item_id?._id || s.pedido_item_id) === item._id);

                            return (
                              <div key={item._id || idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                {isEditing ? (
                                  /* Edição do Item */
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                      <div className="input-group" style={{ margin: 0 }}>
                                        <label className="input-label" style={{ fontSize: '11px' }}>Tipo de Roupa</label>
                                        <select
                                          className="form-select"
                                          style={{ height: '36px', padding: '6px' }}
                                          value={editItemForm.tipo_roupa_id}
                                          onChange={(e) => setEditItemForm({ ...editItemForm, tipo_roupa_id: e.target.value })}
                                        >
                                          {tiposRoupa.map(tr => (
                                            <option key={tr._id} value={tr._id}>{tr.nome}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="input-group" style={{ margin: 0 }}>
                                        <label className="input-label" style={{ fontSize: '11px' }}>Quantidade</label>
                                        <input
                                          type="number"
                                          className="form-input"
                                          style={{ height: '36px', padding: '6px 12px' }}
                                          value={editItemForm.quantidade}
                                          onChange={(e) => setEditItemForm({ ...editItemForm, quantidade: e.target.value })}
                                        />
                                      </div>
                                    </div>

                                    <div className="input-group" style={{ margin: 0 }}>
                                      <label className="input-label" style={{ fontSize: '11px' }}>Descrição</label>
                                      <input
                                        type="text"
                                        className="form-input"
                                        style={{ height: '36px', padding: '6px 12px' }}
                                        value={editItemForm.descricao}
                                        onChange={(e) => setEditItemForm({ ...editItemForm, descricao: e.target.value })}
                                      />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                      <div className="input-group" style={{ margin: 0 }}>
                                        <label className="input-label" style={{ fontSize: '11px' }}>Status</label>
                                        <select
                                          className="form-select"
                                          style={{ height: '36px', padding: '6px' }}
                                          value={editItemForm.status}
                                          onChange={(e) => setEditItemForm({ ...editItemForm, status: e.target.value })}
                                        >
                                          <option value="pendente">Pendente</option>
                                          <option value="em andamento">Em Andamento</option>
                                          <option value="pronto">Pronto</option>
                                          <option value="finalizado">Finalizado</option>
                                          <option value="entregue">Entregue</option>
                                        </select>
                                      </div>
                                      <div className="input-group" style={{ margin: 0 }}>
                                        <label className="input-label" style={{ fontSize: '11px' }}>Valor Total (R$)</label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          className="form-input"
                                          style={{ height: '36px', padding: '6px 12px' }}
                                          value={editItemForm.valor_total}
                                          onChange={(e) => setEditItemForm({ ...editItemForm, valor_total: e.target.value })}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                                      <button type="button" className="btn-small primary" style={{ padding: '6px 12px' }} onClick={() => handleUpdateItem(item._id)}>Salvar</button>
                                      <button type="button" className="btn-small secondary" style={{ padding: '6px 12px' }} onClick={() => setEditingItemId(null)}>Cancelar</button>
                                    </div>
                                  </div>
                                ) : (
                                  /* Visualização do Item */
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>
                                        {item.tipo_roupa_id?.nome || 'Roupa desconhecida'} (x{item.quantidade})
                                      </span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className={`badge ${item.status === 'finalizado' || item.status === 'entregue'
                                            ? 'badge-success'
                                            : item.status === 'em andamento'
                                              ? 'badge-info'
                                              : 'badge-warning'
                                          }`}>
                                          {item.status}
                                        </span>
                                        <span style={{ fontWeight: '600', color: 'var(--green-light)', marginLeft: '8px' }}>
                                          R$ {(item.valor_total || 0).toFixed(2)}
                                        </span>
                                      </div>
                                    </div>

                                    {item.descricao && (
                                      <p style={{ margin: '6px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {item.descricao}
                                      </p>
                                    )}

                                    {/* Subseção de Serviços do Item */}
                                    <div style={{ marginTop: '12px', paddingLeft: '15px', borderLeft: '2px solid rgba(255,255,255,0.08)' }}>
                                      <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                                        Serviços do Item
                                      </span>

                                      {/* Lista de Serviços */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                                        {itemServices.map((s, idxS) => (
                                          <div key={s._id || idxS} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                            <span>
                                              {s.servico_id?.nome || 'Serviço'} (x{s.quantidade}) - R$ {(s.preco_unitario || 0).toFixed(2)}/un
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                              <span style={{ fontWeight: '600', color: '#fff' }}>R$ {(s.valor_total || 0).toFixed(2)}</span>
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteService(s._id)}
                                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', padding: 0 }}
                                                title="Remover serviço"
                                              >
                                                <Trash2 size={12} />
                                              </button>
                                            </div>
                                          </div>
                                        ))}

                                        {itemServices.length === 0 && (
                                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '4px' }}>
                                            Nenhum serviço associado a este item.
                                          </span>
                                        )}
                                      </div>

                                      {/* Form para Adicionar Serviço */}
                                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'flex-end' }}>
                                        <div className="input-group" style={{ margin: 0, flex: 1 }}>
                                          <select
                                            className="form-select"
                                            style={{ fontSize: '12px', padding: '4px 8px', height: '30px' }}
                                            value={newServiceForm[item._id]?.servico_id || ''}
                                            onChange={(e) => setNewServiceForm({
                                              ...newServiceForm,
                                              [item._id]: { ...(newServiceForm[item._id] || { quantidade: 1 }), servico_id: e.target.value }
                                            })}
                                          >
                                            <option value="">Selecione um serviço...</option>
                                            {servicos.map(s => (
                                              <option key={s._id} value={s._id}>{s.nome} (R$ {(s.preco || 0).toFixed(2)})</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="input-group" style={{ margin: 0, width: '60px' }}>
                                          <input
                                            type="number"
                                            className="form-input"
                                            style={{ fontSize: '12px', padding: '4px 8px', height: '30px', textAlign: 'center' }}
                                            min="1"
                                            value={newServiceForm[item._id]?.quantidade || 1}
                                            onChange={(e) => setNewServiceForm({
                                              ...newServiceForm,
                                              [item._id]: { ...(newServiceForm[item._id] || { servico_id: '' }), quantidade: Number(e.target.value) }
                                            })}
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          className="btn-small primary"
                                          style={{ fontSize: '11px', padding: '6px 12px', height: '30px' }}
                                          onClick={() => handleAddService(item._id)}
                                        >
                                          Adicionar
                                        </button>
                                      </div>
                                    </div>

                                    {/* Ações do Item (Editar/Excluir) */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleEditItem(item)}
                                        style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                      >
                                        <Edit2 size={12} /> Editar Item
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteItem(item._id)}
                                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                      >
                                        <Trash2 size={12} /> Excluir Item
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                        {pedidoItens.filter(item => (item.pedido_id?._id || item.pedido_id) === detailData._id).length === 0 && (
                          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.05)', fontSize: '12px' }}>
                            Nenhum item cadastrado para este pedido.
                          </div>
                        )}
                      </div>

                      {/* Formulário para Adicionar Novo Item */}
                      <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <h5 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Adicionar Item ao Pedido</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div className="input-group" style={{ margin: 0 }}>
                            <label className="input-label" style={{ fontSize: '11px' }}>Tipo de Roupa</label>
                            <select
                              className="form-select"
                              style={{ height: '36px', padding: '6px' }}
                              value={newItemForm.tipo_roupa_id}
                              onChange={(e) => setNewItemForm({ ...newItemForm, tipo_roupa_id: e.target.value })}
                            >
                              <option value="">Selecione...</option>
                              {tiposRoupa.map(tr => (
                                <option key={tr._id} value={tr._id}>{tr.nome}</option>
                              ))}
                            </select>
                          </div>
                          <div className="input-group" style={{ margin: 0 }}>
                            <label className="input-label" style={{ fontSize: '11px' }}>Quantidade</label>
                            <input
                              type="number"
                              className="form-input"
                              min="1"
                              style={{ height: '36px', padding: '6px 12px' }}
                              value={newItemForm.quantidade}
                              onChange={(e) => setNewItemForm({ ...newItemForm, quantidade: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '10px', marginBottom: 0 }}>
                          <label className="input-label" style={{ fontSize: '11px' }}>Descrição / Observações do Item</label>
                          <input
                            type="text"
                            className="form-input"
                            style={{ height: '36px', padding: '6px 12px' }}
                            placeholder="Ex: Sem manchas, lavar com cuidado"
                            value={newItemForm.descricao}
                            onChange={(e) => setNewItemForm({ ...newItemForm, descricao: e.target.value })}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                          <div className="input-group" style={{ margin: 0 }}>
                            <label className="input-label" style={{ fontSize: '11px' }}>Status</label>
                            <select
                              className="form-select"
                              style={{ height: '36px', padding: '6px' }}
                              value={newItemForm.status}
                              onChange={(e) => setNewItemForm({ ...newItemForm, status: e.target.value })}
                            >
                              <option value="pendente">Pendente</option>
                              <option value="em andamento">Em Andamento</option>
                              <option value="pronto">Pronto</option>
                              <option value="finalizado">Finalizado</option>
                              <option value="entregue">Entregue</option>
                            </select>
                          </div>
                          <div className="input-group" style={{ margin: 0 }}>
                            <label className="input-label" style={{ fontSize: '11px' }}>Valor do Item (R$)</label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-input"
                              style={{ height: '36px', padding: '6px 12px' }}
                              value={newItemForm.valor_total}
                              onChange={(e) => setNewItemForm({ ...newItemForm, valor_total: e.target.value })}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-small primary"
                          style={{ marginTop: '15px', width: '100%', height: '36px' }}
                          onClick={handleCreateItem}
                        >
                          Salvar Item no Pedido
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <footer className="modal-footer">
              <button className="btn-small secondary" onClick={() => setIsDetailModalOpen(false)}>
                Fechar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
