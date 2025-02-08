import { Card, Col, Form, Input, Row } from 'antd';
import { required } from '../../../validators.ts';

function Credentials() {
  return (
    <Card>
      <Form layout="vertical">
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
      </Form>
    </Card>
  );
}

export default Credentials;
