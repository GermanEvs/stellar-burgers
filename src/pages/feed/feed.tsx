import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectionStart,
  wsConnectionClosed
} from '../../services/slices/feed/slice';
import {
  getFeedOrders,
  getFeedLoading,
  isWsConnected
} from '../../services/slices/feed/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const loading = useSelector(getFeedLoading);
  const wsConnected = useSelector(isWsConnected);

  useEffect(() => {
    console.log('Feed: Starting WebSocket connection');

    // WebSocket для публичной ленты заказов
    dispatch(wsConnectionStart('wss://norma.education-services.ru/orders/all'));

    return () => {
      console.log('Feed: Closing WebSocket connection');
      dispatch(wsConnectionClosed());
    };
  }, [dispatch]);

  console.log('Feed: State', {
    loading,
    wsConnected,
    ordersCount: orders?.length || 0
  });

  // Показываем прелоадер только при первой загрузке
  if (!wsConnected && orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Preloader />
        <p>Подключаемся к ленте заказов...</p>
      </div>
    );
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        console.log('Manual refresh not needed with WebSocket');
      }}
    />
  );
};
