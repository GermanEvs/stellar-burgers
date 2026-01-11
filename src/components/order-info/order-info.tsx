import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

// Импортируйте селекторы
import { getIngredients } from '../../services/slices/ingredients/selectors';
import { getFeedOrders } from '../../services/slices/feed/selectors';
import {
  getCurrentOrder,
  getOrderRequest
} from '../../services/slices/order/selectors';

// Импортируйте экшены
import {
  fetchOrderByNumber,
  clearOrder
} from '../../services/slices/order/slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  // Получаем данные из стора
  const ingredients = useSelector(getIngredients);
  const feedOrders = useSelector(getFeedOrders);
  const currentOrder = useSelector(getCurrentOrder);
  const orderRequest = useSelector(getOrderRequest);

  // 1. Сначала пытаемся получить заказ из location.state (при клике из модалки)
  const orderFromState = location.state?.order;

  // 2. Если нет в state, ищем в ленте заказов по номеру
  const orderFromFeed = useMemo(() => {
    if (orderFromState) return null; // Уже есть из state
    if (!feedOrders.length || !number) return null;
    return feedOrders.find((order) => order.number === Number(number));
  }, [feedOrders, number, orderFromState]);

  // 3. Используем заказ из state, из feed или currentOrder
  const orderData = orderFromState || orderFromFeed || currentOrder;

  console.log('OrderInfo debug:', {
    number,
    hasOrderFromState: !!orderFromState,
    hasOrderFromFeed: !!orderFromFeed,
    hasCurrentOrder: !!currentOrder,
    orderData,
    feedOrdersCount: feedOrders.length,
    orderRequest
  });

  // 4. Если заказа нет нигде и есть номер, загружаем его
  useEffect(() => {
    if (!orderData && number && !orderRequest) {
      console.log('OrderInfo: Fetching order by number:', number);
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData, orderRequest]);

  // 5. Очищаем currentOrder при размонтировании
  useEffect(
    () => () => {
      console.log('OrderInfo: Clearing current order');
      dispatch(clearOrder());
    },
    [dispatch]
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      console.log('OrderInfo: missing data', {
        hasOrderData: !!orderData,
        ingredientsCount: ingredients.length
      });
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const ingredientsArray = Object.values(ingredientsInfo) as (TIngredient & {
      count: number;
    })[];

    const total = ingredientsArray.reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Показываем прелоадер во время загрузки или если нет данных
  if (orderRequest || !orderInfo) {
    console.log('OrderInfo: showing preloader - loading data');
    return <Preloader />;
  }

  console.log('OrderInfo: rendering with data');
  return <OrderInfoUI orderInfo={orderInfo} />;
};
