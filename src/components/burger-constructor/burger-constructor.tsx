import { FC, useMemo, useEffect } from 'react'; // Добавляем useEffect
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getConstructorItems } from '../../services/slices/constructor/selectors';
import {
  getOrderRequest,
  getOrderModalData,
  getIsOrderConfirmed // Импортируем новый селектор
} from '../../services/slices/order/selectors';
import { isAuthenticated } from '../../services/slices/user/selectors';
import { clearConstructor } from '../../services/slices/constructor/slice';
import {
  createOrder,
  clearOrder,
  resetOrderConfirmation
} from '../../services/slices/order/slice'; // Добавляем resetOrderConfirmation
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isOrderConfirmed = useSelector(getIsOrderConfirmed); // Используем новый селектор
  const isAuth = useSelector(isAuthenticated);

  // Эффект для очистки конструктора при успешном подтверждении заказа
  useEffect(() => {
    if (isOrderConfirmed && orderModalData) {
      console.log('Order successfully created, clearing constructor...');
      dispatch(clearConstructor());
    }
  }, [isOrderConfirmed, orderModalData, dispatch]);

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

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    // Теперь конструктор очищается только через эффект выше,
    // когда isOrderConfirmed = true
    dispatch(clearOrder());
    // Сбрасываем флаг подтверждения, если он был установлен
    if (isOrderConfirmed) {
      dispatch(resetOrderConfirmation());
    }
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
