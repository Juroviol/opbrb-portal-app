import { useQuery } from '@apollo/client';
import { GET_PASTORS } from '@querys/pastorQuery';
import {
  Avatar,
  Breadcrumb,
  Button,
  Empty,
  Flex,
  Spin,
  Table,
  Tag,
} from 'antd';
import Pastor, { Status } from '../../../models/Pastor.ts';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { Scope } from '@models/User';

function PastorsScreen() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(15);
  const getPastorsQuery = useQuery<{
    pastors: { total: number; docs: Pastor[] };
  }>(GET_PASTORS, {
    variables: {
      page: currentPage,
      size,
    },
  });

  const handleOnPaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setSize(size);
  }, []);

  const handleOnDetail = useCallback((id: string) => {
    navigate(`/pastor/${id}`);
  }, []);

  return (
    <Flex vertical gap={30}>
      <Breadcrumb
        items={[
          { title: 'Home' },
          {
            title: 'Pastores',
          },
        ]}
      />
      <Table
        dataSource={getPastorsQuery.data?.pastors.docs}
        pagination={{
          total: getPastorsQuery?.data?.pastors.total,
          onChange: handleOnPaginationChange,
          pageSize: size,
          current: currentPage,
        }}
        loading={
          !!getPastorsQuery.data?.pastors.docs.length && getPastorsQuery.loading
        }
        locale={{
          emptyText: getPastorsQuery.loading ? (
            <Flex justify="center">
              <Spin />
            </Flex>
          ) : (
            <Empty description="Sem dados" />
          ),
        }}
        columns={[
          {
            title: '',
            dataIndex: 'pictureUrl',
            render: (value) => (
              <Avatar
                src={`${import.meta.env.VITE_ASSETS_URL}/${value}`}
                icon={<UserOutlined />}
                size={80}
              />
            ),
          },
          {
            title: 'Nome',
            dataIndex: 'name',
          },
          {
            title: 'Celular',
            dataIndex: 'cellPhone',
          },
          {
            title: 'Igreja',
            dataIndex: 'church',
          },
          {
            title: 'Cadastrado em',
            dataIndex: 'createdAt',
            render: (value) => dayjs(value).format('DD/MM/YYYY'),
          },
          ...(hasPermission(Scope.CanDetailPastor)
            ? [
                {
                  title: 'Situação',
                  dataIndex: 'status',
                  render: (value: Status) => (
                    <Tag
                      color={
                        {
                          [Status.APPROVED]: 'green',
                          [Status.ANALYSING]: 'yellow',
                        }[value]
                      }
                    >
                      {value}
                    </Tag>
                  ),
                },
              ]
            : []),
          {
            title: '',
            dataIndex: '_id',
            render(_id) {
              return (
                <Flex gap={5}>
                  {hasPermission(Scope.CanDetailPastor) && (
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => handleOnDetail(_id)}
                    />
                  )}
                </Flex>
              );
            },
          },
        ]}
      />
    </Flex>
  );
}

export default PastorsScreen;
