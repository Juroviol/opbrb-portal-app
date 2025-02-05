import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Steps,
  Typography,
  Upload,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LogoEscritoTransparente from '@assets/logo_escrito_transparente.png';
import {
  email,
  equalToField,
  isCEP,
  isCPF,
  required,
} from '../../../validators.ts';
import MaskedInput from '@components/MaskedInput';
import { omit, range } from 'lodash';
import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';
import { useMutation } from '@apollo/client';
import { CREATE_PASTOR } from '../../../querys/pastorQuery.ts';
import dayjs from 'dayjs';

enum Step {
  PERSONAL_INFORMATION = 'Informações pessoais',
  ADDRESS = 'Endereço',
  CONTACT_INFORMATION = 'Informações de contato',
  MINISTRY = 'Ministério',
  CREDENTIALS = 'Senha',
}

type FormFields = {
  name: string;
  cpf: string;
  email: string;
  password: string;
  zipCode: string;
  street: string;
  city: string;
  state: string;
  number: string;
  district: string;
  letter: RcFile;
};

const UFS = [
  { label: 'Acre', value: 'Acre' },
  { label: 'Alagoas', value: 'Alagoas' },
  { label: 'Amapá', value: 'Amapá' },
  { label: 'Amazonas', value: 'Amazonas' },
  { label: 'Bahia', value: 'Bahia' },
  { label: 'Ceará', value: 'Ceará' },
  { label: 'Distrito Federal', value: 'Distrito Federal' },
  { label: 'Espírito Santo', value: 'Espírito Santo' },
  { label: 'Goiás', value: 'Goiás' },
  { label: 'Maranhão', value: 'Maranhão' },
  { label: 'Mato Grosso', value: 'Mato Grosso' },
  { label: 'Mato Grosso do Sul', value: 'Mato Grosso do Sul' },
  { label: 'Minas Gerais', value: 'Minas Gerais' },
  { label: 'Pará', value: 'Pará' },
  { label: 'Paraíba', value: 'Paraíba' },
  { label: 'Paraná', value: 'Paraná' },
  { label: 'Pernambuco', value: 'Pernambuco' },
  { label: 'Piauí', value: 'Piauí' },
  { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
  { label: 'Rio Grande do Norte', value: 'Rio Grande do Norte' },
  { label: 'Rio Grande do Sul', value: 'Rio Grande do Sul' },
  { label: 'Rondônia', value: 'Rondônia' },
  { label: 'Roraima', value: 'Roraima' },
  { label: 'Santa Catarina', value: 'Santa Catarina' },
  { label: 'São Paulo', value: 'São Paulo' },
  { label: 'Sergipe', value: 'Sergipe' },
  { label: 'Tocantins', value: 'Tocantins' },
];

const MINISTRY_ORDINANCE_TIME = [
  ...range(1, 12).map((v) => ({
    label: `${v} ${v > 1 ? 'meses' : 'mês'}`,
    value: v,
  })),
  ...range(1, 101).map((v) => ({
    label: `${v} ${v > 1 ? 'anos' : 'ano'}`,
    value: v * 12,
  })),
];

export default function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<FormFields>();

  const [createPastor, { loading }] = useMutation(CREATE_PASTOR);

  useEffect(() => {
    if (localStorage.getItem(steps[currentStep].title)) {
      const values = JSON.parse(
        localStorage.getItem(steps[currentStep].title) as string
      );
      if (values.birthday) {
        values.birthday = dayjs(values.birthday);
      }
      form.setFieldsValue(values);
    }
  }, [currentStep]);

  const handleBeforeUpload = useCallback(() => {
    return false;
  }, []);

  const handleValuesChange = useCallback(
    ({ zipCode }: { zipCode: string }) => {
      if (zipCode) {
        const unmaskedZipCode = zipCode.replace(/[^\d]/g, '');
        if (unmaskedZipCode && unmaskedZipCode.length === 8) {
          fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
            .then((res) => res.json())
            .then((json) => {
              form.setFieldsValue({
                street: json.logradouro,
                city: json.localidade,
                state: json.estado,
                district: json.bairro,
              });
            });
        }
      }
    },
    [form]
  );

  const handleFinish = useCallback(
    async (values: object) => {
      localStorage.setItem(
        steps[currentStep].title,
        JSON.stringify(omit(values, 'letter'))
      );
      if (steps[currentStep].title !== Step.CREDENTIALS) {
        setCurrentStep(currentStep + 1);
      } else {
        const {
          letter: { file },
          birthday,
        } = form.getFieldsValue(true);
        const payload = {
          variables: {
            ...form.getFieldsValue(true),
            birthday: birthday.format('YYYY-MM-DD'),
            file,
          },
        };
        console.log(payload);
        const { data } = await createPastor(payload);
        console.log(data);
      }
    },
    [currentStep, createPastor]
  );

  const steps = useMemo(
    () => [
      {
        title: Step.PERSONAL_INFORMATION,
      },
      {
        title: Step.ADDRESS,
      },
      {
        title: Step.CONTACT_INFORMATION,
      },
      {
        title: Step.MINISTRY,
      },
      {
        title: Step.CREDENTIALS,
      },
    ],
    []
  );

  return (
    <Card style={{ width: 700, marginBlock: 20 }}>
      <Flex vertical style={{ width: '100%' }} justify="center" align="center">
        <img src={LogoEscritoTransparente} height={150} />
        <Divider style={{ margin: 0 }} />
      </Flex>
      <Flex justify="center" vertical align="center">
        <Typography.Title level={4}>Formulário de registro</Typography.Title>
        <Typography.Text>
          Por favor, preencha as informações obrigatórias de todas as etapas.
        </Typography.Text>
      </Flex>
      <Steps
        size="small"
        current={currentStep}
        labelPlacement="vertical"
        items={steps}
        style={{ marginTop: 30, marginBottom: 40 }}
      />
      <Form
        preserve
        form={form}
        onValuesChange={handleValuesChange}
        onFinish={handleFinish}
        layout="vertical"
      >
        {steps[currentStep].title === Step.PERSONAL_INFORMATION && (
          <>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="name"
                  rules={[required()]}
                  required
                  label="Nome completo"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item name="cpf" required label="CPF" rules={[isCPF]}>
                  <MaskedInput mask="000.000.000-00" />
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
          </>
        )}
        {steps[currentStep].title === Step.ADDRESS && (
          <>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="zipCode"
                  required
                  rules={[required(), isCEP]}
                  label="CEP"
                >
                  <MaskedInput mask="00000-000" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={18}>
                <Form.Item
                  name="street"
                  rules={[required()]}
                  required
                  label="Logradouro"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="number"
                  rules={[required()]}
                  required
                  label="Número"
                >
                  <MaskedInput mask="[0][0][0][0][0]" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="complement" label="Complemento">
                  <Input placeholder="Apartamento, Bloco" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="district"
                  required
                  rules={[required()]}
                  label="Bairro"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  label="Cidade"
                  name="city"
                  rules={[required()]}
                  required
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Estado"
                  name="state"
                  rules={[required()]}
                  required
                >
                  <Select options={UFS} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {steps[currentStep].title === Step.CONTACT_INFORMATION && (
          <>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="cellPhone"
                  required
                  rules={[required()]}
                  label="Celular"
                >
                  <MaskedInput mask="+55 (00)00000-0000" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  required
                  label="E-mail"
                  rules={[required(), email]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {steps[currentStep].title === Step.MINISTRY && (
          <>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="church"
                  required
                  rules={[required()]}
                  label="Igreja onde é pastor"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="ordinanceTime"
                  required
                  label="Há quanto tempo é pastor ordenado"
                >
                  <Select
                    showSearch
                    options={MINISTRY_ORDINANCE_TIME}
                    allowClear
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="letter"
                  label="Carta de recomendação"
                  rules={[
                    required({
                      type: 'file',
                    }),
                  ]}
                  required
                >
                  <Upload.Dragger
                    accept=".png,.jpeg,.jpg,.pdf"
                    beforeUpload={handleBeforeUpload}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Clique ou arraste o arquivo nesta área
                    </p>
                    <p className="ant-upload-hint">
                      Apenas os formatos .png, .jpeg, .jpg e .pdf são
                      permitidos.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {steps[currentStep].title === Step.CREDENTIALS && (
          <>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="Senha" name="password" rules={[required()]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Confirmar senha"
                  name="confirmPassword"
                  rules={[required(), equalToField('password', 'Senha')]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <Flex justify="center" style={{ marginTop: 20 }}>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={loading}
          >
            {currentStep !== steps.length - 1 ? 'Avançar' : 'Concluir'}
          </Button>
        </Flex>
      </Form>
    </Card>
  );
}
