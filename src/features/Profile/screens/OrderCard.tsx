import { Button, Card, Col, Form, notification, Row, Upload } from 'antd';
import { fileSize } from '@validators';
import { RcFile } from 'antd/es/upload/interface';
import Picture3_4 from '@assets/3_4.webp';
import { useAuth } from '@contexts/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PASTOR_ORDER_CARD } from '@querys/pastorQuery';

export default function OrderCard() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const urlRef = useRef<string>();

  const [update, mutation] = useMutation(UPDATE_PASTOR_ORDER_CARD);

  const loadCurrentPicture = useCallback(async () => {
    const response = await fetch(
      `${import.meta.env.VITE_ASSETS_URL}/${user!.pictureUrl}`
    );
    const blob = await response.blob();
    const file = new File([blob], user!.pictureUrl!.split('/').pop()!, {
      type: blob.type,
    });
    urlRef.current = URL.createObjectURL(file);
    const rcFile = {
      uid: -1,
      name: file.name,
      url: urlRef.current,
      originFileObj: file,
    };
    form.setFieldValue('picture', { file: rcFile, fileList: [rcFile] });
    setLoading(false);
  }, [user, form]);

  useEffect(() => {
    if (user && user.pictureUrl) {
      loadCurrentPicture();
    } else {
      setLoading(false);
    }
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [user?._id, loadCurrentPicture]);

  const onFinish = useCallback(
    async (values: { picture?: { file: RcFile } }) => {
      if (values.picture) {
        const result = await update({
          variables: {
            _id: user?._id,
            ...(values.picture && {
              filePicture: values.picture.file,
            }),
          },
        });
        if (result.data?.updatePastor) {
          notification.success({
            message: 'Foto atualizada com sucesso!',
          });
        }
      }
    },
    [user]
  );

  return (
    <Card loading={loading}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) =>
                prevValues.picture !== nextValues.picture
              }
            >
              {(formInstance) => (
                <Form.Item name="picture" rules={[fileSize('picture')]}>
                  <Upload.Dragger
                    beforeUpload={() => {
                      form.setFieldValue('picture', undefined);
                      return false;
                    }}
                    showUploadList={!!formInstance.getFieldValue('picture')}
                    fileList={
                      formInstance.getFieldValue('picture')
                        ? [
                            {
                              uid: (
                                formInstance.getFieldValue('picture') as {
                                  file: RcFile;
                                }
                              ).file.uid,
                              name: (
                                formInstance.getFieldValue('picture') as {
                                  file: RcFile;
                                }
                              ).file.name,
                            },
                          ]
                        : []
                    }
                    onRemove={() => {
                      formInstance.setFieldValue('picture', undefined);
                      return false;
                    }}
                  >
                    {!formInstance.getFieldValue('picture') && (
                      <>
                        <div
                          style={{
                            margin: 'auto',
                            width: 300,
                            height: 350,
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          <img
                            style={{
                              position: 'absolute',
                              top: -55,
                              left: -80,
                            }}
                            src={Picture3_4}
                            width={400}
                          />
                        </div>
                        <p className="ant-upload-text">
                          Clique ou arraste o arquivo da foto para esta área.
                        </p>
                        <p className="ant-upload-text">
                          A foto deve ter formato 3x4 com fundo branco.
                        </p>
                      </>
                    )}
                    {formInstance.getFieldValue('picture')?.file && (
                      <img
                        width={300}
                        src={
                          formInstance.getFieldValue('picture').file.url
                            ? formInstance.getFieldValue('picture').file.url
                            : URL.createObjectURL(
                                formInstance.getFieldValue('picture').file
                              )
                        }
                      />
                    )}
                  </Upload.Dragger>
                </Form.Item>
              )}
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
