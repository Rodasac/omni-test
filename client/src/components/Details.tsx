import React,  { useEffect, useState } from 'react';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { RootState } from './store';
import { UserLocal } from './store/types';

import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/Details.scss';

import PerfectScrollbar from 'react-perfect-scrollbar';

// @ts-ignore
import gologo from '../assets/gc-logo-default.svg';

const mapState = (state: RootState) => ({
  user: state.user
});

const mapDispatch = {
  logIn: (user: UserLocal) => ({
    type: 'LOGIN',
    payload: user
  }),
  logOut: () => ({
    type: 'LOGOUT'
  })
};

const connector = connect(
  mapState,
  mapDispatch
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Details = function(props: Props) {
  const token = useSelector((state: UserLocal) => state.token);
  const user = useSelector((state: UserLocal) => state.user);
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState(user ? user.email : '');

  const [message, setMessage] = useState('');

  const campaignInitial: Array<{
    _id: string,
    entity: string,
    date: string,
    status: string,
    step: string,
    status_date: string,
    __v?: number
  }> = [];

  const [campaigns, setCampaigns] = useState(campaignInitial);

  useEffect(() => {
    setUserEmail(user ? user.email : '');
    if (token) {
      fetch(
        '/details',
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )
      .then(res => {
        if (res.ok) return res.json();
        throw Error('No está autenticado');
      })
      .catch(err => {
        console.log(err);
        localStorage.removeItem('user');
        dispatch(props.logOut());
      })
      .then(response => {
        if (response) {
          if (response.success) {
            setCampaigns(response.campaigns);
          } else {
            setMessage(response.message);
          }
        }
      });
    } else {
      const userStorage = localStorage.getItem('user');
      if (userStorage) {
        const userLocal: UserLocal = JSON.parse(userStorage);
        console.log(userLocal);
        dispatch(props.logIn(userLocal));
      } else {
        props.history.push('/login');
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(props.logOut());
  };

  return (
    <div className='details-component'>
      <nav className='navbar navbar-expand navbar-light'>
        <a className='navbar-brand' href='#'>
          <span className='gc-font gc-font_logo'></span>
        </a>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav ml-auto mr-0'>
            <li className='nav-item active'>
              <a className='nav-link btn btn-default' onClick={handleLogout}>
                <div><span className='gc-font gc-font_logout'></span></div>
                <span className='sr-only'>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 text-right'>
            <p className='omni-mia'>OMNI MIA</p>
          </div>
        </div>
      </div>
      <section className='container-fluid campaign-section'>
        <div className='row'>
          <div className='col-12'>
            <h5>Detalle de campaña</h5>
          </div>
        </div>
        <div className='row campaign-info'>
          <div className='col-6'>
            <p>Nombre de la campaña</p>
          </div>
          <div className='col-6'>
            <p className='text-right'>
              <span><strong>Progreso discado: </strong> 73%</span>
              <span><strong>Consumo total: </strong> 2:07 min</span>
              <span><strong>Duración promedio llamada: </strong> 24 seg</span>
            </p>
          </div>
        </div>
      </section>
      <section className='container-fluid campaign-stats'>
        <div className='row'>
          <div className='col'>
            <div className='stat stat_transfer'>
              <h3>36</h3>
              <p>Transferidas</p>
              <span className='gc-font gc-font_down-arrow'></span>
            </div>
          </div>
          <div className='col'>
            <div className='stat stat_starteds'>
              <h3>3728</h3>
              <p>Iniciadas</p>
              <span className='gc-font gc-font_dialog'></span>
            </div>
          </div>
          <div className='col'>
            <div className='stat stat_dialed'>
              <h3>11712</h3>
              <p>Discadas</p>
              <span className='gc-font gc-font_check'></span>
            </div>
          </div>
          <div className='col'>
            <div className='stat stat_notstarted'>
              <h3>7984</h3>
              <p>No Iniciadas</p>
              <span className='gc-font gc-font_waiting'></span>
            </div>
          </div>
          <div className='col'>
            <div className='stat stat_numbers'>
              <h3>11712</h3>
              <p>Números</p>
              <span className='gc-font gc-font_phone'></span>
            </div>
          </div>
          <div className='col'>
            <div className='stat stat_faileds'>
              <h3>10</h3>
              <p>Fallidas</p>
              <span className='gc-font gc-font_close'></span>
            </div>
          </div>
          <div className='col'>
            <div className='stat stat_inpaids'>
              <h3>14</h3>
              <p>Compromiso Pago</p>
              <span className='gc-font gc-font_time'></span>
            </div>
          </div>
        </div>
      </section>
      <section className='container-fluid campaign-list'>
        <div className='row'>
          <div className='col-12'>
            <PerfectScrollbar>
              <table className='table'>
                <thead className='thead-light'>
                  <tr>
                    <th scope='col'>TELÉFONO</th>
                    <th scope='col'>FECHA</th>
                    <th scope='col'>HORA</th>
                    <th scope='col'>DURACIÓN</th>
                    <th scope='col'>ÚLT. ETAPA</th>
                    <th scope='col'>ÚLT. PASO</th>
                    <th scope='col'>INTENTOS</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    campaigns ? campaigns.map((val) => (
                        <tr>
                          <td scope='row'>{val.entity}</td>
                          <td scope='row'>
                            {
                              new Intl.DateTimeFormat('es-VE', {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit'
                              }).format(new Date(val.date))
                            }
                          </td>
                          <td scope='row'>17:30pm</td>
                          <td scope='row'>25seg</td>
                          <td scope='row'>{
                            val.status ?
                              val.status === 'talking' ? 'Iniciada' : 'Finalizada'
                              : 'No iniciada'
                          }</td>
                          <td scope='row'>{val.step}</td>
                          <td scope='row'>1</td>
                        </tr>
                      )
                    ) : ''
                  }
                </tbody>
              </table>
            </PerfectScrollbar>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withRouter(connector(Details));
