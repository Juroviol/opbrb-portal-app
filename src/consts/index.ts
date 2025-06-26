import { range } from 'lodash';
import { Scope } from '@models/User.ts';

export const UFS = [
  { label: 'Acre', value: 'Acre' },
  { label: 'Alagoas', value: 'Alagoas' },
  { label: 'Amapá', value: 'Amapá' },
  { label: 'Amazonas', value: 'Amazonas' },
  { label: 'Bahia', value: 'Bahia' },
  { label: 'Ceará', value: 'Ceará' },
  { label: 'Distrito Federal', value: 'Distrito Federal' },
  { label: 'Espírito Santo', value: 'Espírito Santo' },
  { label: 'Goiás', value: 'Goiás' },
  { label: 'Maranhão', value: 'Maranhão' },
  { label: 'Mato Grosso', value: 'Mato Grosso' },
  { label: 'Mato Grosso do Sul', value: 'Mato Grosso do Sul' },
  { label: 'Minas Gerais', value: 'Minas Gerais' },
  { label: 'Pará', value: 'Pará' },
  { label: 'Paraíba', value: 'Paraíba' },
  { label: 'Paraná', value: 'Paraná' },
  { label: 'Pernambuco', value: 'Pernambuco' },
  { label: 'Piauí', value: 'Piauí' },
  { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
  { label: 'Rio Grande do Norte', value: 'Rio Grande do Norte' },
  { label: 'Rio Grande do Sul', value: 'Rio Grande do Sul' },
  { label: 'Rondônia', value: 'Rondônia' },
  { label: 'Roraima', value: 'Roraima' },
  { label: 'Santa Catarina', value: 'Santa Catarina' },
  { label: 'São Paulo', value: 'São Paulo' },
  { label: 'Sergipe', value: 'Sergipe' },
  { label: 'Tocantins', value: 'Tocantins' },
];

export const MINISTRY_ORDINANCE_TIME = [
  ...range(1, 12).map((v) => ({
    label: `${v} ${v > 1 ? 'meses' : 'mês'}`,
    value: v,
  })),
  ...range(1, 101).map((v) => ({
    label: `${v} ${v > 1 ? 'anos' : 'ano'}`,
    value: v * 12,
  })),
];

export const SCOPES_DETAILS: {
  [k in Scope]: { title: string; description: string };
} = {
  [Scope.CanListPastors]: {
    title: 'Listar cadastros de pastores',
    description: 'Permite listar todos os pastores cadastrados.',
  },
  [Scope.CanDetailPastor]: {
    title: 'Detalhar cadastro de pastor',
    description: 'Permite visualizar todos os dados de um cadastro de pastor.',
  },
  [Scope.CanDeletePastor]: {
    title: 'Excluir cadastro de pastor',
    description: 'Permite excluir permanentemente o cadastro de um pastor.',
  },

  [Scope.CanEditAccountPersonalInfo]: {
    title: 'Editar dados pessoais do cadastro',
    description:
      'Permite editar do seu próprio cadastro as informações pessoais como nome, data de nascimento, etc.',
  },
  [Scope.CanEditAccountCredentials]: {
    title: 'Editar credenciais do cadastro',
    description:
      'Permite editar do seu próprio cadastro as credenciais de acesso deste portal.',
  },
  [Scope.CanEditAccountAddress]: {
    title: 'Editar endereço do cadastro',
    description:
      'Permite editar no seu próprio cadastro o endereço residencial.',
  },
  [Scope.CanEditAccountContactInfo]: {
    title: 'Editar contatos do cadastro',
    description: 'Permite editar no seu próprio cadastro o telefone e e-mail.',
  },
  [Scope.CanEditAccountMinistry]: {
    title: 'Editar informações ministeriais',
    description:
      'Permite editar no seu próprio cadastro dados referentes ao ministério exercido.',
  },
  [Scope.CanEditAccountOrderCard]: {
    title: 'Editar carteirinha',
    description:
      'Permite editar no seu próprio cadastro dados da carteirinha da ordem.',
  },
  [Scope.CanListAccountAnalysisHistory]: {
    title: 'Permite listar o histórico de análise',
    description:
      'Permite listar no seu próprio cadastro o histórico de análise.',
  },
  [Scope.CanApprovePastorDocumentationAnalysis]: {
    title: 'Aprovar análise de documentação',
    description: 'Permite aprovar a análise documental do cadastro do pastor.',
  },
  [Scope.CanApprovePastorFinancialAnalysis]: {
    title: 'Aprovar análise financeira',
    description: 'Permite aprovar a análise financeira do cadastro do pastor.',
  },
  [Scope.CanAddPendingItemAnalysis]: {
    title: 'Pode criar uma pendência pós-análise',
    description:
      'Permite criar uma pendência pós-análise no cadastro do pastor.',
  },
  [Scope.CanDownloadPastorRecommendationLetter]: {
    title: 'Baixar carta de recomendação',
    description:
      'Permite realizar o download da carta de recomendação cadastrada.',
  },
  [Scope.CanDownloadPastorPaymentConfirmation]: {
    title: 'Baixar comprovante de pagamento',
    description:
      'Permite realizar o download do comprovante de pagamento enviado pelo pastor.',
  },
  [Scope.CanDownloadPastorOrdinationMinutes]: {
    title: 'Baixar ata de ordenação',
    description: 'Permite realizar o download da ata de ordenação do pastor.',
  },
  [Scope.CanDownloadPastorCpfRg]: {
    title: 'Baixar documentos CPF e RG',
    description:
      'Permite realizar o download dos documentos CPF e RG anexados pelo pastor.',
  },
  [Scope.CanListProfileScopes]: {
    title: 'Listar perfis de permissão cadastrado',
    description: 'Permite listar os perfis de permissões cadastrados.',
  },
  [Scope.CanEditProfileScopes]: {
    title: 'Editar perfis de permissão',
    description:
      'Permite editar um perfil de permissão atribuindo ou removendo permissões.',
  },
  [Scope.CanCreateProfileScopes]: {
    title: 'Criar perfis de permissão',
    description: 'Permite cadastrar novos perfis de permissão.',
  },
  [Scope.CanDeleteProfileScopes]: {
    title: 'Excluir perfis de permissão',
    description: 'Permite excluir um perfil de permissão.',
  },
  [Scope.CanAssignProfileScopes]: {
    title: 'Atribuir permissões',
    description: 'Permite associar permissões a perfis e usuários.',
  },
};
