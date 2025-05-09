import { useMutation, useQuery } from '@apollo/client';
import { GET_PASTOR, UPDATE_PASTOR_SCOPES } from '@querys/pastorQuery.ts';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  Collapse,
  Descriptions,
  Flex,
  Form,
  notification,
  Tag,
  Transfer,
  Typography,
} from 'antd';
import Pastor, { MaritalStatus, Status } from '@models/Pastor.ts';
import dayjs from 'dayjs';
import {
  CheckCircleFilled,
  DeleteFilled,
  DownloadOutlined,
} from '@ant-design/icons';
import { useCallback, useMemo } from 'react';
import { useAuth } from '@contexts/AuthContext.tsx';
import { Scope } from '@models/User.ts';
import { GET_SCOPES } from '@querys/scopeQuery.ts';
import { SCOPES_DETAILS } from '@consts';
import { TransferKey } from 'antd/es/transfer/interface';
import { compact } from 'lodash';

function PastorDetailScreen() {
  const { hasPermission } = useAuth();
  const [form] = Form.useForm();
  const params = useParams();

  const [updateScopes, updateScopesMutation] =
    useMutation(UPDATE_PASTOR_SCOPES);
  const scopesQuery = useQuery<{ scopes: Scope[] }>(GET_SCOPES);
  const getPastorQuery = useQuery<{ getPastor: Pastor }>(GET_PASTOR, {
    variables: {
      id: params.id,
    },
  });

  const handleDownload = useCallback((url: string) => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_ASSETS_URL}/${url}`;
    link.target = '_blank';
    link.download = url.split('/').pop() as string;
    link.click();
    link.parentNode?.removeChild(link);
  }, []);

  const descriptionItems = useMemo(() => {
    if (getPastorQuery.data) {
      return [
        {
          key: 'cpf',
          label: 'CPF',
          children: getPastorQuery.data.getPastor.cpf,
        },
        {
          key: 'birthday',
          label: 'Data de nascimento',
          children: dayjs(getPastorQuery.data.getPastor.birthday).format(
            'DD/MM/YYYY'
          ),
          span: 2,
        },
        {
          key: 'maritalStatus',
          label: 'Estado civil',
          children:
            MaritalStatus[
              getPastorQuery.data.getPastor
                .maritalStatus as string as keyof typeof MaritalStatus
            ],
        },
        {
          key: 'email',
          label: 'E-mail',
          children: getPastorQuery.data?.getPastor.email,
        },
        {
          key: 'cellPhone',
          label: 'Celular',
          children: getPastorQuery.data?.getPastor.cellPhone,
          span: 3,
        },
        {
          key: 'zipCode',
          label: 'CEP',
          children: getPastorQuery.data?.getPastor.zipCode,
        },
        {
          key: 'address',
          label: 'Endereço',
          children: `${getPastorQuery.data.getPastor.street}, ${getPastorQuery.data.getPastor.number} - ${getPastorQuery.data.getPastor.district}, ${getPastorQuery.data.getPastor.city} - ${getPastorQuery.data.getPastor.state}`,
          span: 3,
        },
        {
          key: 'church',
          label: 'Igreja',
          children: getPastorQuery.data.getPastor.church,
        },
        {
          key: 'ordinanceTime',
          label: 'Ordenado há',
          children:
            getPastorQuery.data.getPastor.ordinanceTime > 12
              ? `${getPastorQuery.data.getPastor.ordinanceTime / 12} ${
                  getPastorQuery.data.getPastor.ordinanceTime / 12 > 1
                    ? 'anos'
                    : 'ano'
                }`
              : `${getPastorQuery.data.getPastor.ordinanceTime} ${
                  getPastorQuery.data.getPastor.ordinanceTime > 1
                    ? 'meses'
                    : 'mês'
                }`,
          span: 3,
        },
        ...(hasPermission(Scope.CanDownloadPastorRecommendationLetter) &&
        getPastorQuery.data.getPastor.recommendationLetterUrl
          ? [
              {
                key: 'recommendationLetter',
                label: 'Carta de recomendação',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        getPastorQuery.data?.getPastor.recommendationLetterUrl!
                      )
                    }
                  />
                ),
              },
            ]
          : []),
        ...(hasPermission(Scope.CanDownloadPastorPaymentConfirmation) &&
        getPastorQuery.data.getPastor.paymentConfirmationUrl
          ? [
              {
                key: 'paymentConfirmation',
                label: 'Comprovante de pagamento anual',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        getPastorQuery.data?.getPastor.paymentConfirmationUrl!
                      )
                    }
                  />
                ),
              },
            ]
          : []),
        ...(hasPermission(Scope.CanDownloadPastorOrdinationMinutes) &&
        getPastorQuery.data.getPastor.ordinationMinutesUrl
          ? [
              {
                key: 'ordinationMinutes',
                label: 'Ata de ordenação',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        getPastorQuery.data?.getPastor.ordinationMinutesUrl!
                      )
                    }
                  />
                ),
              },
            ]
          : []),
        ...(hasPermission(Scope.CanDownloadPastorCpfRg) &&
        getPastorQuery.data.getPastor.cpfRgUrl
          ? [
              {
                key: 'cpfRg',
                label: 'Cópia do CPF/RG',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(getPastorQuery.data?.getPastor.cpfRgUrl!)
                    }
                  />
                ),
              },
            ]
          : []),
      ];
    }
    return [];
  }, [getPastorQuery.data]);

  const handlePermissionsChange = useCallback(
    (nextTargetKeys: TransferKey[]) => {
      form.setFieldValue('scopes', nextTargetKeys.join());
    },
    []
  );

  const handleFinish = useCallback(async () => {
    await updateScopes({
      variables: {
        _id: params.id,
        scopes: compact(form.getFieldValue('scopes').split(',')),
      },
    });
    notification.success({
      message: 'Permissões atualizadas com sucesso!.',
    });
  }, []);

  return (
    <Flex vertical gap={30}>
      <Breadcrumb
        items={[
          { title: 'Home' },
          {
            title: <Link to="/pastores">Pastores</Link>,
          },
          {
            title: getPastorQuery.data?.getPastor.name,
          },
        ]}
      />
      <Card loading={getPastorQuery.loading}>
        {!!getPastorQuery.data && (
          <Flex vertical>
            <Descriptions
              column={4}
              title={
                <Flex gap={10} align="center">
                  <Typography.Text
                    style={{
                      fontSize: 'calc(var(--ant-font-size) * 1.3)',
                    }}
                    strong
                  >
                    {getPastorQuery.data.getPastor.name}
                  </Typography.Text>
                  <Tag
                    color={
                      {
                        [Status.APPROVED]: 'green',
                        [Status.ANALYSING]: 'yellow',
                      }[getPastorQuery.data.getPastor.status]
                    }
                  >
                    {getPastorQuery.data.getPastor.status}
                  </Tag>
                </Flex>
              }
              items={descriptionItems}
              layout="vertical"
            />
            <Flex justify="flex-end" gap={10}>
              {hasPermission(Scope.CanApprovePastorDocumentationAnalysis) && (
                <Button icon={<CheckCircleFilled />} type="primary">
                  Aprovar Documentação
                </Button>
              )}
              {hasPermission(Scope.CanApprovePastorFinancialAnalysis) && (
                <Button icon={<CheckCircleFilled />} type="primary">
                  Aprovar Financeiro
                </Button>
              )}
              {hasPermission(Scope.CanDeletePastor) && (
                <Button
                  icon={<DeleteFilled />}
                  type="primary"
                  variant="solid"
                  color="danger"
                >
                  Excluir
                </Button>
              )}
            </Flex>
          </Flex>
        )}
      </Card>
      {hasPermission(Scope.CanAssignProfileScopes) && (
        <Collapse
          style={{
            backgroundColor: 'white',
          }}
        >
          <Collapse.Panel header="Permissões" key="scopes">
            <Flex vertical>
              <Form
                form={form}
                onFinish={handleFinish}
                initialValues={{
                  ...(getPastorQuery.data?.getPastor && {
                    scopes: getPastorQuery.data?.getPastor.scopes.join(),
                  }),
                }}
              >
                <Form.Item
                  shouldUpdate={(prevValues, nextValues) =>
                    prevValues.scopes !== nextValues.scopes
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <Transfer
                      style={{ minWidth: '50%' }}
                      titles={['Todas permissões', 'Permissões atribuídas']}
                      dataSource={scopesQuery.data?.scopes.map((scope) => ({
                        key: scope,
                        ...SCOPES_DETAILS[scope],
                      }))}
                      targetKeys={getFieldValue('scopes')?.split(',') || []}
                      onChange={handlePermissionsChange}
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
                <Form.Item name="scopes" />
              </Form>
              <Flex justify="flex-end">
                <Button
                  icon={<DeleteFilled />}
                  type="primary"
                  loading={updateScopesMutation.loading}
                  onClick={() => form.submit()}
                >
                  Atualizar
                </Button>
              </Flex>
            </Flex>
          </Collapse.Panel>
        </Collapse>
      )}
    </Flex>
  );
}

export default PastorDetailScreen;
