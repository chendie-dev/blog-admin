import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import CategoryDataProvider from './components/CategoryDataProvider';
import MenuItemsProvider from './components/MenuItemsProvider';
import ArticleListDataProvider from './components/ArticleListDateProvider';
import { ConfigProvider } from 'antd';
import UserDataProvider from './components/UserDataProvider';
if (process.env.NODE_ENV === 'development') {
  require('./mock')
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigProvider
    theme={{ token: { colorPrimary: '#27a7ca', borderRadius: 15 } }}>
    <Provider store={store}>
      <BrowserRouter>
        <CategoryDataProvider>
          <MenuItemsProvider>
            <ArticleListDataProvider>
              <UserDataProvider>
                <App />
              </UserDataProvider>
            </ArticleListDataProvider>
          </MenuItemsProvider>
        </CategoryDataProvider>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
