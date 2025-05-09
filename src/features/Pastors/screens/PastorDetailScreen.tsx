import { useMutation, useQuery } from '@apollo/client';
import {
  APPROVE_PASTOR_ANALYSIS,
  DELETE_PASTOR,
  GET_PASTOR,
  UPDATE_PASTOR_SCOPES,
} from '@querys/pastorQuery.ts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Flex,
  Form,
  notification,
  Popover,
  Row,
  Table,
  Tag,
  Transfer,
  Typography,
} from 'antd';
import Pastor, { AnalysisType, MaritalStatus, Status } from '@models/Pastor.ts';
import dayjs from 'dayjs';
import {
  CheckCircleFilled,
  DeleteFilled,
  DownloadOutlined,
  InfoCircleFilled,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@contexts/AuthContext.tsx';
import { Scope } from '@models/User.ts';
import { GET_SCOPES } from '@querys/scopeQuery.ts';
import { SCOPES_DETAILS } from '@consts';
import { TransferKey } from 'antd/es/transfer/interface';
import { compact, findKey, reverse } from 'lodash';
import AddPendingItemAnalysisModal from '@features/Pastors/components/AddPendingItemAnalysisModal.tsx';

function PastorDetailScreen() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();
  const approvingAnalisysTypeRef = useRef<AnalysisType>();
  const [isAddPendingItemModalVisible, setIsAddPendingItemModalVisible] =
    useState(false);

  const [updateScopes, updateScopesMutation] =
    useMutation(UPDATE_PASTOR_SCOPES);
  const [deletePastor, deletePastorMutation] = useMutation(DELETE_PASTOR);
  const [approveAnalysis, approveAnalysisMutation] = useMutation(
    APPROVE_PASTOR_ANALYSIS
  );
  // const [rejectAnalysis, rejectAnalysisMutation] = useMutation(
  //   REJECT_PASTOR_ANALYSIS
  // );
  const scopesQuery = useQuery<{ scopes: Scope[] }>(GET_SCOPES);
  const getPastorQuery = useQuery<{ pastor: Pastor }>(GET_PASTOR, {
    variables: {
      _id: params.id,
    },
  });

  useEffect(() => {
    getPastorQuery.refetch();
  }, [getPastorQuery]);

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
          children: getPastorQuery.data.pastor.cpf,
        },
        {
          key: 'birthday',
          label: 'Data de nascimento',
          children: dayjs(getPastorQuery.data.pastor.birthday).format(
            'DD/MM/YYYY'
          ),
          span: 2,
        },
        {
          key: 'maritalStatus',
          label: 'Estado civil',
          children:
            MaritalStatus[
              getPastorQuery.data.pastor
                .maritalStatus as string as keyof typeof MaritalStatus
            ],
        },
        {
          key: 'email',
          label: 'E-mail',
          children: getPastorQuery.data?.pastor.email,
        },
        {
          key: 'cellPhone',
          label: 'Celular',
          children: getPastorQuery.data?.pastor.cellPhone,
          span: 3,
        },
        {
          key: 'zipCode',
          label: 'CEP',
          children: getPastorQuery.data?.pastor.zipCode,
        },
        {
          key: 'address',
          label: 'Endereço',
          children: `${getPastorQuery.data.pastor.street}, ${getPastorQuery.data.pastor.number} - ${getPastorQuery.data.pastor.district}, ${getPastorQuery.data.pastor.city} - ${getPastorQuery.data.pastor.state}`,
          span: 3,
        },
        {
          key: 'church',
          label: 'Igreja',
          children: getPastorQuery.data.pastor.church,
        },
        {
          key: 'ordinanceTime',
          label: 'Ordenado há',
          children:
            getPastorQuery.data.pastor.ordinanceTime > 12
              ? `${getPastorQuery.data.pastor.ordinanceTime / 12} ${
                  getPastorQuery.data.pastor.ordinanceTime / 12 > 1
                    ? 'anos'
                    : 'ano'
                }`
              : `${getPastorQuery.data.pastor.ordinanceTime} ${
                  getPastorQuery.data.pastor.ordinanceTime > 1 ? 'meses' : 'mês'
                }`,
          span: 3,
        },
        ...(hasPermission(Scope.CanDownloadPastorRecommendationLetter) &&
        getPastorQuery.data.pastor.recommendationLetterUrl
          ? [
              {
                key: 'recommendationLetter',
                label: 'Carta de recomendação',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        getPastorQuery.data?.pastor.recommendationLetterUrl!
                      )
                    }
                  />
                ),
              },
            ]
          : []),
        ...(hasPermission(Scope.CanDownloadPastorPaymentConfirmation) &&
        getPastorQuery.data.pastor.paymentConfirmationUrl
          ? [
              {
                key: 'paymentConfirmation',
                label: 'Comprovante de pagamento anual',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        getPastorQuery.data?.pastor.paymentConfirmationUrl!
                      )
                    }
                  />
                ),
              },
            ]
          : []),
        ...(hasPermission(Scope.CanDownloadPastorOrdinationMinutes) &&
        getPastorQuery.data.pastor.ordinationMinutesUrl
          ? [
              {
                key: 'ordinationMinutes',
                label: 'Ata de ordenação',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        getPastorQuery.data?.pastor.ordinationMinutesUrl!
                      )
                    }
                  />
                ),
              },
            ]
          : []),
        ...(hasPermission(Scope.CanDownloadPastorCpfRg) &&
        getPastorQuery.data.pastor.cpfRgUrl
          ? [
              {
                key: 'cpfRg',
                label: 'Cópia do CPF/RG',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(getPastorQuery.data?.pastor.cpfRgUrl!)
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

  const handleApproveAnalysis = useCallback(async (type: AnalysisType) => {
    approvingAnalisysTypeRef.current = type;
    await approveAnalysis({
      variables: {
        _id: params.id,
        type: Object.keys(AnalysisType).find(
          (key) => type === AnalysisType[key as keyof typeof AnalysisType]
        ),
      },
    });
    notification.success({
      message: `Análise ${
        {
          [AnalysisType.Documentation]: 'da documentação',
          [AnalysisType.Financial]: 'financeira',
        }[type]
      } aprovada com sucesso!`,
    });
    getPastorQuery.refetch();
    approvingAnalisysTypeRef.current = undefined;
  }, []);

  const handleDelete = useCallback(async () => {
    await deletePastor({
      variables: {
        _id: params.id,
      },
    });
    notification.success({
      message: 'Cadastro excluído com sucesso!',
    });
    navigate('/pastores');
  }, [params.id]);

  const isApproveDocumentationVisible = useMemo(() => {
    const analysis = reverse([...(getPastorQuery.data?.pastor.analysis || [])]);
    const lastDocumentationAnalysis = analysis.find(
      (a) =>
        a.type ===
        findKey(AnalysisType, (value) => value === AnalysisType.Documentation)
    );
    return (
      hasPermission(Scope.CanApprovePastorDocumentationAnalysis) &&
      Status.APPROVED !== getPastorQuery.data?.pastor.status &&
      !lastDocumentationAnalysis?.approved
    );
  }, [hasPermission, getPastorQuery.data]);

  const isApproveFinancialVisible = useMemo(() => {
    const analysis = reverse([...(getPastorQuery.data?.pastor.analysis || [])]);
    const lastFinancialAnalysis = analysis.find(
      (a) =>
        a.type ===
        findKey(AnalysisType, (value) => value === AnalysisType.Financial)
    );
    return (
      hasPermission(Scope.CanApprovePastorDocumentationAnalysis) &&
      Status.APPROVED !== getPastorQuery.data?.pastor.status &&
      !lastFinancialAnalysis?.approved
    );
  }, [hasPermission, getPastorQuery.data]);

  return (
    <>
      <Flex vertical gap={30}>
        <Breadcrumb
          items={[
            { title: 'Home' },
            {
              title: <Link to="/pastores">Pastores</Link>,
            },
            {
              title: getPastorQuery.data?.pastor.name,
            },
          ]}
        />
        <Card loading={getPastorQuery.loading}>
          {!!getPastorQuery.data && (
            <>
              <Row gutter={50} style={{ alignItems: 'center' }}>
                {!!getPastorQuery.data.pastor.pictureUrl && (
                  <Col span={4}>
                    <img
                      style={{ width: '100%', borderRadius: 50 }}
                      src={`${import.meta.env.VITE_ASSETS_URL}/${
                        getPastorQuery.data.pastor.pictureUrl
                      }`}
                    />
                  </Col>
                )}
                <Col span={getPastorQuery.data.pastor.pictureUrl ? 20 : 24}>
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
                          {getPastorQuery.data.pastor.name}
                        </Typography.Text>
                        <Tag
                          color={
                            {
                              [Status.APPROVED]: 'green',
                              [Status.ANALYSING]: 'yellow',
                            }[getPastorQuery.data.pastor.status]
                          }
                        >
                          {getPastorQuery.data.pastor.status}
                        </Tag>
                      </Flex>
                    }
                    items={descriptionItems}
                    layout="vertical"
                  />
                </Col>
              </Row>
              <Row
                style={{
                  marginTop: 50,
                }}
              >
                <Col span={24}>
                  <Flex justify="flex-end" gap={10}>
                    {hasPermission(Scope.CanAddPendingItemAnalysis) && (
                      <Button
                        type="primary"
                        variant="outlined"
                        color="red"
                        onClick={() => setIsAddPendingItemModalVisible(true)}
                      >
                        Criar pendência
                      </Button>
                    )}
                    {isApproveDocumentationVisible && (
                      <Button
                        icon={<CheckCircleFilled />}
                        type="primary"
                        variant="solid"
                        color="green"
                        onClick={() =>
                          handleApproveAnalysis(AnalysisType.Documentation)
                        }
                        disabled={
                          approvingAnalisysTypeRef.current ===
                            AnalysisType.Documentation &&
                          approveAnalysisMutation.loading
                        }
                        loading={
                          approvingAnalisysTypeRef.current ===
                            AnalysisType.Documentation &&
                          approveAnalysisMutation.loading
                        }
                      >
                        Aprovar Documentação
                      </Button>
                    )}
                    {isApproveFinancialVisible && (
                      <Button
                        icon={<CheckCircleFilled />}
                        type="primary"
                        variant="solid"
                        color="green"
                        onClick={() =>
                          handleApproveAnalysis(AnalysisType.Financial)
                        }
                        disabled={
                          approvingAnalisysTypeRef.current ===
                            AnalysisType.Financial &&
                          approveAnalysisMutation.loading
                        }
                        loading={
                          approvingAnalisysTypeRef.current ===
                            AnalysisType.Financial &&
                          approveAnalysisMutation.loading
                        }
                      >
                        Aprovar Financeiro
                      </Button>
                    )}
                    {hasPermission(Scope.CanDeletePastor) && (
                      <Button
                        icon={<DeleteFilled />}
                        type="primary"
                        variant="solid"
                        color="danger"
                        disabled={deletePastorMutation.loading}
                        loading={deletePastorMutation.loading}
                        onClick={handleDelete}
                      >
                        Excluir
                      </Button>
                    )}
                  </Flex>
                </Col>
              </Row>
            </>
          )}
        </Card>
        <Collapse style={{ backgroundColor: 'white' }}>
          <Collapse.Panel key="approvals" header="Histórico de Análise">
            <Table
              dataSource={getPastorQuery.data?.pastor.analysis || []}
              pagination={false}
              columns={[
                {
                  title: 'Data',
                  dataIndex: 'date',
                  render: (value) => dayjs(value).format('DD/MM/YYYY'),
                },
                { title: 'Autor', dataIndex: 'author' },
                {
                  title: 'Tipo',
                  dataIndex: 'type',
                  render: (type) =>
                    AnalysisType[type as string as keyof typeof AnalysisType],
                },
                {
                  title: 'Situação',
                  dataIndex: 'approved',
                  render: (approved) => (approved ? 'Aprovado' : 'Pendência'),
                },
                {
                  title: 'Observação',
                  dataIndex: 'reason',
                  render: (reason) => (
                    <Popover content={reason}>
                      <InfoCircleFilled />
                    </Popover>
                  ),
                },
              ]}
            />
          </Collapse.Panel>
        </Collapse>
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
                    ...(getPastorQuery.data?.pastor && {
                      scopes: getPastorQuery.data?.pastor.scopes.join(),
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
                            <Typography.Text strong>
                              {item.title}
                            </Typography.Text>
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
      <AddPendingItemAnalysisModal
        open={isAddPendingItemModalVisible}
        onClose={() => {
          getPastorQuery.refetch();
          setIsAddPendingItemModalVisible(false);
        }}
      />
    </>
  );
}

export default PastorDetailScreen;
