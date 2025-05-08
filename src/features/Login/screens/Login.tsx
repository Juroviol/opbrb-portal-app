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
import { required } from '@validators';
import { useMutation } from '@apollo/client';
import { AUTHENTICATE } from '@querys/userQuery';
import { useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { handleLoginData } = useAuth();

  const [authenticate, { loading }] = useMutation<{
    authenticate: { token: string };
  }>(AUTHENTICATE);

  const handleOnFinish = useCallback(async (values: object) => {
    const { data } = await authenticate({
      variables: values,
    });
    if (data) {
      localStorage.setItem('accessToken', data?.authenticate.token);
      handleLoginData();
    }
  }, []);

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
      <Form layout="vertical" onFinish={handleOnFinish}>
        <Form.Item name="username" label="Usuário" rules={[required()]}>
          <Input placeholder="CPF ou E-mail" size="large" />
        </Form.Item>
        <Form.Item name="password" label="Senha" rules={[required()]}>
          <Input.Password size="large" />
        </Form.Item>
        <Flex
          style={{ width: '100%', marginTop: 10, marginBottom: 30 }}
          justify="flex-start"
          align="center"
        >
          <Form.Item name="rememberMe" noStyle>
            <Checkbox>Manter-me conectado</Checkbox>
          </Form.Item>
        </Flex>
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          style={{ width: '100%' }}
          loading={loading}
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
