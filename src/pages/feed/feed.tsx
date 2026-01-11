import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectionStart,
  wsConnectionClosed,
  fetchFeeds // Убедитесь, что он импортируется
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    console.log('Feed: Starting WebSocket connection');

    // WebSocket для публичной ленты заказов
    dispatch(wsConnectionStart('wss://norma.education-services.ru/orders/all'));

    return () => {
      console.log('Feed: Closing WebSocket connection');
      dispatch(wsConnectionClosed());
    };
  }, [dispatch]);

  // Функция для обновления ленты заказов
  const handleGetFeeds = () => {
    if (isRefreshing) return;

    console.log('Обновление ленты заказов...');
    setIsRefreshing(true);

    // Вариант 1: REST запрос (рекомендую - соответствует ТЗ)
    dispatch(fetchFeeds())
      .unwrap()
      .then(() => {
        console.log('Лента заказов успешно обновлена');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении ленты:', error);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  console.log('Feed: State', {
    loading,
    wsConnected,
    ordersCount: orders?.length || 0,
    isRefreshing
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

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
