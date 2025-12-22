import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getConstructorItems } from '../../services/slices/constructor/selectors';
import {
  getOrderRequest,
  getOrderModalData
} from '../../services/slices/order/selectors';
import { isAuthenticated } from '../../services/slices/user/selectors';
import { clearConstructor } from '../../services/slices/constructor/slice';
import { createOrder, clearOrder } from '../../services/slices/order/slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuth = useSelector(isAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    // Отправляем заказ и чистим конструктор только после успеха
    dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        // УСПЕШНЫЙ ОТВЕТ ОТ СЕРВЕРА → очищаем конструктор
        dispatch(clearConstructor());
      })
      .catch((error: any) => {
        console.error('Ошибка создания заказа:', error);
        // Если ошибка - конструктор НЕ очищаем
      });
  };

  // При закрытии модалки очищаем только данные заказа
  const closeOrderModal = () => {
    dispatch(clearOrder());
    // НЕ очищаем конструктор здесь!
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
