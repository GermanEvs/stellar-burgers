import { FC, useMemo, useEffect, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getConstructorItems } from '../../services/slices/constructor/selectors';
import {
  getOrderRequest,
  getOrderModalData,
  getOrderError
} from '../../services/slices/order/selectors';
import { isAuthenticated } from '../../services/slices/user/selectors';
import { clearConstructor } from '../../services/slices/constructor/slice';
import { createOrder, clearOrder } from '../../services/slices/order/slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const orderError = useSelector(getOrderError);
  const isAuth = useSelector(isAuthenticated);

  // Логируем состояние
  console.log('BurgerConstructor state:', {
    isModalOpen,
    orderRequest,
    hasOrderModalData: !!orderModalData,
    orderModalData,
    orderError,
    hasBun: !!constructorItems.bun,
    ingredientsCount: constructorItems.ingredients.length,
    isAuth
  });

  const onOrderClick = () => {
    console.log('=== ORDER BUTTON CLICKED ===');

    if (!constructorItems.bun || orderRequest) {
      console.log('Cannot create order: no bun or already requesting');
      return;
    }

    if (!isAuth) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    console.log('Creating order with ingredients:', ingredientsIds);
    console.log('Ingredients count:', ingredientsIds.length);

    // Открываем модалку
    setIsModalOpen(true);

    // Очищаем предыдущий заказ перед созданием нового
    dispatch(clearOrder());

    // Создаем новый заказ
    console.log('Dispatching createOrder...');
    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    console.log('Closing order modal');
    setIsModalOpen(false);
    dispatch(clearOrder());

    // Очищаем конструктор ТОЛЬКО если заказ успешно создан
    if (orderModalData) {
      console.log('Clearing constructor after successful order');
      dispatch(clearConstructor());
    }
  };

  // Эффект для отслеживания состояния заказа
  useEffect(() => {
    if (isModalOpen) {
      console.log('Modal is open, tracking order state...');

      if (orderRequest) {
        console.log('Order request STARTED at:', new Date().toISOString());
      }

      if (orderModalData) {
        console.log('Order SUCCESS at:', new Date().toISOString());
        console.log('Order number:', orderModalData.number);
      }

      if (orderError) {
        console.error('Order ERROR at:', new Date().toISOString());
        console.error('Error message:', orderError);
      }
    }
  }, [isModalOpen, orderRequest, orderModalData, orderError]);

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
    <>
      {/* Отрисовываем UI конструктора */}
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </>
  );
};
