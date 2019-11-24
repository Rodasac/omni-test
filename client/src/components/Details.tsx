import React,  { useEffect, useState } from 'react';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { RootState } from './store';
import { UserLocal } from './store/types';

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

  if (!token) {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const userLocal: UserLocal = JSON.parse(userStorage);
      console.log(userLocal);
      dispatch(props.logIn(userLocal));
    } else {
      props.history.push('/login');
    }
  }

  const [userEmail, setUserEmail] = useState(user ? user.email : '');

  useEffect(() => {
    setUserEmail(user ? user.email : '');
  }, [token]);

  return <h1>{userEmail}</h1>;
};

export default withRouter(connector(Details));
