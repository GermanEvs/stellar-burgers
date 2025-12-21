import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  isAuthChecked,
  isAuthenticated
} from '../../services/slices/user/selectors';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuth = useSelector(isAuthenticated);
  const authChecked = useSelector(isAuthChecked);
  const location = useLocation();

  if (!authChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    // Если пользователь авторизован, но маршрут только для неавторизованных
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    // Если пользователь не авторизован, но маршрут защищён
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
