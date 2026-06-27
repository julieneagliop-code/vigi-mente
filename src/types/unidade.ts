export interface Unidade {
  id: string;
  tenant_id: string;
  nome: string;
  tipo:
    | 'CRAS'
    | 'CREAS'
    | 'Centro POP'
    | 'Orgao Gestor'
    | 'Acolhimento'
    | 'SCFV'
    | 'Cadastro Unico'
    | 'Outro';
  codigo_cadsuas: string | null;
  rede: 'direta' | 'indireta' | null;
  complexidade: 'basica' | 'media' | 'alta' | null;
  publico_atendido: string | null;
  servicos: string[];
  capacidade_descricao: string | null;
  equipe_total_profissionais: number;
  endereco: string | null;
  telefone: string | null;
  ativo: boolean;
}

export interface UnidadeComIndicador extends Unidade {
  ultimo_atendimento: number | null;
  ultima_competencia: string | null; // 'YYYY-MM'
}

export interface IndicadorMensal {
  id: string;
  competencia: string; // 'YYYY-MM-DD'
  atendimentos_realizados: number | null;
  capacidade_nominal: number | null;
  capacidade_descricao_mes: string | null;
  observacoes: string | null;
}
