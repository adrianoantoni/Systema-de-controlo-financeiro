import { faker } from '@faker-js/faker';
import { Factura, DashboardKPI, CategoriaFactura, StatusFactura, User, NivelAcesso, Departamento, Permissoes, Conversation, Message } from '../types';

// Status das faturas
export const statusFacturas: StatusFactura[] = [
  { id: 1, nome: 'Submetida', cor: '#3B82F6', descricao: 'Factura submetida aguardando análise' },
  { id: 2, nome: 'Em Análise', cor: '#F59E0B', descricao: 'Factura em processo de análise' },
  { id: 3, nome: 'Aprovada', cor: '#10B981', descricao: 'Factura aprovada para pagamento' },
  { id: 4, nome: 'Rejeitada', cor: '#EF4444', descricao: 'Factura rejeitada' },
  { id: 5, nome: 'Paga', cor: '#8B5CF6', descricao: 'Factura paga' }
];

// Categorias de faturas
export const categoriasFacturas: CategoriaFactura[] = [
  { id: 1, nome: 'Material de Escritório', codigo: 'MAT_ESC', descricao: 'Materiais para escritório', ativo: true },
  { id: 2, nome: 'Equipamentos de TI', codigo: 'EQUIP_TI', descricao: 'Equipamentos de tecnologia', ativo: true },
  { id: 3, nome: 'Serviços de Consultoria', codigo: 'SERV_CONS', descricao: 'Serviços de consultoria externa', ativo: true },
  { id: 4, nome: 'Manutenção', codigo: 'MANUT', descricao: 'Serviços de manutenção', ativo: true },
  { id: 5, nome: 'Combustível', codigo: 'COMBUST', descricao: 'Combustível para veículos', ativo: true },
  { id: 6, nome: 'Telecomunicações', codigo: 'TELECOM', descricao: 'Serviços de telecomunicações', ativo: true }
];

// Departamentos mock
export const departamentos: Departamento[] = [
  { id: 1, nome: 'Administração', codigo: 'ADM', orcamento_mensal: 100000, responsavel_id: 1, ativo: true },
  { id: 2, nome: 'Tecnologia', codigo: 'TI', orcamento_mensal: 250000, responsavel_id: 1, ativo: true },
  { id: 3, nome: 'Recursos Humanos', codigo: 'RH', orcamento_mensal: 80000, responsavel_id: 1, ativo: true },
  { id: 4, nome: 'Comercial', codigo: 'COM', orcamento_mensal: 150000, responsavel_id: 1, ativo: true },
  { id: 5, nome: 'Financeiro', codigo: 'FIN', orcamento_mensal: 120000, responsavel_id: 1, ativo: true }
];

// Niveis de Acesso Mock
export const niveisAcesso: NivelAcesso[] = [
    { 
      id: 1, 
      nome: 'Super Admin', 
      descricao: 'Acesso total', 
      permissoes: { 
        facturas: { criar: true, editar: 'todas', aprovar: 'todas', visualizar: 'todas', excluir: true }, 
        relatorios: { departamento: true, globais: true, exportar: true }, 
        usuarios: { criar: true, editar: true, visualizar: 'todos', gerirPermissoes: true },
        configuracoes: { acessar: true },
        categorias: { gerir: true }
      } 
    },
    { 
      id: 2, 
      nome: 'Admin Financeiro', 
      descricao: 'Acesso financeiro', 
      permissoes: { 
        facturas: { criar: true, editar: 'todas', aprovar: 'todas', visualizar: 'todas', excluir: false }, 
        relatorios: { departamento: true, globais: true, exportar: true }, 
        usuarios: { criar: false, editar: false, visualizar: 'departamento', gerirPermissoes: false },
        configuracoes: { acessar: true },
        categorias: { gerir: true }
      } 
    },
    { 
      id: 3, 
      nome: 'Gestor de Departamento', 
      descricao: 'Acesso departamental', 
      permissoes: { 
        facturas: { criar: true, editar: 'departamento', aprovar: 'departamento', visualizar: 'departamento', excluir: false }, 
        relatorios: { departamento: true, globais: false, exportar: true }, 
        usuarios: { criar: false, editar: false, visualizar: 'departamento', gerirPermissoes: false },
        configuracoes: { acessar: false },
        categorias: { gerir: false }
      } 
    },
    { 
      id: 4, 
      nome: 'Funcionário', 
      descricao: 'Acesso básico', 
      permissoes: { 
        facturas: { criar: true, editar: 'proprias', aprovar: 'nenhuma', visualizar: 'proprias', excluir: false }, 
        relatorios: { departamento: false, globais: false, exportar: false }, 
        usuarios: { criar: false, editar: false, visualizar: 'proprios', gerirPermissoes: false },
        configuracoes: { acessar: false },
        categorias: { gerir: false }
      } 
    }
];

// Gerar usuários mock
export const generateMockUsers = (count: number = 20): User[] => {
    return Array.from({ length: count }, (_, index) => {
        const departamento = faker.helpers.arrayElement(departamentos);
        const nivelAcesso = faker.helpers.arrayElement(niveisAcesso.slice(1)); // Não gerar Super Admin aleatoriamente
        return {
            id: index + 10, // para não colidir com IDs de admin
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            nivel_acesso_id: nivelAcesso.id,
            departamento_id: departamento.id,
            nivel_acesso: nivelAcesso,
            departamento: departamento,
            data_criacao: faker.date.past().toISOString(),
            ativo: faker.datatype.boolean(),
            foto_perfil: faker.image.avatar(),
        };
    });
};

