import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  notification,
  Row,
  Select,
  Typography,
  Upload,
} from 'antd';
import { required } from '../../../validators.ts';
import { MINISTRY_ORDINANCE_TIME } from '@consts';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_PASTOR_MINISTRY_INFO,
  UPDATE_PASTOR_MINISTRY_INFO,
} from '../../../querys/pastorQuery.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { RcFile } from 'antd/es/upload/interface';

function Ministry() {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [update, mutation] = useMutation(UPDATE_PASTOR_MINISTRY_INFO);

  const query = useQuery(GET_PASTOR_MINISTRY_INFO, {
    variables: {
      id: user?._id,
    },
  });
  const handleBeforeUpload = useCallback(() => {
    return false;
  }, []);

  const onFinish = useCallback(
    async (values: {
      church: string;
      ordinanceTime: number;
      letter: { file: RcFile };
      paymentConfirmation: { file: RcFile };
    }) => {
      const result = await update({
        variables: {
          _id: user?._id,
          ...values,
          ...(values.letter && {
            fileLetter: values.letter.file,
          }),
          ...(values.paymentConfirmation && {
            filePaymentConfirmation: values.paymentConfirmation.file,
          }),
        },
      });
      if (result.data?.updatePastor) {
        await query.refetch();
        notification.success({
          message: 'Informações de ministério atualizadas com sucesso!',
        });
      }
    },
    [user]
  );

  const handleDownload = useCallback((url: string) => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_ASSETS_URL}/${url}`;
    link.download = url.split('/').pop() as string;
    link.click();
    link.parentNode?.removeChild(link);
  }, []);

  return (
    <Card loading={query.loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={query.data?.getPastor}
      >
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
            <Form.Item
              name="letter"
              label={
                <Flex gap={5} align="center">
                  <Typography.Text>
                    Carta de recomendação da Igreja
                  </Typography.Text>
                  {!!query.data?.getPastor.recommendationLetterUrl && (
                    <Button
                      shape="circle"
                      icon={<DownloadOutlined />}
                      onClick={() =>
                        handleDownload(
                          query.data.getPastor.recommendationLetterUrl!
                        )
                      }
                    />
                  )}
                </Flex>
              }
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
          <Col span={12}>
            <Form.Item
              name="paymentConfirmation"
              label={
                <Flex gap={5} align="center">
                  <Typography.Text>
                    Comprovante de pagamento anual
                  </Typography.Text>
                  {!!query.data?.getPastor.paymentConfirmationUrl && (
                    <Button
                      shape="circle"
                      icon={<DownloadOutlined />}
                      onClick={() =>
                        handleDownload(
                          query.data.getPastor.paymentConfirmationUrl!
                        )
                      }
                    />
                  )}
                </Flex>
              }
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

export default Ministry;
