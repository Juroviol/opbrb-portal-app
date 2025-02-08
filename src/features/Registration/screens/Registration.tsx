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
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PASTOR, GET_PASTOR } from '../../../querys/pastorQuery.ts';
import dayjs from 'dayjs';
import Pastor from '../../../models/Pastor.ts';

enum Step {
  PERSONAL_INFORMATION = 'Informações pessoais',
  ADDRESS = 'Endereço',
  CONTACT_INFORMATION = 'Informações de contato',
  MINISTRY = 'Ministério',
  CREDENTIALS = 'Senha',
  ANALYSING = 'Análise',
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
  paymentConfirmation: RcFile;
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

  const queryPastor = useQuery<Pastor>(GET_PASTOR, {
    skip: !localStorage.getItem('id'),
    variables: {
      id: localStorage.getItem('id'),
    },
  });

  const [createPastor, mutationPastor] = useMutation(CREATE_PASTOR);

  useEffect(() => {
    if (queryPastor?.data || mutationPastor.data) {
      if (mutationPastor.data) {
        localStorage.setItem('id', mutationPastor.data.createPastor._id);
      }
      setCurrentStep(5);
    }
  }, [queryPastor.data, mutationPastor.data]);

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
        JSON.stringify(omit(values, ['letter', 'paymentConfirmation']))
      );
      if (steps[currentStep].title !== Step.CREDENTIALS) {
        setCurrentStep(currentStep + 1);
      } else {
        const allFormValues = form.getFieldsValue(true);
        await createPastor({
          variables: {
            ...form.getFieldsValue(true),
            birthday: allFormValues.birthday.format('YYYY-MM-DD'),
            ...(allFormValues.letter && {
              fileLetter: allFormValues.letter.file,
            }),
            ...(allFormValues.paymentConfirmation && {
              filePaymentConfirmation: allFormValues.paymentConfirmation.file,
            }),
          },
        });
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
      {
        title: Step.ANALYSING,
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
      {steps[currentStep].title !== Step.ANALYSING && (
        <Flex justify="center" vertical align="center">
          <Typography.Title level={4}>Formulário de registro</Typography.Title>
          <Typography.Text>
            Por favor, preencha as informações obrigatórias de todas as etapas.
          </Typography.Text>
        </Flex>
      )}
      <Steps
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
                  <MaskedInput mask="00000-000" size="large" />
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
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="number"
                  rules={[required()]}
                  required
                  label="Número"
                >
                  <MaskedInput size="large" mask="[0][0][0][0][0]" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="complement" label="Complemento">
                  <Input size="large" placeholder="Apartamento, Bloco" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="district"
                  required
                  rules={[required()]}
                  label="Bairro"
                >
                  <Input size="large" />
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
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Estado"
                  name="state"
                  rules={[required()]}
                  required
                >
                  <Select size="large" options={UFS} />
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
                  <MaskedInput size="large" mask="+55 (00)00000-0000" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  required
                  label="E-mail"
                  rules={[required(), email]}
                >
                  <Input size="large" />
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
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="ordinanceTime"
                  required
                  rules={[
                    required({
                      type: 'number',
                    }),
                  ]}
                  label="Há quanto tempo é pastor ordenado"
                >
                  <Select
                    size="large"
                    showSearch
                    options={MINISTRY_ORDINANCE_TIME}
                    allowClear
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="letter"
                  label="Carta de recomendação da Igreja"
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    accept=".png,.jpeg,.jpg,.pdf"
                    beforeUpload={handleBeforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>
                      Escolher o arquivo
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="paymentConfirmation"
                  label="Comprovante de pagamento anual"
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    accept=".png,.jpeg,.jpg,.pdf"
                    beforeUpload={handleBeforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>
                      Escolher o arquivo
                    </Button>
                  </Upload>
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
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Confirmar senha"
                  name="confirmPassword"
                  rules={[required(), equalToField('password', 'Senha')]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {steps[currentStep].title === Step.ANALYSING && (
          <>
            <Typography.Title level={4}>
              Seu cadastro foi enviado!
            </Typography.Title>
            <Typography.Paragraph>
              Agradecemos por preencher o formulário. Seus dados serão
              analisados pela nossa equipe, e entraremos em contato assim que a
              avaliação for concluída.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Se tiver alguma dúvida,{' '}
              <a href="https://wa.me/5541966666755" target="_blank">
                entre em contato conosco
              </a>
              .
            </Typography.Paragraph>
            <Typography.Paragraph>Deus abençoe!</Typography.Paragraph>
          </>
        )}
        {steps[currentStep].title !== Step.ANALYSING && (
          <Flex justify="center" style={{ marginTop: 20 }}>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={mutationPastor.loading}
            >
              {currentStep !== steps.length - 1 ? 'Avançar' : 'Concluir'}
            </Button>
          </Flex>
        )}
      </Form>
    </Card>
  );
}
