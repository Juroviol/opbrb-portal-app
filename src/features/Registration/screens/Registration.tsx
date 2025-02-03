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
} from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { useCallback, useMemo, useState } from 'react';
import LogoEscritoTransparente from '@assets/logo_escrito_transparente.png';
import { email, isCPF, required } from '../../../validators.ts';

enum Step {
  PERSONAL_INFORMATION = 'Informações pessoais',
  ADDRESS = 'Endereço',
  CONTACT_INFORMATION = 'Informações de contato',
  RECOMENDATION_LETTER = 'Carta de recomendação',
  CREDENTIALS = 'Credenciais',
}

export default function Registration() {
  const [currentStep] = useState(0);
  const [form] = Form.useForm<{
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
  }>();

  const handleValuesChange = useCallback(
    ({ zipCode }: { zipCode: string }) => {
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
    },
    [form]
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
        title: Step.RECOMENDATION_LETTER,
      },
      {
        title: Step.CREDENTIALS,
      },
    ],
    []
  );

  return (
    <Card style={{ width: 700 }}>
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
      <Form form={form} onValuesChange={handleValuesChange} layout="vertical">
        {steps[currentStep].title === Step.PERSONAL_INFORMATION && (
          <>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  rules={[required()]}
                  required
                  label="Nome completo"
                >
                  <Input />
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
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item name="cpf" required label="CPF" rules={[isCPF()]}>
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
                        value: 'casado',
                      },
                      {
                        label: 'Solteiro',
                        value: 'solteiro',
                      },
                      {
                        label: 'Viúvo',
                        value: 'viuvo',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="birthdate"
                  required
                  label="Data de nascimento"
                  rules={[required()]}
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
                <Form.Item name="zipCode" required label="CEP">
                  <MaskedInput mask="00000-000" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={18}>
                <Form.Item name="street" required label="Logradouro">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="number" required label="Número">
                  <Input />
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
                <Form.Item name="district" required label="Bairro">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="Cidade" name="city" required>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Estado" name="state" required>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {steps[currentStep].title === Step.CONTACT_INFORMATION && (
          <>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="cellphone" required label="Celular">
                  <MaskedInput mask="+55 (00)00000-0000" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="church" required label="Igreja onde é pastor">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="ordinanceTime"
                  required
                  label="Há quanto tempo é pastor ordenado"
                >
                  <Select />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <Flex justify="center" style={{ marginTop: 20 }}>
          <Button htmlType="submit" type="primary" size="large">
            {currentStep !== steps.length - 1 ? 'Avançar' : 'Concluir'}
          </Button>
        </Flex>
      </Form>
    </Card>
  );
}