const mockUsers = generateMockUsers(20);

// Gerar faturas mock
export const generateMockFacturas = (count: number = 50): Factura[] => {
  return Array.from({ length: count }, (_, index) => {
    const departamento = faker.helpers.arrayElement(departamentos);
    const categoria = faker.helpers.arrayElement(categoriasFacturas);
    const status = faker.helpers.arrayElement(statusFacturas);
    const dataSubmissao = faker.date.recent({ days: 90 });
    const submissaoUser = faker.helpers.arrayElement(mockUsers);
    
    return {
      id: index + 1,
      numero_factura: `FAT-${faker.string.alphanumeric(8).toUpperCase()}`,
      fornecedor: faker.company.name(),
      descricao: faker.commerce.productDescription(),
      valor: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })),
      moeda: 'AOA',
      data_factura: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      data_vencimento: faker.date.future({ days: 30 }).toISOString().split('T')[0],
      categoria_id: categoria.id,
      departamento_id: departamento.id,
      status_id: status.id,
      submissao_usuario_id: submissaoUser.id,
      aprovacao_usuario_id: status.id >= 3 ? 1 : undefined,
      data_submissao: dataSubmissao.toISOString(),
      data_aprovacao: status.id >= 3 ? faker.date.between({ from: dataSubmissao, to: new Date() }).toISOString() : undefined,
      arquivo_caminho: `/uploads/facturas/${faker.string.alphanumeric(12)}.pdf`,
      observacoes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
      categoria,
      departamento,
      status,
      usuario_submissao: submissaoUser,
    };
  });
};

// KPIs do Dashboard
export const generateDashboardKPIs = (facturas: Factura[]): DashboardKPI => {
  const totalFacturas = facturas.length;
  const valorTotal = facturas.reduce((sum, f) => sum + f.valor, 0);
  const pendentesAprovacao = facturas.filter(f => f.status_id === 1 || f.status_id === 2).length;
  const aprovadasMes = facturas.filter(f => {
    const dataAprovacao = f.data_aprovacao ? new Date(f.data_aprovacao) : null;
    const mesAtual = new Date().getMonth();
    return dataAprovacao && dataAprovacao.getMonth() === mesAtual && f.status_id >= 3;
  }).length;

  // Calcular tempo médio de aprovação (em dias)
  const facturasAprovadas = facturas.filter(f => f.data_aprovacao);
  const temposAprovacao = facturasAprovadas.map(f => {
    const submissao = new Date(f.data_submissao);
    const aprovacao = new Date(f.data_aprovacao!);
    return Math.ceil((aprovacao.getTime() - submissao.getTime()) / (1000 * 60 * 60 * 24));
  });
  const mediaTempoAprovacao = temposAprovacao.length > 0 
    ? temposAprovacao.reduce((sum, tempo) => sum + tempo, 0) / temposAprovacao.length 
    : 0;

  // Gasto por departamento
  const gastoPorDepartamento = departamentos.map(dept => {
    const gastoTotal = facturas
      .filter(f => f.departamento_id === dept.id && f.status_id >= 3)
      .reduce((sum, f) => sum + f.valor, 0);
    return {
      departamento: dept.nome,
      valor: gastoTotal
    };
  });

  // Evolução mensal (últimos 6 meses)
  const evolucaoMensal = Array.from({ length: 6 }, (_, i) => {
    const data = new Date();
    data.setMonth(data.getMonth() - (5 - i));
    const mes = data.toLocaleDateString('pt-PT', { month: 'short' });
    
    const valorMes = facturas
      .filter(f => {
        const dataFactura = new Date(f.data_factura);
        return dataFactura.getMonth() === data.getMonth() && 
               dataFactura.getFullYear() === data.getFullYear() &&
               f.status_id >= 3;
      })
      .reduce((sum, f) => sum + f.valor, 0);
    
    return { mes, valor: valorMes };
  });

  return {
    total_facturas: totalFacturas,
    valor_total: valorTotal,
    pendentes_aprovacao: pendentesAprovacao,
    aprovadas_mes: aprovadasMes,
    media_tempo_aprovacao: Math.round(mediaTempoAprovacao * 10) / 10,
    gasto_por_departamento: gastoPorDepartamento,
    evolucao_mensal: evolucaoMensal
  };
};

export const generateMockConversations = (currentUser: User, allUsers: User[]): Conversation[] => {
  const otherUsers = allUsers.filter(u => u.id !== currentUser.id).slice(0, 5); // Max 5 conversations
  
  return otherUsers.map((otherUser, index): Conversation => {
    const messages: Message[] = Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, (_, msgIndex) => {
      const sender = faker.helpers.arrayElement([currentUser, otherUser]);
      return {
        id: msgIndex + index * 100,
        senderId: sender.id,
        content: faker.lorem.sentence(),
        timestamp: faker.date.recent({ days: 7 }).toISOString(),
        type: 'text'
      };
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return {
      id: index + 1,
      participantIds: [currentUser.id, otherUser.id],
      messages: messages,
      unreadCount: faker.number.int({ min: 0, max: 3 })
    };
  });
};
