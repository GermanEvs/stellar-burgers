import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsProfileConnectionStart,
  wsProfileConnectionClosed
} from '../../services/slices/profile-orders/slice';
import {
  getProfileOrders,
  getProfileOrdersLoading,
  isProfileWsConnected
} from '../../services/slices/profile-orders/selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getProfileOrders);
  const loading = useSelector(getProfileOrdersLoading);
  const wsConnected = useSelector(isProfileWsConnected);

  useEffect(() => {
    console.log('ProfileOrders: Starting WebSocket connection');

    // WebSocket для личных заказов (без /all)
    dispatch(
      wsProfileConnectionStart('wss://norma.education-services.ru/orders')
    );

    return () => {
      console.log('ProfileOrders: Closing WebSocket connection');
      dispatch(wsProfileConnectionClosed());
    };
  }, [dispatch]);

  console.log('ProfileOrders: State', {
    ordersCount: orders?.length || 0,
    loading,
    wsConnected
  });

  if (!wsConnected && orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Preloader />
        <p>Подключаемся к истории заказов...</p>
      </div>
    );
  }

  if (wsConnected && orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>История заказов пуста</p>
        <p>Совершите первый заказ в конструкторе!</p>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
