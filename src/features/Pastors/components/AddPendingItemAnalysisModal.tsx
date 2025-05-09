import { useCallback, useEffect } from 'react';
import { Col, Form, Input, Modal, notification, Row, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_PASTOR_PENDING_ITEM_ANALYSIS } from '@querys/pastorQuery.ts';
import { required } from '@validators';
import { AnalysisType } from '@models/Pastor.ts';
import { findKey } from 'lodash';

function AddPendingItemAnalysisModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const params = useParams();
  const [create, mutation] = useMutation(CREATE_PASTOR_PENDING_ITEM_ANALYSIS);
  const handleOnFinish = useCallback(async () => {
    await create({
      variables: { _id: params.id, ...form.getFieldsValue() },
    });
    notification.success({
      message: 'Pendência criada com sucesso!',
    });
    onClose();
  }, [form, onClose]);
  useEffect(() => {
    form.resetFields();
  }, [open, form]);
  return (
    <Modal
      title="Criar pendência"
      open={open}
      closable={false}
      okText="Criar"
      onCancel={onClose}
      cancelButtonProps={{
        disabled: mutation.loading,
      }}
      okButtonProps={{
        disabled: mutation.loading,
        loading: mutation.loading,
      }}
      onOk={() => form.submit()}
    >
      <Form layout="vertical" form={form} onFinish={handleOnFinish}>
        <Row>
          <Col span={24}>
            <Form.Item name="type" label="Tipo" rules={[required()]}>
              <Select
                options={[
                  {
                    label: AnalysisType.Documentation,
                    value: findKey(
                      AnalysisType,
                      (v) => v === AnalysisType.Documentation
                    ),
                  },
                  {
                    label: AnalysisType.Financial,
                    value: findKey(
                      AnalysisType,
                      (v) => v === AnalysisType.Financial
                    ),
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="reason" label="Descrição" rules={[required()]}>
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddPendingItemAnalysisModal;
