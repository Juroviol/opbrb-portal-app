import { Divider, Flex, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LogoTransparent from '@assets/logo_transparente.png';
import { useAuth } from './contexts/AuthContext.tsx';
import { Route, Routes } from 'react-router-dom';
import Login from '@features/Login/screens/Login.tsx';
import RedirectRoute from './components/RedirectRoute.tsx';
import Registration from '@features/Registration/screens/Registration.tsx';

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Flex
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgb(244, 233, 232)',
        }}
        justify="center"
        align="center"
      >
        <Routes>
          <Route path="" element={<RedirectRoute to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registration />} />
        </Routes>
      </Flex>
    );
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider collapsible>
        <Flex
          vertical
          style={{
            width: '100%',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={LogoTransparent} style={{ height: 100 }} />
          <Divider style={{ margin: '5px 0' }} />
        </Flex>
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          style={{ height: '100%' }}
          items={[
            { label: 'Registros', key: 'registros', icon: <UserOutlined /> },
          ]}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header />
        <Layout.Content style={{ margin: 16 }} />
      </Layout>
    </Layout>
  );
}

export default App;
