import React, { useState, ChangeEvent, FocusEvent, FormEvent, useEffect } from 'react';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { RootState } from './store';
import { UserLocal } from './store/types';

// @ts-ignore
import gologo from '../assets/gc-logo-default.svg';
// @ts-ignore
import gorobot from '../assets/gc-robot.svg';

import '../styles/Login.scss';

const mapState = (state: RootState) => ({
  user: state.user
});

const mapDispatch = {
  logIn: (user: UserLocal) => ({
    type: 'LOGIN',
    payload: user
  })
};

const connector = connect(
  mapState,
  mapDispatch
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Login = function(props: Props) {
  const token = useSelector((state: UserLocal) => state.token);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    if (token) {
      props.history.push('/');
    }
  }, [token]);

  const handleEmail = (event: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target) {
      const value = target.value;
      setEmail(value);

      if (value !== '') {
        setEmailError(false);
        setEmailValid(true);
      } else {
        setEmailError(true);
        setEmailValid(false);
      }
    }
  };

  const handlePassword = (event: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target) {
      const value = target.value;
      setPassword(value);

      if (value !== '') {
        setPasswordError(false);
        setPasswordValid(true);
      } else {
        setPasswordError(true);
        setPasswordValid(false);
      }
    }
  };

  const handleSumit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      email: email,
      password: password
    };

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(response => {
        if (response.success) {
          const user: UserLocal = {
            user: response.user,
            token: response.token
          };
          localStorage.setItem('user', JSON.stringify(user));

          dispatch(props.logIn(user));
        } else {
          if (response.emailErr) {
            setEmailError(true);
          } else {
            setPasswordError(true);
          }

          setErrMessage(response.message);
        }
      });
  };

  return (
    <div className='login-gradient'>
      <div className='login-component'>
        <div className='container-fluid login-container'>
          <div className='row login-form align-items-center'>
            <div className='col-12'>
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col-2 mb-4'>
                    <img className='img-fluid' src={gologo} alt=''/>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-2 mb-4'>
                    <div className='robot-border'>
                      <img className='img-fluid' src={gorobot} alt=''/>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <form onSubmit={handleSumit}>
                      <div className='form-group row mb-3'>
                        <label className='col-4'>Correo Electrónico</label>
                        <div
                          className={
                            emailError ?
                            'col-8 input-init invalid' :
                            emailValid ? 'col-8 input-init valid' : 'input-init col-8'
                          }
                        >
                          <input
                            type='email'
                            name='email'
                            className='form-control'
                            value={email}
                            onChange={handleEmail}
                            onBlur={handleEmail}
                            required
                          />
                        </div>
                      </div>
                      <div className='form-group row mb-3'>
                        <label className='col-4'>Contraseña</label>
                        <div
                          className={
                            passwordError ?
                            'col-8 input-init invalid' :
                            passwordValid ? 'col-8 input-init valid' : 'col-8 input-init'
                          }
                        >
                          <input
                            type='password'
                            name='password'
                            className='form-control'
                            value={password}
                            onChange={handlePassword}
                            onBlur={handlePassword}
                            required
                          />
                        </div>
                      </div>
                      {
                        errMessage ?
                          (
                            <div className='alert alert-danger' role='alert'>
                              {errMessage}
                            </div>
                          )
                          : ''
                      }
                      <button type='submit' className='btn btn-primary'>INGRESAR</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row login-footer'>
            <div className='col-12'>
              <div className='omni-brand mb-0'>
                <span>OMNI</span> 1.0
              </div>
              <p>Un servicio de <span>Gocloud</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(connector(Login));
