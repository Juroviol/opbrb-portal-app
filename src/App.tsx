import { Avatar, Divider, Dropdown, Flex, Layout, Menu } from 'antd';
import {
  DownOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import LogoTransparent from '@assets/logo_transparente.png';
import { useAuth } from './contexts/AuthContext.tsx';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Login from '@features/Login/screens/Login.tsx';
import RedirectRoute from './components/RedirectRoute.tsx';
import Registration from '@features/Registration/screens/Registration.tsx';
import Profile from '@features/Profile/screens/Profile.tsx';
import Pastors from '@features/Pastors/screens/Pastors.tsx';
import PastorDetail from '@features/PastorDetail/screens/PastorDetail.tsx';
import { Scope } from './models/User.ts';
import PersonalInformation from '@features/Profile/screens/PersonalInformation.tsx';
import Address from '@features/Profile/screens/Address.tsx';
import ContactInformation from '@features/Profile/screens/ContactInformation.tsx';
import Ministry from '@features/Profile/screens/Ministry.tsx';
import Credentials from '@features/Profile/screens/Credentials.tsx';
import { useCallback, useState } from 'react';
import { debounce, throttle } from 'lodash';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const { user, hasPermission, logout } = useAuth();

  const onMouseOver = useCallback(() => {
    if (collapsed) setCollapsed(false);
  }, [collapsed]);

  const onMouseLeave = useCallback(() => {
    if (!collapsed) setCollapsed(true);
  }, [collapsed]);

  if (!user) {
    return (
      <Flex
        style={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'rgb(244, 233, 232)',
        }}
        justify="center"
        align="center"
      >
        <Routes>
          <Route path="" element={<RedirectRoute to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registration />} />
          <Route path="*" element={<RedirectRoute to="/login" />} />
        </Routes>
      </Flex>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
        collapsed={collapsed}
        defaultCollapsed
        onMouseOver={throttle(debounce(onMouseOver, 100), 200)}
        onMouseLeave={throttle(debounce(onMouseLeave, 100), 200)}
      >
        <Flex
          vertical
          style={{
            width: '100%',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={LogoTransparent} style={{ height: 64 }} />
          <Divider style={{ margin: '0' }} />
        </Flex>
        <Menu
          defaultSelectedKeys={['pastores']}
          selectedKeys={[
            ...(location.pathname.includes('pastor') ? ['pastors'] : []),
            ...(location.pathname.includes('minha-conta') ? ['profile'] : []),
          ]}
          mode="inline"
          items={[
            ...(hasPermission(Scope.CanListPastors)
              ? [
                  {
                    key: 'profile',
                    label: 'Minha conta',
                    icon: <UserOutlined />,
                    onClick: () =>
                      navigate('/minha-conta/informacoes-pessoais'),
                  },
                  {
                    label: <Link to="/pastores">Pastores</Link>,
                    key: 'pastors',
                    icon: <TeamOutlined />,
                  },
                ]
              : []),
          ]}
        />
      </Layout.Sider>
      <Layout onMouseOver={throttle(debounce(onMouseLeave, 100), 200)}>
        <Layout.Header
          style={{
            paddingInline: 16,
            boxShadow:
              '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          }}
        >
          <Flex
            justify="flex-end"
            align="center"
            style={{ height: '100%' }}
            gap={5}
          >
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: 'Minha Conta',
                    icon: <UserOutlined />,
                    onClick: () =>
                      navigate('/minha-conta/informacoes-pessoais'),
                  },
                  {
                    key: 'logout',
                    label: 'Sair',
                    icon: <LogoutOutlined />,
                    onClick: logout,
                  },
                ],
              }}
            >
              <Flex gap={4}>
                <Avatar icon={<UserOutlined />} size="large" />
                <DownOutlined style={{ fontSize: 10 }} />
              </Flex>
            </Dropdown>
          </Flex>
        </Layout.Header>
        <Layout.Content style={{ margin: 16, overflowY: 'auto' }}>
          <Routes>
            <Route
              path=""
              element={
                <RedirectRoute
                  to={
                    hasPermission(Scope.CanListPastors)
                      ? '/pastores'
                      : '/minha-conta'
                  }
                />
              }
            />
            <Route path="/minha-conta" element={<Profile />}>
              <Route
                path="informacoes-pessoais"
                element={<PersonalInformation />}
              />
              <Route path="endereco" element={<Address />} />
              <Route
                path="informacoes-contato"
                element={<ContactInformation />}
              />
              <Route path="ministerio" element={<Ministry />} />
              <Route path="senha" element={<Credentials />} />
            </Route>
            {hasPermission(Scope.CanListPastors) && (
              <Route path="/pastores" element={<Pastors />} />
            )}
            {hasPermission(Scope.CanDetailPastor) && (
              <Route path="/pastor/:id" element={<PastorDetail />} />
            )}
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;
