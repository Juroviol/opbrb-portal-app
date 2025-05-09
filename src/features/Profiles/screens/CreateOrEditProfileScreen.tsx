import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  notification,
  Row,
  Transfer,
  Typography,
} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { required } from '@validators';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SCOPES } from '@querys/scopeQuery.ts';
import { Scope } from '@models/User.ts';
import { SaveFilled } from '@ant-design/icons';
import { useCallback } from 'react';
import { TransferKey } from 'antd/es/transfer/interface';
import {
  CREATE_PROFILE,
  GET_PROFILE,
  UPDATE_PROFILE,
} from '@querys/profileQuery.ts';
import Profile from '@models/Profile.ts';
import { compact } from 'lodash';
import { SCOPES_DETAILS } from '@consts';

function CreateOrEditProfileScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [create, createMutation] = useMutation(CREATE_PROFILE);
  const [update, updateMutation] = useMutation(UPDATE_PROFILE);
  const scopesQuery = useQuery<{ scopes: Scope[] }>(GET_SCOPES);
  const profileQuery = useQuery<{ profile: Profile }>(GET_PROFILE, {
    variables: {
      _id: params.id,
    },
  });

  const handleChange = useCallback((nextTargetKeys: TransferKey[]) => {
    form.setFieldValue('scopes', nextTargetKeys.join());
  }, []);

  const handleFinish = useCallback(async () => {
    const { name, scopes } = form.getFieldsValue(true);
    if (params.id) {
      await update({
        variables: {
          _id: params.id,
          name,
          scopes: compact(scopes.split(',')),
        },
      });
      notification.success({
        message: 'Perfil atualizado com sucesso!',
      });
    } else {
      await create({
        variables: {
          name,
          scopes: compact(scopes.split(',')),
        },
      });
      notification.success({
        message: 'Perfil criado com sucesso!',
      });
      navigate('/perfis');
    }
  }, [form, params.id]);

  return (
    <Flex vertical gap={30}>
      <Breadcrumb
        items={[
          { title: 'Home' },
          {
            title: <Link to="/perfis">Perfis</Link>,
          },
          {
            title: params.id ? profileQuery.data?.profile?.name : 'Novo Perfil',
          },
        ]}
      />
      <Card loading={profileQuery.loading}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          initialValues={{
            ...(profileQuery.data?.profile && {
              ...profileQuery.data.profile,
              scopes: profileQuery.data.profile.scopes.join(),
            }),
          }}
        >
          <Row>
            <Col span={5}>
              <Form.Item name="name" label="Nome" rules={[required()]}>
                <Input disabled={!!params.id} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                shouldUpdate={(prevValues, nextValues) =>
                  prevValues.scopes !== nextValues.scopes
                }
                noStyle
              >
                {({ getFieldValue }) => (
                  <Transfer
                    style={{ minWidth: '50%' }}
                    titles={['Todas permissões', 'Permissões deste perfil']}
                    dataSource={scopesQuery.data?.scopes.map((scope) => ({
                      key: scope,
                      ...SCOPES_DETAILS[scope],
                    }))}
                    targetKeys={getFieldValue('scopes')?.split(',') || []}
                    onChange={handleChange}
                    render={(item) => (
                      <Flex vertical>
                        <Typography.Text strong>{item.title}</Typography.Text>
                        <Typography.Text type="secondary">
                          {item.description}
                        </Typography.Text>
                      </Flex>
                    )}
                    listStyle={{ width: '100%', height: 500 }}
                  />
                )}
              </Form.Item>
              <Form.Item
                name="scopes"
                rules={[required()]}
                style={{ marginTop: -32 }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                icon={<SaveFilled />}
                type="primary"
                onClick={() => form.submit()}
                loading={createMutation.loading || updateMutation.loading}
              >
                {params.id ? 'Atualizar' : 'Criar'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Flex>
  );
}

export default CreateOrEditProfileScreen;
