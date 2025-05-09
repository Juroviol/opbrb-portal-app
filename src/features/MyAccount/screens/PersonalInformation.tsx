import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
} from 'antd';
import { isCPF, required } from '@validators';
import MaskedInput from '@components/MaskedInput';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_PASTOR_PERSONAL_INFO,
  UPDATE_PASTOR_PERSONAL_INFO,
} from '@querys/pastorQuery.ts';
import { useAuth } from '@contexts/AuthContext.tsx';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import Pastor, { MaritalStatus } from '@models/Pastor.ts';
import { SaveFilled } from '@ant-design/icons';

function PersonalInformation() {
  const { user } = useAuth();
  const [update, mutation] = useMutation<{
    updatePastor: Pastor;
  }>(UPDATE_PASTOR_PERSONAL_INFO);
  const query = useQuery(GET_PASTOR_PERSONAL_INFO, {
    variables: {
      _id: user?._id,
    },
  });

  const onFinish = useCallback(
    async (values: {
      name: string;
      cpf: string;
      birthday: dayjs.Dayjs;
      maritalStatus: MaritalStatus;
    }) => {
      const result = await update({
        variables: {
          _id: user?._id,
          ...values,
          birthday: values.birthday.format('YYYY-MM-DD'),
        },
      });
      if (result.data?.updatePastor) {
        notification.success({
          message: 'Informações pessoais atualizadas com sucesso!',
        });
      }
    },
    [user]
  );

  return (
    <Card loading={query.loading}>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...(query.data?.pastor && {
            ...query.data.pastor,
            birthday: dayjs(query.data.pastor.birthday),
          }),
        }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              name="name"
              rules={[required()]}
              required
              label="Nome completo"
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={8}>
            <Form.Item name="cpf" required label="CPF" rules={[isCPF]}>
              <MaskedInput size="large" mask="000.000.000-00" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="maritalStatus"
              required
              label="Estado civil"
              rules={[required()]}
            >
              <Select
                size="large"
                options={[
                  {
                    label: 'Casado',
                    value: 'Married',
                  },
                  {
                    label: 'Solteiro',
                    value: 'Single',
                  },
                  {
                    label: 'Viúvo',
                    value: 'Widower',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="birthday"
              required
              label="Data de nascimento"
              rules={[required({ type: 'date' })]}
            >
              <DatePicker
                size="large"
                placeholder=""
                format={{
                  format: 'DD/MM/YYYY',
                  type: 'mask',
                }}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              icon={<SaveFilled />}
              type="primary"
              htmlType="submit"
              loading={mutation.loading}
            >
              Atualizar
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default PersonalInformation;
