import { Avatar, Divider, Dropdown, Flex, Layout, Menu, Spin } from 'antd';
import {
  DownOutlined,
  LogoutOutlined,
  TeamOutlined,
  UnlockOutlined,
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
import LoginScreen from '@features/Login/screens/LoginScreen.tsx';
import RedirectRoute from './components/RedirectRoute.tsx';
import RegistrationScreen from '@features/Registration/screens/RegistrationScreen.tsx';
import MyAccountScreen from '@features/MyAccount/screens/MyAccountScreen.tsx';
import PastorsScreen from '@features/Pastors/screens/PastorsScreen.tsx';
import PastorDetailScreen from '@features/Pastors/screens/PastorDetailScreen.tsx';
import { Scope } from './models/User.ts';
import PersonalInformation from '@features/MyAccount/screens/PersonalInformation.tsx';
import Address from '@features/MyAccount/screens/Address.tsx';
import ContactInformation from '@features/MyAccount/screens/ContactInformation.tsx';
import Ministry from '@features/MyAccount/screens/Ministry.tsx';
import Credentials from '@features/MyAccount/screens/Credentials.tsx';
import { useCallback, useMemo, useState } from 'react';
import { debounce, throttle } from 'lodash';
import OrderCard from '@features/MyAccount/screens/OrderCard.tsx';
import ProfileScreen from '@features/Profiles/screens/ProfileScreen.tsx';
import CreateOrEditProfileScreen from '@features/Profiles/screens/CreateOrEditProfileScreen.tsx';
import HistoryAnalysis from '@features/MyAccount/screens/HistoryAnalysis.tsx';

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

  const hasMyAccountAccess = useMemo(
    () =>
      hasPermission(Scope.CanEditAccountPersonalInfo) ||
      hasPermission(Scope.CanEditAccountAddress) ||
      hasPermission(Scope.CanEditAccountContactInfo) ||
      hasPermission(Scope.CanEditAccountMinistry) ||
      hasPermission(Scope.CanEditAccountCredentials) ||
      hasPermission(Scope.CanEditAccountOrderCard) ||
      hasPermission(Scope.CanListAccountAnalysisHistory),
    [hasPermission]
  );

  if (!localStorage.getItem('accessToken')) {
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
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/registro" element={<RegistrationScreen />} />
          <Route path="*" element={<RedirectRoute to="/login" />} />
        </Routes>
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin />
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
            ...(location.pathname.includes('perfis') ? ['profiles'] : []),
          ]}
          mode="inline"
          items={[
            ...(hasMyAccountAccess
              ? [
                  {
                    key: 'profile',
                    label: 'Minha conta',
                    icon: <UserOutlined />,
                    onClick: () =>
                      navigate('/minha-conta/informacoes-pessoais'),
                  },
                ]
              : []),
            ...(hasPermission(Scope.CanListPastors)
              ? [
                  {
                    label: <Link to="/pastores">Pastores</Link>,
                    key: 'pastors',
                    icon: <TeamOutlined />,
                  },
                ]
              : []),
            ...(hasPermission(Scope.CanListProfileScopes)
              ? [
                  {
                    label: <Link to="/perfis">Perfis</Link>,
                    key: 'profiles',
                    icon: <UnlockOutlined />,
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
                  ...(hasMyAccountAccess
                    ? [
                        {
                          key: 'profile',
                          label: 'Minha Conta',
                          icon: <UserOutlined />,
                          onClick: () =>
                            navigate('/minha-conta/informacoes-pessoais'),
                        },
                      ]
                    : []),
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
                <Avatar
                  src={`${import.meta.env.VITE_ASSETS_URL}/${user.pictureUrl}`}
                  icon={<UserOutlined />}
                  size="large"
                />
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
            {hasMyAccountAccess && (
              <Route path="/minha-conta" element={<MyAccountScreen />}>
                {hasPermission(Scope.CanEditAccountPersonalInfo) && (
                  <Route
                    path="informacoes-pessoais"
                    element={<PersonalInformation />}
                  />
                )}
                {hasPermission(Scope.CanEditAccountAddress) && (
                  <Route path="endereco" element={<Address />} />
                )}
                {hasPermission(Scope.CanEditAccountContactInfo) && (
                  <Route
                    path="informacoes-contato"
                    element={<ContactInformation />}
                  />
                )}
                {hasPermission(Scope.CanEditAccountMinistry) && (
                  <Route path="ministerio" element={<Ministry />} />
                )}
                {hasPermission(Scope.CanEditAccountCredentials) && (
                  <Route path="senha" element={<Credentials />} />
                )}
                {hasPermission(Scope.CanEditAccountOrderCard) && (
                  <Route path="carteirinha-ordem" element={<OrderCard />} />
                )}
                {hasPermission(Scope.CanListAccountAnalysisHistory) && (
                  <Route
                    path="historico-analise"
                    element={<HistoryAnalysis />}
                  />
                )}
              </Route>
            )}
            {hasPermission(Scope.CanListPastors) && (
              <Route path="/pastores" element={<PastorsScreen />} />
            )}
            {hasPermission(Scope.CanDetailPastor) && (
              <Route path="/pastor/:id" element={<PastorDetailScreen />} />
            )}
            {hasPermission(Scope.CanListProfileScopes) && (
              <Route path="/perfis" element={<ProfileScreen />} />
            )}
            {hasPermission(Scope.CanEditProfileScopes) && (
              <Route
                path="/perfis/:id"
                element={<CreateOrEditProfileScreen />}
              />
            )}
            {hasPermission(Scope.CanCreateProfileScopes) && (
              <Route
                path="/perfis/novo"
                element={<CreateOrEditProfileScreen />}
              />
            )}
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;
