import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducer } from './rootReducer';
import { socketMiddleware } from './middleware/socketMiddleware';

// Импортируем типы экшенов из feed slice
import {
  wsConnectionStart,
  wsConnectionClosed,
  wsConnectionSuccess,
  wsConnectionError,
  wsGetMessage
} from './slices/feed/slice';

// Импортируем типы экшенов из profile-orders slice
import {
  wsProfileConnectionStart,
  wsProfileConnectionClosed,
  wsProfileConnectionSuccess,
  wsProfileConnectionError,
  wsProfileGetMessage
} from './slices/profile-orders/slice';

// Конфигурация для feed WebSocket (публичная лента)
const feedWsConfig = {
  wsStart: wsConnectionStart.type,
  wsClose: wsConnectionClosed.type,
  wsSuccess: wsConnectionSuccess.type,
  wsError: wsConnectionError.type,
  wsMessage: wsGetMessage.type
};

// Конфигурация для profile WebSocket (личные заказы)
const profileWsConfig = {
  wsStart: wsProfileConnectionStart.type,
  wsClose: wsProfileConnectionClosed.type,
  wsSuccess: wsProfileConnectionSuccess.type,
  wsError: wsProfileConnectionError.type,
  wsMessage: wsProfileGetMessage.type
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      socketMiddleware(feedWsConfig, false), // feed без токена
      socketMiddleware(profileWsConfig, true) // profile с токеном
    ),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Исправленная строка 87 - убираем фигурные скобки
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;
