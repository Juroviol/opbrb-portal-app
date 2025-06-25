import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ConfigProvider } from 'antd';
import AuthContextProvider from './contexts/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import locale from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { setContext } from '@apollo/client/link/context';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

loadDevMessages();
loadErrorMessages();

const uploadLink = createUploadLink({
  uri: `${import.meta.env.VITE_APP_SERVER_URI}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});

import 'dayjs/locale/pt-br';

dayjs.locale('pt_BR');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={locale}
      theme={{
        cssVar: true,
        token: {
          colorPrimary: '#7b0808',
          colorInfo: '#7b0808',
          colorSuccess: '#39a602',
          colorError: '#f70206',
          colorTextBase: '#1f1b1c',
          fontSize: 14,
          sizeStep: 4,
        },
        components: {
          Menu: {
            activeBarBorderWidth: 0,
            dangerItemActiveBg: 'rgb(255,242,240)',
            itemSelectedBg: 'rgb(244,233,232)',
            subMenuItemBg: 'rgba(0,0,0,0.01)',
            itemHoverBg: 'rgba(0,0,0,0.02)',
            itemActiveBg: 'rgba(0,0,0,0)',
          },
          Layout: {
            headerBg: 'white',
            triggerBg: 'white',
            siderBg: 'white',
          },
          Input: {
            activeShadow: '0 0 0 2px rgba(197,112,115, 0.2)',
          },
          DatePicker: {
            activeShadow: '0 0 0 2px rgba(197,112,115, 0.2)',
          },
          Select: {
            activeOutlineColor: 'rgba(197,112,115, 0.2)',
            optionSelectedBg: 'rgb(123,8,8)',
            optionSelectedColor: 'rgba(255,255,255,0.88)',
          },
          Dropdown: {
            controlItemBgHover: 'rgba(0,0,0,0.02)',
          },
          Table: {
            cellPaddingBlock: 10,
          },
        },
      }}
    >
      <BrowserRouter>
        <ApolloProvider client={client}>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </ApolloProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>
);
