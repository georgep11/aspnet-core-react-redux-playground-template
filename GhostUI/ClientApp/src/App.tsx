import { useEffect } from 'react';
import Layout from './Layout';
import { hot } from 'react-hot-loader/root';
import { Route, Routes } from 'react-router';
import { useLocation } from 'react-router-dom';
import { SignalRApi } from './api/signalr.service';
import { Routes as routes, TRANSITION_DEFAULT } from './config';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import type { FunctionComponent } from 'react';

const App: FunctionComponent = () => {
  useEffect(() => {
    setTimeout(async () => {
      await SignalRApi.startConnection();
    }, 250);
  }, []);

  const location = useLocation();
  const cssKey = location.pathname?.split('/')[1] || '/';
  const curRoute = routes.find((x) => (x.path === cssKey) || (x.name.toLowerCase() === cssKey.toLowerCase()));
  const { timeout, classNames } = curRoute?.transition ?? TRANSITION_DEFAULT;

  return (
    <Layout>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={cssKey}
          timeout={timeout}
          classNames={classNames}
        >
          <Routes location={location}>
            {routes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={<Component />}
              />
            ))}
          </Routes>
        </CSSTransition>
      </SwitchTransition>
    </Layout>
  );
};

export default hot(App);