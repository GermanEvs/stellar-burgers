import { FC, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

// Импортируйте селекторы
import { getIngredients } from '../../services/slices/ingredients/selectors';
import { getFeedOrders } from '../../services/slices/feed/selectors';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();

  // Получаем данные из стора
  const ingredients = useSelector(getIngredients);
  const feedOrders = useSelector(getFeedOrders);

  // 1. Сначала пытаемся получить заказ из location.state (при клике из модалки)
  const orderFromState = location.state?.order;

  // 2. Если нет в state, ищем в ленте заказов по номеру
  const orderFromFeed = useMemo(() => {
    if (orderFromState) return null; // Уже есть из state
    if (!feedOrders.length || !number) return null;
    return feedOrders.find((order) => order.number === Number(number));
  }, [feedOrders, number, orderFromState]);

  // 3. Используем заказ из state или из feed
  const orderData = orderFromState || orderFromFeed;

  console.log('OrderInfo debug:', {
    number,
    hasOrderFromState: !!orderFromState,
    hasOrderFromFeed: !!orderFromFeed,
    orderData
  });

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

    // Исправляем ошибку типов
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

    // Исправляем ошибку типов в reduce - преобразуем Object.values
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

  if (!orderInfo) {
    console.log('OrderInfo: showing preloader - no data');
    return <Preloader />;
  }

  console.log('OrderInfo: rendering with data');
  return <OrderInfoUI orderInfo={orderInfo} />;
};
