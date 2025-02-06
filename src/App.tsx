import { Divider, Flex, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LogoTransparent from '@assets/logo_transparente.png';
import { useAuth } from './contexts/AuthContext.tsx';
import { Link, Route, Routes } from 'react-router-dom';
import Login from '@features/Login/screens/Login.tsx';
import RedirectRoute from './components/RedirectRoute.tsx';
import Registration from '@features/Registration/screens/Registration.tsx';
import Profile from '@features/Profile/screens/Profile.tsx';
import Pastors from '@features/Pastors/screens/Pastors.tsx';
import PastorDetail from '@features/PastorDetail/screens/PastorDetail.tsx';
import { Role } from './models/User.ts';

function App() {
  const { user } = useAuth();

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
          <img src={LogoTransparent} style={{ height: 70 }} />
          <Divider style={{ margin: '5px 0' }} />
        </Flex>
        <Menu
          defaultSelectedKeys={['pastores']}
          mode="inline"
          style={{ height: '100%' }}
          items={[
            ...(Role.ADMIN === user.role
              ? [
                  {
                    label: <Link to="/pastores">Pastores</Link>,
                    key: 'pastores',
                    icon: <UserOutlined />,
                  },
                ]
              : []),
          ]}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content style={{ margin: 16 }}>
          <Routes>
            <Route path="/conta" element={<Profile />} />
            {Role.ADMIN === user.role && (
              <>
                <Route path="" element={<RedirectRoute to="/pastores" />} />
                <Route path="/pastores" element={<Pastors />} />
                <Route path="/pastor/:id" element={<PastorDetail />} />
              </>
            )}
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;
