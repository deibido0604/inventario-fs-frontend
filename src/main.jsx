import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import ConsoleApp from './ConsoleApp';
import IntlProviderWrapper from './config/components/IntlProviderWrapper';
import { store, persistor } from './store/store';
import './styles.scss';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IntlProviderWrapper>
          <ConsoleApp />
        </IntlProviderWrapper>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
