import { range } from 'lodash';

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
