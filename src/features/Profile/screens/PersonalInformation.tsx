import { Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { isCPF, required } from '../../../validators.ts';
import MaskedInput from '@components/MaskedInput';
import { useQuery } from '@apollo/client';
import { GET_PASTOR_PERSONAL_INFO } from '../../../querys/pastorQuery.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import dayjs from 'dayjs';

function PersonalInformation() {
  const { user } = useAuth();
  const { loading, data } = useQuery(GET_PASTOR_PERSONAL_INFO, {
    variables: {
      id: user?._id,
    },
  });
  return (
    <Card loading={loading}>
      <Form
        layout="vertical"
        initialValues={{
          ...(data?.getPastor && {
            ...data.getPastor,
            birthday: dayjs(data.getPastor.birthday),
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
      </Form>
    </Card>
  );
}

export default PersonalInformation;
