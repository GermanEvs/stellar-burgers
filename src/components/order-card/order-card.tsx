import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

// Импортируйте селектор ингредиентов
import { getIngredients } from '../../services/slices/ingredients/selectors';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  // Получаем ингредиенты из стора
  const ingredients = useSelector(getIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) {
      console.log('OrderCard: No ingredients available for order', order._id);
      return null;
    }

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    console.log('OrderCard: no orderInfo for order', order._id);
    return <div style={{ display: 'none' }} />;
  }

  // Ключевое изменение: тип locationState
  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={
        {
          background: location,
          order: orderInfo // ДОБАВЛЯЕМ order
        } as any
      } // Используем as any или исправьте тип в type.ts
    />
  );
});
