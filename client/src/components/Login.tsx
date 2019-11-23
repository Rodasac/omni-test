import React from 'react';

// @ts-ignore
import gologo from '../assets/gc-logo-default.svg';
// @ts-ignore
import gorobot from '../assets/gc-robot.svg';

const Login = function() {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-4'>
          <img src={gologo} alt=''/>
        </div>
      </div>
      <div className='row'>
        <div className='col-4'>
          <img src={gorobot} alt=''/>
        </div>
      </div>
      <div className='row'>
        <div className='col-4'>
          <form>
            <div className='form-group'>
              <label>Correo Electrónico</label>
              <input type='email' className='form-control' id='exampleInputEmail1' aria-describedby='emailHelp' placeholder='Enter email' />
            </div>
            <div className='form-group'>
              <label>Contraseña</label>
              <input type='password' className='form-control' id='exampleInputPassword1' placeholder='Password' />
            </div>
            <button type='submit' className='btn btn-primary'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
};

export default Login;
