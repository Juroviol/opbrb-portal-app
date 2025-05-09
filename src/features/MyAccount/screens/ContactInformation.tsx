import { Button, Card, Col, Form, Input, notification, Row } from 'antd';
import { email, required } from '@validators';
import MaskedInput from '@components/MaskedInput';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_PASTOR_CONTACT_INFO,
  UPDATE_PASTOR_CONTACT_INFO,
} from '@querys/pastorQuery.ts';
import { useAuth } from '@contexts/AuthContext.tsx';
import Pastor from '@models/Pastor.ts';
import { useCallback } from 'react';
import { SaveFilled } from '@ant-design/icons';

function ContactInformation() {
  const { user } = useAuth();
  const [update, mutation] = useMutation<{ updatePastor: Pastor }>(
    UPDATE_PASTOR_CONTACT_INFO
  );
  const query = useQuery(GET_PASTOR_CONTACT_INFO, {
    variables: {
      id: user?._id,
    },
  });

  const onFinish = useCallback(
    async (values: { cellPhone: string; email: string }) => {
      const result = await update({
        variables: {
          _id: user?._id,
          ...values,
        },
      });
      if (result.data?.updatePastor) {
        notification.success({
          message: 'Informações de contato atualizadas com sucesso!',
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
        initialValues={query.data?.getPastor}
      >
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              name="cellPhone"
              required
              rules={[required()]}
              label="Celular"
            >
              <MaskedInput size="large" mask="+55 (00)00000-0000" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              required
              label="E-mail"
              rules={[required(), email]}
            >
              <Input size="large" />
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

export default ContactInformation;
