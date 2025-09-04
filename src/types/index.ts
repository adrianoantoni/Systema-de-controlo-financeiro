export interface User {
  id: number;
  nome: string;
  email: string;
  nivel_acesso_id: number;
  departamento_id: number;
  nivel_acesso: NivelAcesso;
  departamento: Departamento;
  data_criacao: string;
  data_ultima_sessao?: string;
  ativo: boolean;
  foto_perfil?: string;
}

export interface NivelAcesso {
  id: number;
  nome: string;
  descricao: string;
  permissoes: Permissoes;
}

export interface Permissoes {
  facturas: {
    criar: boolean;
    editar: 'proprias' | 'departamento' | 'todas';
    aprovar: 'departamento' | 'todas' | 'nenhuma';
    visualizar: 'proprias' | 'departamento' | 'todas';
    excluir: boolean;
  };
  relatorios: {
    departamento: boolean;
    globais: boolean;
    exportar: boolean;
  };
  usuarios: {
    criar: boolean;
    editar: boolean;
    visualizar: 'proprios' | 'departamento' | 'todos';
    gerirPermissoes: boolean;
  };
  configuracoes: {
    acessar: boolean;
  };
  categorias: {
    gerir: boolean;
  };
}

export interface Departamento {
  id: number;
  nome: string;
  codigo: string;
  orcamento_mensal: number;
  responsavel_id: number;
  ativo: boolean;
}

export interface Factura {
  id: number;
  numero_factura: string;
  fornecedor: string;
  descricao: string;
  valor: number;
  moeda: string;
  data_factura: string;
  data_vencimento?: string;
  categoria_id: number;
  departamento_id: number;
  status_id: number;
  submissao_usuario_id: number;
  aprovacao_usuario_id?: number;
  data_submissao: string;
  data_aprovacao?: string;
  arquivo_caminho?: string;
  observacoes?: string;
  categoria: CategoriaFactura;
  departamento: Departamento;
  status: StatusFactura;
  usuario_submissao: User;
  usuario_aprovacao?: User;
}

export interface CategoriaFactura {
  id: number;
  nome: string;
  codigo: string;
  descricao: string;
  ativo: boolean;
}

export interface StatusFactura {
  id: number;
  nome: string;
  cor: string;
  descricao: string;
}

export interface DashboardKPI {
  total_facturas: number;
  valor_total: number;
  pendentes_aprovacao: number;
  aprovadas_mes: number;
  media_tempo_aprovacao: number;
  gasto_por_departamento: { departamento: string; valor: number }[];
  evolucao_mensal: { mes: string; valor: number }[];
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'factura' | 'info';
  relatedId?: number;
}

export interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video';
}

export interface Conversation {
  id: number;
  participantIds: number[];
  messages: Message[];
  unreadCount: number;
}
