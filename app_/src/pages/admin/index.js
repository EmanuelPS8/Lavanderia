import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Users,
  Briefcase,
  Shirt,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  Info,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  X
} from 'lucide-react';
import NavAdmin from '@/components/NavAdmin';

const API_URL = 'http://127.0.0.1:3000/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { tab } = router.query;
  const activeTab = tab || 'dashboard';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lists
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [tiposRoupa, setTiposRoupa] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoItens, setPedidoItens] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeEntity, setActiveEntity] = useState(null); // 'clientes' | 'servicos' | 'tiposRoupa' | 'pedidos'
  const [editId, setEditId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  // Forms state
  const [clientForm, setClientForm] = useState({ nome: '', email: '', telefone: '', cpf_cnpj: '', observacoes: '' });
  const [clientErrors, setClientErrors] = useState({});
  const [serviceForm, setServiceForm] = useState({ nome: '', descricao: '', preco: '', ativo: true });
  const [tipoRoupaForm, setTipoRoupaForm] = useState({ nome: '', descricao: '' });
  const [pedidoForm, setPedidoForm] = useState({ cliente_id: '', status: 'pendente', data_prevista: '', valor_total: '0', observacoes: '' });

  // Order Item sub-form states
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemForm, setEditItemForm] = useState({ tipo_roupa_id: '', quantidade: 1, descricao: '', status: 'pendente', valor_total: 0 });
  const [newItemForm, setNewItemForm] = useState({ tipo_roupa_id: '', quantidade: 1, descricao: '', status: 'pendente', valor_total: 0 });
  const [newServiceForm, setNewServiceForm] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (!savedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
      loadAllData();
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setSearchTerm('');
    }
  }, [tab]);

  useEffect(() => {
    if (tiposRoupa.length > 0 && !newItemForm.tipo_roupa_id) {
      setNewItemForm((prev) => ({ ...prev, tipo_roupa_id: tiposRoupa[0]._id }));
    }
  }, [tiposRoupa]);

  const loadAllData = () => {
    fetchData('clientes', setClientes);
    fetchData('servicos', setServicos);
    fetchData('tipos-roupa', setTiposRoupa);
    fetchData('usuarios', setUsuarios);
    fetchData('pedidos', setPedidos);
    fetchData('pedidos-itens', setPedidoItens);
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await axios.get(`${API_URL}/${endpoint}`);
      setter(res.data);
    } catch (err) {
      console.error(`Erro ao carregar ${endpoint}:`, err);
    }
  };

  const formatCurrency = (value) => {
    const digits = value.replace(/\D/g, '');
    const number = Number(digits || 0) / 100;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const parseCurrencyToNumber = (val) => {
    return Number(val.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.'));
  };

  // Open Add Form
  const openNewForm = (entity) => {
    setActiveEntity(entity);
    setEditId(null);
    setIsFormModalOpen(true);

    if (entity === 'clientes') {
      setClientForm({ nome: '', email: '', telefone: '', cpf_cnpj: '', observacoes: '' });
      setClientErrors({});
    } else if (entity === 'servicos') {
      setServiceForm({ nome: '', descricao: '', preco: '', ativo: true });
    } else if (entity === 'tiposRoupa') {
      setTipoRoupaForm({ nome: '', descricao: '' });
    } else if (entity === 'pedidos') {
      setPedidoForm({
        cliente_id: clientes[0]?._id || '',
        status: 'pendente',
        data_prevista: '',
        valor_total: 'R$ 0,00',
        observacoes: ''
      });
    }
  };

  // Open Edit Form
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
      setClientErrors({});
    } else if (entity === 'servicos') {
      setServiceForm({
        nome: item.nome || '',
        descricao: item.descricao || '',
        preco: formatCurrency(String((item.preco || 0) * 100)),
        ativo: item.ativo ?? true,
      });
    } else if (entity === 'tiposRoupa') {
      setTipoRoupaForm({
        nome: item.nome || '',
        descricao: item.descricao || '',
      });
    } else if (entity === 'pedidos') {
      setPedidoForm({
        cliente_id: item.cliente_id?._id || item.cliente_id || '',
        status: item.status || 'pendente',
        data_prevista: item.data_prevista ? new Date(item.data_prevista).toISOString().split('T')[0] : '',
        valor_total: formatCurrency(String((item.valor_total || 0) * 100)),
        observacoes: item.observacoes || '',
      });
    }
  };

  // View Details
  const openDetail = (entity, item) => {
    setActiveEntity(entity);
    setDetailData(item);
    setIsDetailModalOpen(true);
  };

  // Save Record
  const handleSave = async (e) => {
    e.preventDefault();
    let endpoint = '';
    let bodyData = {};

    if (activeEntity === 'clientes') {
      const errors = {
        nome: !clientForm.nome.trim(),
        email: !clientForm.email.trim(),
        telefone: !clientForm.telefone.trim(),
        cpf_cnpj: !clientForm.cpf_cnpj.trim(),
      };
      setClientErrors(errors);
      if (Object.values(errors).some(Boolean)) {
        return;
      }
      endpoint = 'clientes';
      bodyData = clientForm;
    } else if (activeEntity === 'servicos') {
      endpoint = 'servicos';
      bodyData = {
        ...serviceForm,
        preco: parseCurrencyToNumber(serviceForm.preco),
      };
    } else if (activeEntity === 'tiposRoupa') {
      endpoint = 'tipos-roupa';
      bodyData = tipoRoupaForm;
    } else if (activeEntity === 'pedidos') {
      endpoint = 'pedidos';
      bodyData = {
        ...pedidoForm,
        usuario_id: user.id || user._id, // Associa ao usuário atual
        valor_total: parseCurrencyToNumber(pedidoForm.valor_total),
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

  // Delete Record
  const handleDelete = async (entity, id) => {
    if (!window.confirm('Tem certeza que deseja apagar este registro?')) return;

    let endpoint = '';
    if (entity === 'clientes') endpoint = 'clientes';
    if (entity === 'servicos') endpoint = 'servicos';
    if (entity === 'tiposRoupa') endpoint = 'tipos-roupa';
    if (entity === 'pedidos') endpoint = 'pedidos';

    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao apagar o registro.');
    }
  };

  // Order Items logic (when viewing Order Detail modal)
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
        valor_total: Number(newItemForm.valor_total || 0),
      });
      setNewItemForm({
        tipo_roupa_id: tiposRoupa[0]?._id || '',
        quantidade: 1,
        descricao: '',
        status: 'pendente',
        valor_total: 0,
      });
      // Recarregar os detalhes do pedido
      const updatedOrder = await axios.get(`${API_URL}/pedidos/${detailData._id}`);
      setDetailData(updatedOrder.data);
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
      valor_total: item.valor_total || 0,
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
        valor_total: Number(editItemForm.valor_total || 0),
      });
      setEditingItemId(null);
      const updatedOrder = await axios.get(`${API_URL}/pedidos/${detailData._id}`);
      setDetailData(updatedOrder.data);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao atualizar item do pedido.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Tem certeza que deseja apagar este item?')) return;
    try {
      await axios.delete(`${API_URL}/pedidos-itens/${itemId}`);
      const updatedOrder = await axios.get(`${API_URL}/pedidos/${detailData._id}`);
      setDetailData(updatedOrder.data);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao apagar item do pedido.');
    }
  };

  // Services within Order Items
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

    const selectedService = servicos.find((s) => s._id === servicoId);
    if (!selectedService) return;

    try {
      await axios.post(`${API_URL}/pedido-item-servicos`, {
        pedido_item_id: itemId,
        servico_id: servicoId,
        preco_unitario: selectedService.preco,
        quantidade: quant,
      });
      setNewServiceForm({
        ...newServiceForm,
        [itemId]: { servico_id: servicos[0]?._id || '', quantidade: 1 },
      });
      const updatedOrder = await axios.get(`${API_URL}/pedidos/${detailData._id}`);
      setDetailData(updatedOrder.data);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao adicionar serviço ao item.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Tem certeza que deseja apagar este serviço?')) return;
    try {
      await axios.delete(`${API_URL}/pedido-item-servicos/${serviceId}`);
      const updatedOrder = await axios.get(`${API_URL}/pedidos/${detailData._id}`);
      setDetailData(updatedOrder.data);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao apagar serviço do item.');
    }
  };

  if (loading || !user) {
    return (
      <div style={{ color: 'var(--text-main)', textAlign: 'center', marginTop: '100px' }}>
        Carregando...
      </div>
    );
  }

  // Filtragem dos dados dependendo da aba ativa
  const getFilteredData = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'clientes') {
      return clientes.filter(c => c.nome?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term));
    }
    if (activeTab === 'servicos') {
      return servicos.filter(s => s.nome?.toLowerCase().includes(term));
    }
    if (activeTab === 'tiposRoupa') {
      return tiposRoupa.filter(t => t.nome?.toLowerCase().includes(term));
    }
    if (activeTab === 'pedidos') {
      return pedidos.filter(p => {
        const matchesName = p.cliente_id?.nome?.toLowerCase().includes(term);
        const matchesStatus = p.status?.toLowerCase().includes(term);
        return matchesName || matchesStatus;
      });
    }
    return [];
  };

  const filteredItems = getFilteredData();

  return (
    <div className="admin-layout">
      <NavAdmin activeTab={activeTab} />

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'dashboard' && 'Painel Geral'}
            {activeTab === 'clientes' && 'Gerenciamento de Clientes'}
            {activeTab === 'servicos' && 'Gerenciamento de Serviços'}
            {activeTab === 'tiposRoupa' && 'Tipos de Roupa'}
            {activeTab === 'pedidos' && 'Controle de Pedidos'}
          </h1>
        </header>

        <section className="admin-content">
          {/* TAB DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <Users size={24} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Total de Clientes</h3>
                    <p>{clientes.length}</p>
                  </div>
                </div>
                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <Briefcase size={24} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Serviços Cadastrados</h3>
                    <p>{servicos.length}</p>
                  </div>
                </div>
                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Pedidos Realizados</h3>
                    <p>{pedidos.length}</p>
                  </div>
                </div>
                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <Shirt size={24} />
                  </div>
                  <div className="dashboard-card-info">
                    <h3>Tipos de Roupas</h3>
                    <p>{tiposRoupa.length}</p>
                  </div>
                </div>
              </div>

              <div className="table-container" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Últimos Pedidos Lançados</h3>
                <div className="crud-table-wrapper">
                  <table className="crud-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Entrada</th>
                        <th>Previsão</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.slice(-5).reverse().map((p, idx) => (
                        <tr key={p._id || idx}>
                          <td>{p.cliente_id?.nome || 'Cliente Desconhecido'}</td>
                          <td>{new Date(p.data_entrada).toLocaleDateString('pt-BR')}</td>
                          <td>{p.data_prevista ? new Date(p.data_prevista).toLocaleDateString('pt-BR') : '-'}</td>
                          <td>R$ {(p.valor_total || 0).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${
                              p.status === 'finalizado' ? 'badge-success' :
                              p.status === 'em andamento' ? 'badge-info' : 'badge-warning'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS (CLIENTES, SERVICOS, TIPOS DE ROUPA, PEDIDOS) */}
          {activeTab !== 'dashboard' && (
            <div className="table-container">
              <div className="table-header-actions">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-small primary" onClick={() => openNewForm(activeTab)}>
                  <Plus size={14} />
                  Adicionar Novo
                </button>
              </div>

              <div className="crud-table-wrapper">
                {activeTab === 'clientes' && (
                  <table className="crud-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>E-mail</th>
                        <th>CPF/CNPJ</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((cliente, idx) => (
                        <tr key={cliente._id || idx}>
                          <td>{cliente.nome}</td>
                          <td>{cliente.telefone || '-'}</td>
                          <td>{cliente.email || '-'}</td>
                          <td>{cliente.cpf_cnpj || '-'}</td>
                          <td>
                            <div className="actions-cell">
                              <button className="btn-icon" onClick={() => openDetail('clientes', cliente)} title="Ver Detalhes">
                                <Info size={14} />
                              </button>
                              <button className="btn-icon edit" onClick={() => openEditForm('clientes', cliente)} title="Editar">
                                <Edit2 size={14} />
                              </button>
                              <button className="btn-icon delete" onClick={() => handleDelete('clientes', cliente._id)} title="Excluir">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'servicos' && (
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
                      {filteredItems.map((servico, idx) => (
                        <tr key={servico._id || idx}>
                          <td>{servico.nome}</td>
                          <td>R$ {(servico.preco || 0).toFixed(2)}</td>
                          <td>{servico.descricao || '-'}</td>
                          <td>
                            <span className={`badge ${servico.ativo ? 'badge-success' : 'badge-danger'}`}>
                              {servico.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button className="btn-icon" onClick={() => openDetail('servicos', servico)} title="Ver Detalhes">
                                <Info size={14} />
                              </button>
                              <button className="btn-icon edit" onClick={() => openEditForm('servicos', servico)} title="Editar">
                                <Edit2 size={14} />
                              </button>
                              <button className="btn-icon delete" onClick={() => handleDelete('servicos', servico._id)} title="Excluir">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'tiposRoupa' && (
                  <table className="crud-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((tipo, idx) => (
                        <tr key={tipo._id || idx}>
                          <td>{tipo.nome}</td>
                          <td>{tipo.descricao || '-'}</td>
                          <td>
                            <div className="actions-cell">
                              <button className="btn-icon" onClick={() => openDetail('tiposRoupa', tipo)} title="Ver Detalhes">
                                <Info size={14} />
                              </button>
                              <button className="btn-icon edit" onClick={() => openEditForm('tiposRoupa', tipo)} title="Editar">
                                <Edit2 size={14} />
                              </button>
                              <button className="btn-icon delete" onClick={() => handleDelete('tiposRoupa', tipo._id)} title="Excluir">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'pedidos' && (
                  <table className="crud-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Entrada</th>
                        <th>Previsão</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((pedido, idx) => (
                        <tr key={pedido._id || idx}>
                          <td>{pedido.cliente_id?.nome || 'Cliente Desconhecido'}</td>
                          <td>{new Date(pedido.data_entrada).toLocaleDateString('pt-BR')}</td>
                          <td>{pedido.data_prevista ? new Date(pedido.data_prevista).toLocaleDateString('pt-BR') : '-'}</td>
                          <td>R$ {(pedido.valor_total || 0).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${
                              pedido.status === 'finalizado' ? 'badge-success' :
                              pedido.status === 'em andamento' ? 'badge-info' : 'badge-warning'
                            }`}>
                              {pedido.status}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button className="btn-icon" onClick={() => openDetail('pedidos', pedido)} title="Ver Detalhes">
                                <Info size={14} />
                              </button>
                              <button className="btn-icon edit" onClick={() => openEditForm('pedidos', pedido)} title="Editar">
                                <Edit2 size={14} />
                              </button>
                              <button className="btn-icon delete" onClick={() => handleDelete('pedidos', pedido._id)} title="Excluir">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <header className="modal-header">
              <h3>
                {editId ? 'Editar ' : 'Cadastrar '}
                {activeEntity === 'clientes' && 'Cliente'}
                {activeEntity === 'servicos' && 'Serviço'}
                {activeEntity === 'tiposRoupa' && 'Tipo de Roupa'}
                {activeEntity === 'pedidos' && 'Pedido'}
              </h3>
              <button className="modal-close" onClick={() => setIsFormModalOpen(false)}>
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {activeEntity === 'clientes' && (
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Nome Completo</label>
                      <input
                        type="text"
                        className={`form-input ${clientErrors.nome ? 'input-error' : ''}`}
                        style={{ paddingLeft: '20px' }}
                        required
                        value={clientForm.nome}
                        onChange={(e) => setClientForm({ ...clientForm, nome: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Telefone</label>
                      <input
                        type="text"
                        className={`form-input ${clientErrors.telefone ? 'input-error' : ''}`}
                        style={{ paddingLeft: '20px' }}
                        value={clientForm.telefone}
                        onChange={(e) => setClientForm({ ...clientForm, telefone: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">E-mail</label>
                      <input
                        type="email"
                        className={`form-input ${clientErrors.email ? 'input-error' : ''}`}
                        style={{ paddingLeft: '20px' }}
                        value={clientForm.email}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">CPF/CNPJ</label>
                      <input
                        type="text"
                        className={`form-input ${clientErrors.cpf_cnpj ? 'input-error' : ''}`}
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
                  </div>
                )}

                {activeEntity === 'servicos' && (
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Nome do Serviço</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '20px' }}
                        required
                        value={serviceForm.nome}
                        onChange={(e) => setServiceForm({ ...serviceForm, nome: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Preço</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '20px' }}
                        required
                        value={serviceForm.preco}
                        onChange={(e) => setServiceForm({ ...serviceForm, preco: formatCurrency(e.target.value) })}
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
                    <div className="input-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={serviceForm.ativo}
                        onChange={(e) => setServiceForm({ ...serviceForm, ativo: e.target.checked })}
                      />
                      <label className="input-label" style={{ padding: 0 }}>Serviço Ativo</label>
                    </div>
                  </div>
                )}

                {activeEntity === 'tiposRoupa' && (
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Nome</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '20px' }}
                        required
                        value={tipoRoupaForm.nome}
                        onChange={(e) => setTipoRoupaForm({ ...tipoRoupaForm, nome: e.target.value })}
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
                  </div>
                )}

                {activeEntity === 'pedidos' && (
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Cliente</label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={pedidoForm.cliente_id}
                          onChange={(e) => setPedidoForm({ ...pedidoForm, cliente_id: e.target.value })}
                        >
                          {clientes.map(c => (
                            <option key={c._id} value={c._id}>{c.nome}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Previsão de Entrega</label>
                      <input
                        type="date"
                        className="form-input"
                        style={{ paddingLeft: '20px' }}
                        required
                        value={pedidoForm.data_prevista}
                        onChange={(e) => setPedidoForm({ ...pedidoForm, data_prevista: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Valor Total</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '20px' }}
                        required
                        value={pedidoForm.valor_total}
                        onChange={(e) => setPedidoForm({ ...pedidoForm, valor_total: formatCurrency(e.target.value) })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Status</label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={pedidoForm.status}
                          onChange={(e) => setPedidoForm({ ...pedidoForm, status: e.target.value })}
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em andamento">Em andamento</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Observações</label>
                      <textarea
                        className="form-textarea"
                        value={pedidoForm.observacoes}
                        onChange={(e) => setPedidoForm({ ...pedidoForm, observacoes: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
              <footer className="modal-footer">
                <button type="button" className="btn-small secondary" onClick={() => setIsFormModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-small primary">Salvar Registro</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && detailData && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: activeEntity === 'pedidos' ? '800px' : '550px', maxWidth: '95%' }}>
            <header className="modal-header">
              <h3>Detalhes do Registro</h3>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <X size={18} />
              </button>
            </header>
            <div className="modal-body" style={{ maxHeight: '75vh' }}>
              {activeEntity === 'clientes' && (
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nome</span>
                    <span className="detail-val">{detailData.nome}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">E-mail</span>
                    <span className="detail-val">{detailData.email || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Telefone</span>
                    <span className="detail-val">{detailData.telefone || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">CPF/CNPJ</span>
                    <span className="detail-val">{detailData.cpf_cnpj || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Observações</span>
                    <span className="detail-val">{detailData.observacoes || '-'}</span>
                  </div>
                </div>
              )}

              {activeEntity === 'servicos' && (
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nome do Serviço</span>
                    <span className="detail-val">{detailData.nome}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Preço</span>
                    <span className="detail-val">R$ {(detailData.preco || 0).toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Descrição</span>
                    <span className="detail-val">{detailData.descricao || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-val">{detailData.ativo ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </div>
              )}

              {activeEntity === 'tiposRoupa' && (
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nome</span>
                    <span className="detail-val">{detailData.nome}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Descrição</span>
                    <span className="detail-val">{detailData.descricao || '-'}</span>
                  </div>
                </div>
              )}

              {activeEntity === 'pedidos' && (
                <div>
                  <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="detail-item">
                      <span className="detail-label">Cliente</span>
                      <span className="detail-val">{detailData.cliente_id?.nome || 'Não definido'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Atendente</span>
                      <span className="detail-val">{detailData.usuario_id?.nome || 'Não definido'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Data de Entrada</span>
                      <span className="detail-val">{new Date(detailData.data_entrada).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Previsão de Saída</span>
                      <span className="detail-val">{detailData.data_prevista ? new Date(detailData.data_prevista).toLocaleDateString('pt-BR') : '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Valor Total</span>
                      <span className="detail-val" style={{ color: 'var(--green-light)', fontWeight: 'bold' }}>R$ {(detailData.valor_total || 0).toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-val">
                        <span className={`badge ${
                          detailData.status === 'finalizado' ? 'badge-success' :
                          detailData.status === 'em andamento' ? 'badge-info' : 'badge-warning'
                        }`}>
                          {detailData.status}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                    <h4 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Roupas / Itens do Pedido</h4>

                    {/* Listagem de itens */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                      {pedidoItens.filter(i => (i.pedido_id?._id || i.pedido_id) === detailData._id).map((item) => (
                        <div key={item._id} style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          padding: '15px'
                        }}>
                          {editingItemId === item._id ? (
                            // Edit item mode
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <select
                                  className="form-select"
                                  style={{ padding: '8px 12px' }}
                                  value={editItemForm.tipo_roupa_id}
                                  onChange={(e) => setEditItemForm({ ...editItemForm, tipo_roupa_id: e.target.value })}
                                >
                                  {tiposRoupa.map(tr => (
                                    <option key={tr._id} value={tr._id}>{tr.name || tr.nome}</option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  className="form-input"
                                  style={{ width: '80px', padding: '8px 12px' }}
                                  value={editItemForm.quantidade}
                                  onChange={(e) => setEditItemForm({ ...editItemForm, quantidade: Number(e.target.value) })}
                                />
                              </div>
                              <input
                                type="text"
                                className="form-input"
                                style={{ padding: '8px 12px' }}
                                placeholder="Descrição"
                                value={editItemForm.descricao}
                                onChange={(e) => setEditItemForm({ ...editItemForm, descricao: e.target.value })}
                              />
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button className="btn-small secondary" onClick={() => setEditingItemId(null)}>Cancelar</button>
                                <button className="btn-small primary" onClick={() => handleUpdateItem(item._id)}>Salvar</button>
                              </div>
                            </div>
                          ) : (
                            // Display item mode
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600 }}>
                                  {item.tipo_roupa_id?.nome || 'Tipo Roupa'} (x{item.quantidade})
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => handleEditItem(item)} style={{ background: 'none', border: 'none', color: 'var(--green-light)', cursor: 'pointer' }}><Edit2 size={14} /></button>
                                  <button onClick={() => handleDeleteItem(item._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                </div>
                              </div>
                              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                                {item.descricao || 'Sem descrição'}
                              </p>

                              {/* Serviços do item */}
                              <div style={{ paddingLeft: '15px', borderLeft: '2px solid rgba(139, 92, 246, 0.2)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Serviços Realizados:</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                                  {item.servicos && item.servicos.map((s, sIdx) => (
                                    <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                      <span>- {s.servico_id?.nome || 'Serviço'}</span>
                                      <button onClick={() => handleDeleteService(s._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '10px' }}>remover</button>
                                    </div>
                                  ))}
                                </div>

                                {/* Adicionar serviço ao item */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                  <select
                                    className="form-select"
                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                    value={newServiceForm[item._id]?.servico_id || ''}
                                    onChange={(e) => setNewServiceForm({
                                      ...newServiceForm,
                                      [item._id]: { ...newServiceForm[item._id], servico_id: e.target.value }
                                    })}
                                  >
                                    <option value="">Selecione serviço...</option>
                                    {servicos.map(s => (
                                      <option key={s._id} value={s._id}>{s.nome} (R$ {s.preco.toFixed(2)})</option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleAddService(item._id)}
                                    className="btn-small primary"
                                    style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}
                                  >
                                    Adicionar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Novo item form */}
                    <form onSubmit={handleCreateItem} style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '10px' }}>
                        Adicionar Roupa ao Pedido
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <select
                          className="form-select"
                          value={newItemForm.tipo_roupa_id}
                          onChange={(e) => setNewItemForm({ ...newItemForm, tipo_roupa_id: e.target.value })}
                        >
                          {tiposRoupa.map(tr => (
                            <option key={tr._id} value={tr._id}>{tr.nome}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          placeholder="Qtd"
                          className="form-input"
                          style={{ paddingLeft: '15px' }}
                          required
                          value={newItemForm.quantidade}
                          onChange={(e) => setNewItemForm({ ...newItemForm, quantidade: Number(e.target.value) })}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Observações / Detalhes da Roupa"
                        className="form-input"
                        style={{ paddingLeft: '15px', marginBottom: '10px' }}
                        value={newItemForm.descricao}
                        onChange={(e) => setNewItemForm({ ...newItemForm, descricao: e.target.value })}
                      />
                      <button type="submit" className="btn-small primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Lançar Item no Pedido
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
            <footer className="modal-footer">
              <button className="btn-small secondary" onClick={() => setIsDetailModalOpen(false)}>Fechar Detalhes</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
