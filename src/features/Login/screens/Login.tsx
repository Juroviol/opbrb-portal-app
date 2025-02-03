import {
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Typography,
} from 'antd';
import LogoEscritoTransparente from '@assets/logo_escrito_transparente.png';
import { useNavigate } from 'react-router-dom';
import { required } from '../../../validators.ts';

export default function Login() {
  const navigate = useNavigate();
  return (
    <Card>
      <Flex
        vertical
        style={{ width: '100%', marginBottom: 25 }}
        justify="center"
        align="center"
      >
        <img src={LogoEscritoTransparente} height={150} />
        <Divider style={{ marginTop: 0, marginBottom: 20 }} />
        <Typography.Text>
          Por favor, insira seus dados abaixo para acessar o portal.
        </Typography.Text>
      </Flex>
      <Form layout="vertical">
        <Form.Item name="username" label="Usuário" rules={[required()]}>
          <Input placeholder="CPF ou E-mail" size="large" />
        </Form.Item>
        <Form.Item name="password" label="Senha" rules={[required()]}>
          <Input.Password size="large" />
        </Form.Item>
        <Flex
          style={{ width: '100%', marginTop: 10, marginBottom: 30 }}
          justify="space-between"
          align="center"
        >
          <Form.Item name="rememberMe" noStyle>
            <Checkbox>Manter-me conectado</Checkbox>
          </Form.Item>
          <Typography.Link>Esqueci minha senha</Typography.Link>
        </Flex>
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          style={{ width: '100%' }}
        >
          Entrar
        </Button>
        <Flex gap={5} style={{ marginTop: 15, width: '100%' }} justify="center">
          <Typography.Text>Não tem uma conta ainda?</Typography.Text>
          <Typography.Link onClick={() => navigate('/registro')}>
            Faça seu cadastro agora!
          </Typography.Link>
        </Flex>
      </Form>
    </Card>
  );
}
