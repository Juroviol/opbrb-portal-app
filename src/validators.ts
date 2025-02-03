import dayjs from 'dayjs';
import { RcFile } from 'antd/lib/upload/interface';
import { Rule as AntdRule } from 'antd/es/form';

export type Rule = AntdRule;

export function required(
  {
    type = 'string',
    onError,
  }: {
    type?: 'string' | 'array' | 'file' | 'number' | 'boolean' | 'date';
    onError?: () => void;
  } = { type: 'string' }
): Rule {
  if (type === 'file' || type === 'date') {
    return {
      required: true,
      validator: (_, value) => {
        return new Promise<void>((resolve, reject) => {
          if (!value || (!dayjs(value) && !value.length)) {
            if (onError) {
              onError();
              return;
            }
            reject(new Error('Campo obriatório'));
          }
          resolve();
        });
      },
    };
  }
  if (type === 'boolean') {
    return {
      required: true,
      validator: (_, value) => {
        return new Promise<void>((resolve, reject) => {
          if (value) {
            resolve();
          }
          reject(new Error('Campo obrigatório'));
        });
      },
    };
  }
  return {
    required: true,
    type,
    message: 'Campo obrigatório',
  };
}

export function isCPF(): Rule {
  return {
    required: true,
    validator: (_, value) => {
      if (!value) {
        return Promise.reject(new Error('Campo obrigatório'));
      }
      const cpf = value.replace(/[^\d]+/g, '');
      if (!cpf) return Promise.reject(new Error('CPF inválido'));
      // Elimina CPFs invalidos conhecidos
      if (
        cpf.length !== 11 ||
        cpf === '00000000000' ||
        cpf === '11111111111' ||
        cpf === '22222222222' ||
        cpf === '33333333333' ||
        cpf === '44444444444' ||
        cpf === '55555555555' ||
        cpf === '66666666666' ||
        cpf === '77777777777' ||
        cpf === '88888888888' ||
        cpf === '99999999999'
      ) {
        return Promise.reject(new Error('CPF inválido'));
      }
      // Valida 1o digito
      let add = 0;
      let i;
      let rev;
      for (i = 0; i < 9; i += 1) add += parseInt(cpf.charAt(i), 10) * (10 - i);
      rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(9), 10)) {
        return Promise.reject(new Error('CPF inválido'));
      }
      // Valida 2o digito
      add = 0;
      for (i = 0; i < 10; i += 1) add += parseInt(cpf.charAt(i), 10) * (11 - i);
      rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(10), 10)) {
        return Promise.reject(new Error('CPF inválido'));
      }
      return Promise.resolve();
    },
  };
}

export const email: Rule = {
  type: 'email',
  message: 'E-mail inválido',
};

export function equalToField(fieldName: string, label: string): Rule {
  return ({ getFieldValue }) => ({
    required: true,
    validator: (_, value) => {
      if (!value) {
        return Promise.reject(new Error('Campo obrigatório'));
      }
      if (getFieldValue(fieldName) === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error(`Este campo não corresponde ao campo ${label}`)
      );
    },
  });
}

export const fileSize: Rule = {
  validator(_, value: { file: RcFile }) {
    if (
      value &&
      value.file.type.toString().includes('image') &&
      value.file.size / 1024 / 1024 > 1
    ) {
      return Promise.reject(
        new Error('O tamanho da imagem não pode ser maior que 1mb')
      );
    }
    return Promise.resolve();
  },
};
