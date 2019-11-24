import React, { useState, ChangeEvent, FocusEvent } from 'react';

// @ts-ignore
import gologo from '../assets/gc-logo-default.svg';
// @ts-ignore
import gorobot from '../assets/gc-robot.svg';

import '../styles/Login.scss';

const Login = function() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

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
                    <form>
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

export default Login;
