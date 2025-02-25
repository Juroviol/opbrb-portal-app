import {
  Button,
  Card,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
} from 'antd';
import { isCEP, required } from '../../../validators.ts';
import MaskedInput from '@components/MaskedInput';
import { UFS } from '@consts';
import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_PASTOR_ADDRESS_INFO,
  UPDATE_PASTOR_ADDRESS,
} from '../../../querys/pastorQuery.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import Pastor from '../../../models/Pastor.ts';

function Address() {
  const { user } = useAuth();
  const [update, mutation] = useMutation<{
    updatePastor: Pastor;
  }>(UPDATE_PASTOR_ADDRESS);
  const query = useQuery(GET_PASTOR_ADDRESS_INFO, {
    variables: {
      id: user?._id,
    },
  });
  const [form] = Form.useForm();
  const handleValuesChange = useCallback(
    ({ zipCode }: { zipCode: string }) => {
      if (zipCode) {
        const unmaskedZipCode = zipCode.replace(/[^\d]/g, '');
        if (unmaskedZipCode && unmaskedZipCode.length === 8) {
          fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
            .then((res) => res.json())
            .then((json) => {
              form.setFieldsValue({
                street: json.logradouro,
                city: json.localidade,
                state: json.estado,
                district: json.bairro,
              });
            });
        }
      }
    },
    [form]
  );

  const onFinish = useCallback(
    async (values: {
      zipCode: string;
      street: string;
      district: string;
      city: string;
      state: string;
    }) => {
      const result = await update({
        variables: {
          _id: user?._id,
          ...values,
        },
      });
      if (result.data?.updatePastor) {
        notification.success({
          message: 'Endereço atualizado com sucesso!',
        });
      }
    },
    [user]
  );

  return (
    <Card loading={query.loading}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
        initialValues={query.data?.getPastor}
      >
        <Row>
          <Col span={6}>
            <Form.Item
              name="zipCode"
              required
              rules={[required(), isCEP]}
              label="CEP"
            >
              <MaskedInput mask="00000-000" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={18}>
            <Form.Item
              name="street"
              rules={[required()]}
              required
              label="Logradouro"
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="number"
              rules={[required()]}
              required
              label="Número"
            >
              <MaskedInput size="large" mask="[0][0][0][0][0]" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item name="complement" label="Complemento">
              <Input size="large" placeholder="Apartamento, Bloco" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="district"
              required
              rules={[required()]}
              label="Bairro"
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item label="Cidade" name="city" rules={[required()]} required>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Estado"
              name="state"
              rules={[required()]}
              required
            >
              <Select size="large" options={UFS} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" loading={mutation.loading}>
              Atualizar
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default Address;
