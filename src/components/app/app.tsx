import { FC, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

// Импорты для загрузки ингредиентов
import { fetchIngredients } from '../../services/slices/ingredients/slice';
import { getIngredientsLoading } from '../../services/slices/ingredients/selectors';

// Импорты для пользователя
import { checkUserAuth } from '../../services/slices/user/slice';
import {
  isAuthenticated,
  isAuthChecked as isAuthCheckedSelector
} from '../../services/slices/user/selectors';

// Импорты для очистки
import { clearConstructor } from '../../services/slices/constructor/slice';
import { clearOrder } from '../../services/slices/order/slice';
import { Preloader } from '@ui';

// Импорты страниц
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '../../pages';

// Импорты компонентов
import {
  IngredientDetails,
  Modal,
  OrderInfo,
  AppHeader,
  ProtectedRoute
} from '../../components';

import '../../index.css';
import styles from './app.module.css';

const App: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Получаем состояния
  const background = location.state?.background;
  const isAuth = useSelector(isAuthenticated);
  const ingredientsLoading = useSelector(getIngredientsLoading);
  const isAuthChecked = useSelector(isAuthCheckedSelector); // Добавлено!

  // ЗАГРУЖАЕМ ИНГРЕДИЕНТЫ ОДИН РАЗ ПРИ ЗАГРУЗКЕ ПРИЛОЖЕНИЯ
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Проверяем авторизацию
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
    dispatch(clearOrder());
  };

  const handleOrderModalClose = () => {
    navigate(-1);
    dispatch(clearOrder());
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Показываем прелоадер пока грузятся ингредиенты ИЛИ проверяется авторизация */}
      {ingredientsLoading || !isAuthChecked ? ( // Изменено!
        <div className={styles.preloaderContainer}>
          <Preloader />
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            {/* Главная страница */}
            <Route path='/' element={<ConstructorPage />} />

            {/* Страница ингредиента */}
            <Route path='/ingredients/:id' element={<IngredientDetails />} />

            {/* Лента заказов */}
            <Route path='/feed' element={<Feed />} />

            {/* Детали заказа в ленте */}
            <Route path='/feed/:number' element={<OrderInfo />} />

            {/* Авторизация */}
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            {/* Профиль */}
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            {/* Детали заказа в профиле */}
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* Модальные окна */}
          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleModalClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={
                  <Modal title='' onClose={handleOrderModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal title='' onClose={handleOrderModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
