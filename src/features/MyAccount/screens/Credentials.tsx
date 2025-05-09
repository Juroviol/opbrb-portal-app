import { Button, Card, Col, Form, Input, notification, Row } from 'antd';
import { required } from '@validators';
import { UPDATE_PASTOR_CREDENTIALS } from '@querys/pastorQuery.ts';
import { ApolloError, useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext.tsx';
import { SaveFilled } from '@ant-design/icons';

function Credentials() {
  const { user } = useAuth();
  const [update, mutation] = useMutation(UPDATE_PASTOR_CREDENTIALS);

  const onFinish = useCallback(
    async (values: { password: string; newPassword: string }) => {
      try {
        const result = await update({
          variables: {
            _id: user?._id,
            ...values,
          },
        });
        if (result.data.updatePastor) {
          notification.success({
            message: 'Senha atualizada com sucesso!',
          });
        }
      } catch (e) {
        if (e instanceof ApolloError) {
          notification.error({
            message:
              e.message === 'Invalid credentials'
                ? 'Senha atual inválida.'
                : '',
          });
        }
      }
    },
    []
  );

  return (
    <Card>
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item label="Senha atual" name="password" rules={[required()]}>
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Nova senha"
              name="newPassword"
              rules={[required()]}
            >
              <Input.Password />
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

export default Credentials;
