import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getCookie } from '../../utils/cookie';

interface WSConfig {
  wsStart: string;
  wsClose: string;
  wsSuccess: string;
  wsError: string;
  wsMessage: string;
}

export const socketMiddleware =
  (wsConfig: WSConfig, withToken: boolean = false): Middleware<{}, RootState> =>
  (storeAPI: MiddlewareAPI) => {
    let socket: WebSocket | null = null;

    return (next) => (action: any) => {
      const { dispatch } = storeAPI;
      const { type, payload } = action as { type: string; payload: any };

      if (type === wsConfig.wsStart) {
        // Закрываем существующее соединение
        if (socket) {
          socket.close();
        }

        let url = payload;

        if (withToken) {
          const token = getCookie('accessToken');
          if (token) {
            // Удаляем "Bearer " для WebSocket
            const cleanToken = token.replace('Bearer ', '');
            // URL для личных заказов с токеном
            url = `wss://norma.education-services.ru/orders?token=${cleanToken}`;
            console.log('Personal WebSocket URL with token');
          } else {
            console.log('No token, cannot connect to personal orders');
            return next(action);
          }
        } else {
          // URL для публичной ленты
          url = 'wss://norma.education-services.ru/orders/all';
          console.log('Public feed WebSocket URL');
        }

        console.log('Connecting to:', url.substring(0, 80) + '...');

        try {
          socket = new WebSocket(url);
        } catch (error) {
          console.error('Failed to create WebSocket:', error);
          return next(action);
        }

        socket.onopen = () => {
          console.log('WebSocket connected successfully');
          dispatch({ type: wsConfig.wsSuccess });
        };

        socket.onerror = (error) => {
          console.error('WebSocket error');
          dispatch({ type: wsConfig.wsError, payload: 'WebSocket error' });
        };

        socket.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          socket = null;
          dispatch({ type: wsConfig.wsClose });
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.success) {
              dispatch({ type: wsConfig.wsMessage, payload: data });
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message');
          }
        };
      }

      if (type === wsConfig.wsClose && socket) {
        socket.close();
        socket = null;
      }

      return next(action);
    };
  };
