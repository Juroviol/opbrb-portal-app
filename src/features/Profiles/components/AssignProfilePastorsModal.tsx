import { Col, Form, Modal, notification, Row, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PASTORS_NAME } from '@querys/pastorQuery.ts';
import Pastor from '@models/Pastor.ts';
import { required } from '@validators';
import { useCallback, useEffect, useState } from 'react';
import { ASSIGN_PROFILE_PASTORS } from '@querys/profileQuery.ts';

function AssignProfilePastorsModal({
  profileId,
  onClose,
}: {
  profileId: string;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const [filter, setFilter] = useState<string>('');
  const [assign, mutation] = useMutation(ASSIGN_PROFILE_PASTORS);
  const query = useQuery<{
    pastors: { total: number; docs: Pick<Pastor, '_id' | 'name'>[] };
  }>(GET_PASTORS_NAME, {
    variables: {
      page: 1,
      size: 20,
      name: filter,
    },
  });

  const handleFinish = useCallback(
    async (values: { pastors: string[] }) => {
      await assign({
        variables: {
          profile: profileId,
          pastors: values.pastors,
        },
      });
      notification.success({
        message: 'Permissões deste perfil atribuídas com sucesso!',
      });
      onClose();
    },
    [profileId, onClose]
  );

  useEffect(() => {
    form.resetFields();
    setFilter('');
  }, [form, open]);

  return (
    <Modal
      open
      onClose={onClose}
      onCancel={onClose}
      onOk={() => form.submit()}
      cancelButtonProps={{
        disabled: mutation.loading,
        loading: mutation.loading,
      }}
      okButtonProps={{
        disabled: mutation.loading,
        loading: mutation.loading,
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="pastors"
              label="Pastores"
              rules={[
                required({
                  type: 'array',
                }),
              ]}
            >
              <Select
                showSearch
                onSearch={(value) => setFilter(value)}
                onSelect={() => setFilter('')}
                mode="multiple"
                optionFilterProp="label"
                allowClear
                options={(query.data?.pastors.docs || []).map((p) => ({
                  value: p._id,
                  label: p.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AssignProfilePastorsModal;
