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

const SCOPES_DETAILS: { [k in Scope]: { title: string; description: string } } =
  {
    [Scope.CanListPastors]: {
      title: 'Listar cadastros de pastores',
      description: 'Permite listar todos os pastores cadastrados.',
    },
    [Scope.CanDetailPastor]: {
      title: 'Detalhar cadastro de pastor',
      description:
        'Permite visualizar todos os dados de um cadastro de pastor.',
    },
    [Scope.CanDeletePastor]: {
      title: 'Excluir cadastro de pastor',
      description: 'Permite excluir permanentemente o cadastro de um pastor.',
    },

    [Scope.CanEditAccountPersonalInfo]: {
      title: 'Editar dados pessoais do cadastro',
      description:
        'Permite editar do seu próprio cadastroas as informações pessoais como nome, data de nascimento, etc.',
    },
    [Scope.CanEditAccountCredentials]: {
      title: 'Editar credenciais do cadastro',
      description:
        'Permite editar do seu próprio cadastro as credenciais de acesso deste portal.',
    },
    [Scope.CanEditAccountAddress]: {
      title: 'Editar endereço do cadastro',
      description:
        'Permite editar no seu próprio cadastro o endereço residencial.',
    },
    [Scope.CanEditAccountContactInfo]: {
      title: 'Editar contatos do cadastro',
      description:
        'Permite editar no seu próprio cadastro o telefone e e-mail.',
    },
    [Scope.CanEditAccountMinistry]: {
      title: 'Editar informações ministeriais',
      description:
        'Permite editar no seu próprio cadastro dados referentes ao ministério exercido.',
    },
    [Scope.CanEditAccountOrderCard]: {
      title: 'Editar pedido de carteirinha',
      description:
        'Permite editar no seu próprio cadastro dados da carteirinha da ordem.',
    },
    [Scope.CanApprovePastorDocumentationAnalysis]: {
      title: 'Aprovar análise de documentação',
      description:
        'Permite aprovar a análise documental do cadastro do pastor.',
    },
    [Scope.CanRejectPastorDocumentationAnalysis]: {
      title: 'Rejeitar análise de documentação',
      description:
        'Permite rejeitar a análise documental do cadastro do pastor.',
    },
    [Scope.CanApprovePastorFinancialAnalysis]: {
      title: 'Aprovar análise financeira',
      description:
        'Permite aprovar a análise financeira do cadastro do pastor.',
    },
    [Scope.CanRejectPastorFinancialAnalysis]: {
      title: 'Rejeitar análise financeira',
      description:
        'Permite rejeitar a análise financeira do cadastro do pastor.',
    },
    [Scope.CanDownloadPastorRecommendationLetter]: {
      title: 'Baixar carta de recomendação',
      description:
        'Permite realizar o download da carta de recomendação cadastrada.',
    },
    [Scope.CanDownloadPastorPaymentConfirmation]: {
      title: 'Baixar comprovante de pagamento',
      description:
        'Permite realizar o download do comprovante de pagamento enviado pelo pastor.',
    },
    [Scope.CanDownloadPastorOrdinationMinutes]: {
      title: 'Baixar ata de ordenação',
      description: 'Permite realizar o download da ata de ordenação do pastor.',
    },
    [Scope.CanDownloadPastorCpfRg]: {
      title: 'Baixar documentos CPF e RG',
      description:
        'Permite realizar o download dos documentos CPF e RG anexados pelo pastor.',
    },
    [Scope.CanListProfileScopes]: {
      title: 'Listar perfis de permissão cadastrado',
      description: 'Permite listar os perfis de permissões cadastrados.',
    },
    [Scope.CanEditProfileScopes]: {
      title: 'Editar perfis de permissão',
      description:
        'Permite editar um perfil de permissão atribuindo ou removendo permissões.',
    },
    [Scope.CanCreateProfileScopes]: {
      title: 'Criar perfis de permissão',
      description: 'Permite cadastrar novos perfis de permissão.',
    },
    [Scope.CanDeleteProfileScopes]: {
      title: 'Excluir perfis de permissão',
      description: 'Permite excluir um perfil de permissão.',
    },
    [Scope.CanAssignProfileScopes]: {
      title: 'Atribuir permissões',
      description: 'Permite associar permissões a perfis e usuários.',
    },
  };

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
