import { useCallback, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTextInput } from '../../hooks';
import { RoutesConfig } from '../../config';
import LoginControls from './LoginControls';
import UserNameInput from './UserNameInput';
import PasswordInput from './PasswordInput';
import { useHistory } from 'react-router-dom';
import { Authenticator } from '../../components';
import { renderToastifyContent } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators, AuthStatusEnum } from '../../store/auth';
import BasedGhostLogoPng from '../../assets/image/based-ghost-main.png';

import type { RootState } from '../../store';
import type { FunctionComponent } from 'react';
import type { ICredentials } from '../../store/auth';

const Login: FunctionComponent = () => {
  const toastIdRef = useRef<string | number>('');

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);

  const userNameInput = useTextInput('');
  const passwordInput = useTextInput('', showPassword ? 'text' : 'password');

  // react-redux hooks state/actions
  const history = useHistory();
  const dispatch = useDispatch();
  const status = useSelector<RootState, AuthStatusEnum>(state => state.auth.status);

  const dispatchAuthStatus = useCallback((status: AuthStatusEnum): void => {
    dispatch(actionCreators.setAuthStatus(status));
  }, [dispatch]);

  const onFailedAuth = useCallback((): void => {
    dispatchAuthStatus(AuthStatusEnum.NONE);
    dispatch(actionCreators.resetState());
  }, [dispatch, dispatchAuthStatus]);

  const onRememberMeCheck = useCallback((checked: boolean): void => setRememberMe(checked), []);
  const onSuccessfulAuth = useCallback((): void => history.push(RoutesConfig.Dashboard.path), [history]);
  const onToggleShowPassword = useCallback((): void => setShowPassword((prevShow: boolean) => !prevShow), []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (status === AuthStatusEnum.PROCESS) {
      return;
    }

    if (!userNameInput.hasValue || !passwordInput.hasValue) {
      // Run invalidInputs error and display toast notification (if one is not already active)
      setIsInputInvalid(true);

      if (!toast.isActive(toastIdRef.current)) {
        const errorToastContent = renderToastifyContent('Enter user name/password', 'exclamation-triangle');
        toastIdRef.current = toast.error(errorToastContent);
      }
    } else {
      // Clear any toast notifications and prepare state for Login request stub / run login request stub
      toast.dismiss();
      setIsInputInvalid(false);
      dispatchAuthStatus(AuthStatusEnum.PROCESS);

      setTimeout(() => {
        const credentials: ICredentials = {
          rememberMe,
          userName: userNameInput.value,
          password: passwordInput.value,
        };

        dispatch(actionCreators.login(credentials));
      }, 2250);
    }
  };

  return (
    <section className='section section-login'>
      <div className='container has-text-centered'>
        <div className='column is-4 is-offset-4'>
          <h3 className='title'>Login</h3>
          <p className='subtitle'>Please login to proceed</p>
          <div className='box login-box'>
            <img
              width='175'
              aria-hidden
              id='login-img'
              alt='based-ghost-logo'
              src={BasedGhostLogoPng}
            />
            <form onSubmit={handleLogin}>
              <UserNameInput
                textInput={userNameInput}
                isInputInvalid={isInputInvalid}
              />
              <PasswordInput
                textInput={passwordInput}
                showPassword={showPassword}
                isInputInvalid={isInputInvalid}
                toggleShowPassword={onToggleShowPassword}
              />
              <LoginControls
                rememberMe={rememberMe}
                handleRememberMeCheck={onRememberMeCheck}
              />
            </form>
            <Authenticator
              authStatus={status}
              handleOnFail={onFailedAuth}
              handleOnSuccess={onSuccessfulAuth}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
