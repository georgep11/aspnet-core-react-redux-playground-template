import React, { useCallback, useState, useRef } from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { useTextInput } from '../../hooks';
import { renderToastifyMsg } from '../../utils';
import { IApplicationState } from '../../store';
import { Authenticator } from '../../components';
import { RoutesConfig } from '../../config/routes.config';
import { actionCreators, AuthStatusEnum, reducer } from '../../store/auth';
import { UserNameInput, PasswordInput, LoginControls } from './child-components';

import BasedGhostLogoPng from '../../assets/image/based-ghost-main.png';

type LoginProps = ReturnType<typeof reducer>
  & typeof actionCreators
  & { history: History };

const Login: React.FC<LoginProps> = ({
  status,
  history,
  resetState,
  setAuthStatus,
  loginUserRequest
}) => {
  const toastIdRef = useRef<string | number>('');

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);

  const userNameInput = useTextInput('');
  const passwordInput = useTextInput('', showPassword ? 'text' : 'password');

  const onFailedAuth = useCallback((): void => {
    resetState();
    setAuthStatus(AuthStatusEnum.NONE);
  }, [resetState, setAuthStatus]);

  const onRememberMeCheck = useCallback((checked: boolean): void => setRememberMe(checked), []);
  const onSuccessfulAuth = useCallback((): void => history.push(RoutesConfig.Dashboard.path), [history]);
  const onToggleShowPassword = useCallback((): void => setShowPassword((prevShow: boolean) => !prevShow), []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (status === AuthStatusEnum.PROCESS) return;

    if (!userNameInput.hasValue || !passwordInput.hasValue) {
      // Run invalidInputs error and display toast notification (if one is not already active)
      setIsInputInvalid(true);

      if (!toast.isActive(toastIdRef.current)) {
        toastIdRef.current = toast.error(
          renderToastifyMsg('Enter user name/password', 'exclamation-triangle')
        );
      }
    } else {
      // Clear any toast notifications and prepare state for Login request stub / run login request stub
      toast.dismiss();
      setIsInputInvalid(false);
      setAuthStatus(AuthStatusEnum.PROCESS);

      setTimeout(() => {
        loginUserRequest({
          rememberMe,
          userName: userNameInput.value,
          password: passwordInput.value,
        });
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

const mapStateToProps = (state: IApplicationState) => state.auth;

export default connect(mapStateToProps, actionCreators)(Login);
