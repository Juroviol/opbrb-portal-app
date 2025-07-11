import { Card, Empty, Popover, Table } from 'antd';
import dayjs from 'dayjs';
import Pastor, { AnalysisType } from '@models/Pastor.ts';
import { InfoCircleFilled } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GET_PASTOR_ANALYSIS_HISTORY } from '@querys/pastorQuery.ts';
import { useAuth } from '@contexts/AuthContext.tsx';

function HistoryAnalysis() {
  const { user } = useAuth();
  const query = useQuery<{ pastor: Pastor }>(GET_PASTOR_ANALYSIS_HISTORY, {
    variables: {
      _id: user?._id,
    },
  });
  return (
    <Card loading={query.loading}>
      <Table
        dataSource={query.data?.pastor.analysis || []}
        pagination={false}
        locale={{
          emptyText: <Empty description="Sem dados" />,
        }}
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
    </Card>
  );
}

export default HistoryAnalysis;
