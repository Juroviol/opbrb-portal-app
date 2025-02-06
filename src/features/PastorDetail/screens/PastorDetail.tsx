import { useQuery } from '@apollo/client';
import { GET_PASTOR } from '../../../querys/pastorQuery.ts';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Flex,
  Tag,
  Typography,
} from 'antd';
import Pastor, { Status } from '../../../models/Pastor.ts';
import dayjs from 'dayjs';
import { DownloadOutlined } from '@ant-design/icons';
import { useCallback, useMemo } from 'react';

function PastorDetail() {
  const params = useParams();
  const { loading, data } = useQuery<{ getPastor: Pastor }>(GET_PASTOR, {
    variables: {
      id: params.id,
    },
  });

  const handleDownload = useCallback((url: string) => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_ASSETS_URL}/${url}`;
    link.download = url.split('/').pop() as string;
    link.click();
    link.parentNode?.removeChild(link);
  }, []);

  const descriptionItems = useMemo(() => {
    if (data) {
      return [
        { key: 'cpf', label: 'CPF', children: data.getPastor.cpf },
        {
          key: 'birthday',
          label: 'Data de nascimento',
          children: dayjs(data?.getPastor?.birthday).format('DD/MM/YYYY'),
          span: 2,
        },
        {
          key: 'maritalStatus',
          label: 'Estado civil',
          children: data?.getPastor.maritalStatus,
        },
        {
          key: 'email',
          label: 'E-mail',
          children: data?.getPastor?.email,
        },
        {
          key: 'cellPhone',
          label: 'Celular',
          children: data?.getPastor?.cellPhone,
          span: 3,
        },
        {
          key: 'zipCode',
          label: 'CEP',
          children: data?.getPastor?.zipCode,
        },
        {
          key: 'address',
          label: 'Endereço',
          children: `${data?.getPastor.street}, ${data?.getPastor.number} - ${data?.getPastor.district}, ${data?.getPastor.city} - ${data?.getPastor.state}`,
          span: 3,
        },
        {
          key: 'church',
          label: 'Igreja',
          children: data?.getPastor.church,
        },
        {
          key: 'ordinanceTime',
          label: 'Ordenado há',
          children: data?.getPastor.ordinanceTime,
          span: 3,
        },
        {
          key: 'recommendationLetter',
          label: 'Carta de recomendação',
          children: (
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                handleDownload(data?.getPastor.recommendationLetterUrl)
              }
            />
          ),
          span: 2,
        },
        ...(data.getPastor.paymentConfirmationUrl
          ? [
              {
                key: 'recommendationLetter',
                label: 'Comprovante de pagamento anual',
                children: (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(data?.getPastor.paymentConfirmationUrl)
                    }
                  />
                ),
                span: 2,
              },
            ]
          : []),
      ];
    }
    return [];
  }, [data]);

  return (
    <Flex vertical gap={10}>
      <Breadcrumb
        items={[
          {
            title: <Link to="/pastores">Pastores</Link>,
          },
          {
            title: data?.getPastor.name,
          },
        ]}
      />
      <Card loading={loading}>
        {!!data && (
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
                  {data?.getPastor.name}
                </Typography.Text>
                <Tag
                  color={
                    {
                      [Status.APPROVED]: 'green',
                      [Status.ANALYSING]: 'yellow',
                    }[data!.getPastor.status]
                  }
                >
                  {data?.getPastor.status}
                </Tag>
              </Flex>
            }
            items={descriptionItems}
            layout="vertical"
          />
        )}
      </Card>
    </Flex>
  );
}

export default PastorDetail;
