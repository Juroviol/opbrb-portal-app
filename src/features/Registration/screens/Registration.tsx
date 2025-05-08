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
  fileSize,
  isCEP,
  isCPF,
  required,
} from '@validators';
import MaskedInput from '@components/MaskedInput';
import { omit } from 'lodash';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PASTOR, GET_PASTOR } from '@querys/pastorQuery';
import dayjs from 'dayjs';
import Pastor from '@models/Pastor';
import { MINISTRY_ORDINANCE_TIME, UFS } from '@consts';
import Picture3_4 from '@assets/3_4.webp';

enum Step {
  PERSONAL_INFORMATION = 'Informações pessoais',
  ADDRESS = 'Endereço',
  CONTACT_INFORMATION = 'Informações de contato',
  MINISTRY = 'Ministério',
  ORDER_CARD = 'Carteirinha da ordem',
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
  picture: RcFile;
  ordinationMinutes: RcFile;
  letter: RcFile;
  paymentConfirmation: RcFile;
  cpfRg: RcFile;
};

export default function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<FormFields>();

  const queryPastor = useQuery<{ getPastor: Pastor }>(GET_PASTOR, {
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
      setCurrentStep(6);
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
  }, [form]);

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
        JSON.stringify(
          omit(values, [
            'letter',
            'paymentConfirmation',
            'ordinationMinutes',
            'picture',
            'cpfRg',
          ])
        )
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
            ...(allFormValues.ordinationMinutes && {
              fileOrdinationMinutes: allFormValues.ordinationMinutes.file,
            }),
            ...(allFormValues.picture && {
              filePicture: allFormValues.picture.file,
            }),
            ...(allFormValues.paymentConfirmation && {
              filePaymentConfirmation: allFormValues.paymentConfirmation.file,
            }),
            ...(allFormValues.cpfRg && {
              fileCpfRg: allFormValues.cpfRg.file,
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
      { title: Step.ORDER_CARD },
      {
        title: Step.CREDENTIALS,
      },
      {
        title: Step.ANALYSING,
      },
    ],
    []
  );

  console.log(queryPastor.data);

  return (
    <Card
      style={{ width: 800, marginBlock: 20 }}
      loading={!!localStorage.getItem('id') && !queryPastor.data?.getPastor}
    >
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
                  noStyle
                  shouldUpdate={(prevValues, nextValues) =>
                    prevValues.ordinationMinutes !==
                    nextValues.ordinationMinutes
                  }
                >
                  {(formInstance) => (
                    <Form.Item
                      name="ordinationMinutes"
                      label="Ata de ordenação"
                      rules={[fileSize('ordinationMinutes')]}
                    >
                      <Upload
                        multiple={false}
                        maxCount={1}
                        accept=".png,.jpeg,.jpg,.pdf"
                        beforeUpload={handleBeforeUpload}
                        showUploadList={
                          !!formInstance.getFieldValue('ordinationMinutes')
                        }
                        onRemove={() => {
                          formInstance.setFieldValue(
                            'ordinationMinutes',
                            undefined
                          );
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          Escolher o arquivo
                        </Button>
                      </Upload>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, nextValues) =>
                    prevValues.letter !== nextValues.letter
                  }
                >
                  {(formInstance) => (
                    <Form.Item
                      name="letter"
                      label="Carta de recomendação da Igreja"
                      rules={[fileSize('letter')]}
                    >
                      <Upload
                        multiple={false}
                        maxCount={1}
                        accept=".png,.jpeg,.jpg,.pdf"
                        beforeUpload={handleBeforeUpload}
                        showUploadList={!!formInstance.getFieldValue('letter')}
                        onRemove={() => {
                          formInstance.setFieldValue('letter', undefined);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          Escolher o arquivo
                        </Button>
                      </Upload>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, nextValues) =>
                    prevValues.paymentConfirmation !==
                    nextValues.paymentConfirmation
                  }
                >
                  {(formInstance) => (
                    <Form.Item
                      name="paymentConfirmation"
                      label="Comprovante de pagamento anual"
                      rules={[fileSize('paymentConfirmation')]}
                    >
                      <Upload
                        multiple={false}
                        maxCount={1}
                        accept=".png,.jpeg,.jpg,.pdf"
                        beforeUpload={handleBeforeUpload}
                        showUploadList={
                          !!formInstance.getFieldValue('paymentConfirmation')
                        }
                        onRemove={() => {
                          formInstance.setFieldValue(
                            'paymentConfirmation',
                            undefined
                          );
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          Escolher o arquivo
                        </Button>
                      </Upload>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, nextValues) =>
                    prevValues.cpfRg !== nextValues.cpfRg
                  }
                >
                  {(formInstance) => (
                    <Form.Item
                      name="cpfRg"
                      label="Cópia do CPF/RG"
                      rules={[fileSize('cpfRg')]}
                    >
                      <Upload
                        multiple={false}
                        maxCount={1}
                        accept=".png,.jpeg,.jpg,.pdf"
                        beforeUpload={handleBeforeUpload}
                        showUploadList={!!formInstance.getFieldValue('cpfRg')}
                        onRemove={() => {
                          formInstance.setFieldValue('cpfRg', undefined);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          Escolher o arquivo
                        </Button>
                      </Upload>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {steps[currentStep].title === Step.ORDER_CARD && (
          <Row>
            <Col span={24}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, nextValues) =>
                  prevValues.picture !== nextValues.picture
                }
              >
                {(formInstance) => (
                  <Form.Item name="picture" rules={[fileSize('picture')]}>
                    <Upload.Dragger
                      beforeUpload={() => false}
                      showUploadList={!!formInstance.getFieldValue('picture')}
                      fileList={
                        formInstance.getFieldValue('picture')
                          ? [
                              {
                                uid: (
                                  formInstance.getFieldValue('picture') as {
                                    file: RcFile;
                                  }
                                ).file.uid,
                                name: (
                                  formInstance.getFieldValue('picture') as {
                                    file: RcFile;
                                  }
                                ).file.name,
                              },
                            ]
                          : []
                      }
                      onRemove={() => {
                        formInstance.setFieldValue('picture', undefined);
                        return false;
                      }}
                    >
                      {!formInstance.getFieldValue('picture') && (
                        <>
                          <div
                            style={{
                              margin: 'auto',
                              width: 300,
                              height: 350,
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <img
                              style={{
                                position: 'absolute',
                                top: -55,
                                left: -80,
                              }}
                              src={Picture3_4}
                              width={400}
                            />
                          </div>
                          <p className="ant-upload-text">
                            Clique ou arraste o arquivo da foto para esta área.
                          </p>
                          <p className="ant-upload-text">
                            A foto deve ter formato 3x4 com fundo branco.
                          </p>
                        </>
                      )}
                      {formInstance.getFieldValue('picture')?.file && (
                        <img
                          width={300}
                          src={URL.createObjectURL(
                            formInstance.getFieldValue('picture').file
                          )}
                        />
                      )}
                    </Upload.Dragger>
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>
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
              Se tiver alguma dúvida, entre em contato pelo e-mail{' '}
              <a href="mailto:contato@opbrb.com.br" target="_blank">
                contato@opbrb.com.br
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
