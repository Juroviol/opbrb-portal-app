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
import { fileSize, required } from '@validators';
import { MINISTRY_ORDINANCE_TIME } from '@consts';
import {
  DownloadOutlined,
  SaveFilled,
  UploadOutlined,
} from '@ant-design/icons';
import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_PASTOR_MINISTRY_INFO,
  UPDATE_PASTOR_MINISTRY_INFO,
} from '@querys/pastorQuery.ts';
import { useAuth } from '@contexts/AuthContext.tsx';
import { RcFile } from 'antd/es/upload/interface';

function Ministry() {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [update, mutation] = useMutation(UPDATE_PASTOR_MINISTRY_INFO);

  const query = useQuery(GET_PASTOR_MINISTRY_INFO, {
    variables: {
      _id: user?._id,
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
      ordinationMinutes: { file: RcFile };
      cpfRg: { file: RcFile };
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
          ...(values.ordinationMinutes && {
            fileOrdinationMinutes: values.ordinationMinutes.file,
          }),
          ...(values.cpfRg && {
            fileCpfRg: values.cpfRg.file,
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
    link.target = '_blank';
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
        initialValues={query.data?.pastor}
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
              noStyle
              shouldUpdate={(prevValues, nextValues) =>
                prevValues.ordinationMinutes !== nextValues.ordinationMinutes
              }
            >
              {(formInstance) => (
                <Form.Item
                  name="ordinationMinutes"
                  label={
                    <Flex gap={5} align="center">
                      <Typography.Text>Ata de ordenação</Typography.Text>
                      {!!query.data?.pastor.ordinationMinutesUrl && (
                        <Button
                          shape="circle"
                          icon={<DownloadOutlined />}
                          onClick={() =>
                            handleDownload(
                              query.data.pastor.ordinationMinutesUrl!
                            )
                          }
                        />
                      )}
                    </Flex>
                  }
                  rules={[fileSize('ordinationMinutes')]}
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    accept=".png,.jpeg,.jpg,.pdf"
                    beforeUpload={handleBeforeUpload}
                    showUploadList={
                      !!formInstance.getFieldValue('ordinationMinutes')
                    }
                    onRemove={() => {
                      formInstance.setFieldValue(
                        'ordinationMinutes',
                        undefined
                      );
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Escolher o arquivo
                    </Button>
                  </Upload>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) =>
                prevValues.letter !== nextValues.letter
              }
            >
              {(formInstance) => (
                <Form.Item
                  name="letter"
                  label={
                    <Flex gap={5} align="center">
                      <Typography.Text>
                        Carta de recomendação da Igreja
                      </Typography.Text>
                      {!!query.data?.pastor.recommendationLetterUrl && (
                        <Button
                          shape="circle"
                          icon={<DownloadOutlined />}
                          onClick={() =>
                            handleDownload(
                              query.data.pastor.recommendationLetterUrl!
                            )
                          }
                        />
                      )}
                    </Flex>
                  }
                  rules={[fileSize('letter')]}
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    accept=".png,.jpeg,.jpg,.pdf"
                    beforeUpload={handleBeforeUpload}
                    showUploadList={!!formInstance.getFieldValue('letter')}
                    onRemove={() => {
                      formInstance.setFieldValue('letter', undefined);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Escolher o arquivo
                    </Button>
                  </Upload>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) =>
                prevValues.paymentConfirmation !==
                nextValues.paymentConfirmation
              }
            >
              {(formInstance) => (
                <Form.Item
                  name="paymentConfirmation"
                  label={
                    <Flex gap={5} align="center">
                      <Typography.Text>
                        Comprovante de pagamento anual
                      </Typography.Text>
                      {!!query.data?.pastor.paymentConfirmationUrl && (
                        <Button
                          shape="circle"
                          icon={<DownloadOutlined />}
                          onClick={() =>
                            handleDownload(
                              query.data.pastor.paymentConfirmationUrl!
                            )
                          }
                        />
                      )}
                    </Flex>
                  }
                  rules={[fileSize('paymentConfirmation')]}
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    accept=".png,.jpeg,.jpg,.pdf"
                    beforeUpload={handleBeforeUpload}
                    showUploadList={
                      !!formInstance.getFieldValue('paymentConfirmation')
                    }
                    onRemove={() => {
                      formInstance.setFieldValue(
                        'paymentConfirmation',
                        undefined
                      );
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Escolher o arquivo
                    </Button>
                  </Upload>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) =>
                prevValues.cpfRg !== nextValues.cpfRg
              }
            >
              {(formInstance) => (
                <Form.Item
                  name="cpfRg"
                  label={
                    <Flex gap={5} align="center">
                      <Typography.Text>Cópia do CPF/RG</Typography.Text>
                      {!!query.data?.pastor.cpfRgUrl && (
                        <Button
                          shape="circle"
                          icon={<DownloadOutlined />}
                          onClick={() =>
                            handleDownload(query.data.pastor.cpfRgUrl!)
                          }
                        />
                      )}
                    </Flex>
                  }
                  rules={[fileSize('cpfRg')]}
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    accept=".png,.jpeg,.jpg,.pdf"
                    beforeUpload={handleBeforeUpload}
                    showUploadList={!!formInstance.getFieldValue('cpfRg')}
                    onRemove={() => {
                      formInstance.setFieldValue('cpfRg', undefined);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Escolher o arquivo
                    </Button>
                  </Upload>
                </Form.Item>
              )}
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

export default Ministry;
