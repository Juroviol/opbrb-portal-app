import { Button, Card, Col, Form, Input, Row, Select, Upload } from 'antd';
import { required } from '../../../validators.ts';
import { MINISTRY_ORDINANCE_TIME } from '@consts';
import { UploadOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PASTOR_MINISTRY_INFO } from '../../../querys/pastorQuery.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';

function Ministry() {
  const { user } = useAuth();
  const { loading, data } = useQuery(GET_PASTOR_MINISTRY_INFO, {
    variables: {
      id: user?._id,
    },
  });
  const handleBeforeUpload = useCallback(() => {
    return false;
  }, []);
  return (
    <Card loading={loading}>
      <Form layout="vertical" initialValues={data?.getPastor}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="church"
              required
              rules={[required()]}
              label="Igreja onde é pastor"
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="ordinanceTime"
              required
              rules={[
                required({
                  type: 'number',
                }),
              ]}
              label="Há quanto tempo é pastor ordenado"
            >
              <Select
                size="large"
                showSearch
                options={MINISTRY_ORDINANCE_TIME}
                allowClear
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="letter" label="Carta de recomendação da Igreja">
              <Upload
                multiple={false}
                maxCount={1}
                accept=".png,.jpeg,.jpg,.pdf"
                beforeUpload={handleBeforeUpload}
              >
                <Button icon={<UploadOutlined />}>Escolher o arquivo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="paymentConfirmation"
              label="Comprovante de pagamento anual"
            >
              <Upload
                multiple={false}
                maxCount={1}
                accept=".png,.jpeg,.jpg,.pdf"
                beforeUpload={handleBeforeUpload}
              >
                <Button icon={<UploadOutlined />}>Escolher o arquivo</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default Ministry;
