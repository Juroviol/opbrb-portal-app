import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
} from 'antd';
import { isCPF, required } from '../../../validators.ts';
import MaskedInput from '@components/MaskedInput';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_PASTOR_PERSONAL_INFO,
  UPDATE_PASTOR_PERSONAL_INFO,
} from '../../../querys/pastorQuery.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { MaritalStatus } from '../../../models/Pastor.ts';

function PersonalInformation() {
  const { user } = useAuth();
  const [updatePersonalInfo, updatePersonalInfoMutation] = useMutation(
    UPDATE_PASTOR_PERSONAL_INFO
  );
  const getPersonalInfoQuery = useQuery(GET_PASTOR_PERSONAL_INFO, {
    variables: {
      id: user?._id,
    },
  });

  useEffect(() => {
    if (updatePersonalInfoMutation.data?.updatePastorPersonalInfo) {
      notification.success({
        message: 'Informações pessoais atualizadas com sucesso!',
      });
    }
  }, [updatePersonalInfoMutation.data]);

  const onFinish = useCallback(
    (values: {
      name: string;
      cpf: string;
      birthday: dayjs.Dayjs;
      maritalStatus: MaritalStatus;
    }) => {
      updatePersonalInfo({
        variables: {
          _id: user?._id,
          ...values,
          birthday: values.birthday.format('YYYY-MM-DD'),
        },
      });
    },
    [user]
  );

  return (
    <Card loading={getPersonalInfoQuery.loading}>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...(getPersonalInfoQuery.data?.getPastor && {
            ...getPersonalInfoQuery.data.getPastor,
            birthday: dayjs(getPersonalInfoQuery.data.getPastor.birthday),
          }),
        }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              name="name"
              rules={[required()]}
              required
              label="Nome completo"
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={8}>
            <Form.Item name="cpf" required label="CPF" rules={[isCPF]}>
              <MaskedInput size="large" mask="000.000.000-00" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="maritalStatus"
              required
              label="Estado civil"
              rules={[required()]}
            >
              <Select
                size="large"
                options={[
                  {
                    label: 'Casado',
                    value: 'Married',
                  },
                  {
                    label: 'Solteiro',
                    value: 'Single',
                  },
                  {
                    label: 'Viúvo',
                    value: 'Widower',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="birthday"
              required
              label="Data de nascimento"
              rules={[required({ type: 'date' })]}
            >
              <DatePicker
                size="large"
                placeholder=""
                format={{
                  format: 'DD/MM/YYYY',
                  type: 'mask',
                }}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={updatePersonalInfoMutation.loading}
            >
              Atualizar
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default PersonalInformation;
