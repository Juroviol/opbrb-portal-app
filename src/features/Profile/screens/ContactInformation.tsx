import { Card, Col, Form, Input, Row } from 'antd';
import { email, required } from '../../../validators.ts';
import MaskedInput from '@components/MaskedInput';
import { useQuery } from '@apollo/client';
import { GET_PASTOR_CONTACT_INFO } from '../../../querys/pastorQuery.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';

function ContactInformation() {
  const { user } = useAuth();
  const { loading, data } = useQuery(GET_PASTOR_CONTACT_INFO, {
    variables: {
      id: user?._id,
    },
  });
  return (
    <Card loading={loading}>
      <Form layout="vertical" initialValues={data?.getPastor}>
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
      </Form>
    </Card>
  );
}

export default ContactInformation;
