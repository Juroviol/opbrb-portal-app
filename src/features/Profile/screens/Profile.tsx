import { Breadcrumb, Flex, Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import {
  BookOutlined,
  HomeOutlined,
  LockOutlined,
  PhoneOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

function Profile() {
  const location = useLocation();

  const selectedMenuKeys = useMemo(() => {
    return [
      ...(location.pathname.includes('informacoes-pessoais')
        ? ['personal-information']
        : []),
      ...(location.pathname.includes('endereco') ? ['address'] : []),
      ...(location.pathname.includes('informacoes-contato')
        ? ['contact-information']
        : []),
      ...(location.pathname.includes('ministerio') ? ['ministry'] : []),
      ...(location.pathname.includes('senha') ? ['credentials'] : []),
    ];
  }, [location.pathname]);
  return (
    <Flex vertical gap={10}>
      <Breadcrumb
        items={[
          { title: 'Home' },
          {
            title: 'Minha Conta',
          },
        ]}
      />
      <Layout>
        <Layout.Sider
          width={240}
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            background: 'white',
            height: 'calc(100vh - 96px)',
          }}
        >
          <Menu
            selectedKeys={selectedMenuKeys}
            mode="inline"
            items={[
              {
                label: (
                  <Link to="informacoes-pessoais">Informações pessoais</Link>
                ),
                icon: <SolutionOutlined />,
                key: 'personal-information',
              },
              {
                label: <Link to="endereco">Endereço</Link>,
                icon: <HomeOutlined />,
                key: 'address',
              },
              {
                label: (
                  <Link to="informacoes-contato">Informações de contato</Link>
                ),
                icon: <PhoneOutlined />,
                key: 'contact-information',
              },
              {
                label: <Link to="ministerio">Ministério</Link>,
                icon: <BookOutlined />,
                key: 'ministry',
              },
              {
                label: <Link to="senha">Senha</Link>,
                icon: <LockOutlined />,
                key: 'credentials',
              },
            ]}
          />
        </Layout.Sider>
        <Layout.Content style={{ marginLeft: 16 }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Flex>
  );
}

export default Profile;
