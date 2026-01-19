import { rootReducer } from '../rootReducer';
import type { RootState } from '../store';

describe('rootReducer', () => {
  it('должен возвращать исходное состояние для неизвестного действия', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        error: null,
        isOrderConfirmed: false
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      },
      profileOrders: {
        orders: [],
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      }
    } as RootState);
  });

  it('Должен возвращать текущее состояние для неизвестного действия.', () => {
    const currentState = {
      ingredients: {
        ingredients: [],
        loading: true,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        error: null,
        isOrderConfirmed: false
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      },
      profileOrders: {
        orders: [],
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      }
    } as RootState;

    const newState = rootReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(currentState);
  });
});