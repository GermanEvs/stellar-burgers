import reducer, { 
  fetchProfileOrders,
  wsProfileConnectionStart,
  wsProfileConnectionSuccess,
  wsProfileConnectionError,
  wsProfileConnectionClosed,
  wsProfileGetMessage,
  clearProfileOrders,
  TProfileOrdersState 
} from '../slice';
import { TOrder, TOrdersData } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: 'order_1',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-10-10T10:00:00.000Z',
    updatedAt: '2023-10-10T10:00:00.000Z',
    number: 12345,
    ingredients: ['bun_1', 'main_1']
  },
  {
    _id: 'order_2',
    status: 'created',
    name: 'Антарианский краторный бургер',
    createdAt: '2023-10-10T11:00:00.000Z',
    updatedAt: '2023-10-10T11:00:00.000Z',
    number: 12346,
    ingredients: ['bun_2', 'sauce_1']
  }
];

const mockOrdersData: TOrdersData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

const initialState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null,
  wsConnected: false,
  wsError: null
};

describe('profileOrders reducer', () => {
  describe('initial state', () => {
    it('должен вернуть initial state', () => {
      const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('fetchProfileOrders', () => {
    it('обработчик fetchProfileOrders.pending', () => {
      const action = { type: fetchProfileOrders.pending.type };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        orders: [],
        loading: true,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });

    it('обработчик fetchProfileOrders.fulfilled', () => {
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockOrders
      };
      const pendingState = reducer(initialState, { 
        type: fetchProfileOrders.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orders: mockOrders,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });

    it('обработчик fetchProfileOrders.rejected', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchProfileOrders.rejected.type,
        error: { message: errorMessage }
      };
      const pendingState = reducer(initialState, { 
        type: fetchProfileOrders.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orders: [],
        loading: false,
        error: errorMessage,
        wsConnected: false,
        wsError: null
      });
    });
  });

  describe('WebSocket actions', () => {
    it('обработчик wsProfileConnectionStart', () => {
      const url = 'wss://example.com/profile/orders';
      const state = reducer(initialState, wsProfileConnectionStart(url));
      
      expect(state).toEqual(initialState); // Этот action пустой в вашем slice
    });

    it('обработчик wsProfileConnectionSuccess', () => {
      const state = reducer(initialState, wsProfileConnectionSuccess());
      
      expect(state).toEqual({
        orders: [],
        loading: false,
        error: null,
        wsConnected: true,
        wsError: null
      });
    });

    it('обработчик wsProfileConnectionError', () => {
      const errorMessage = 'WebSocket connection failed';
      const state = reducer(initialState, wsProfileConnectionError(errorMessage));
      
      expect(state).toEqual({
        orders: [],
        loading: false,
        error: null,
        wsConnected: false,
        wsError: errorMessage
      });
    });

    it('обработчик wsProfileConnectionClosed', () => {
      const stateWithConnection = { 
        ...initialState, 
        wsConnected: true 
      };
      const state = reducer(stateWithConnection, wsProfileConnectionClosed());
      
      expect(state).toEqual({
        orders: [],
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });

    it('обработчикe wsProfileGetMessage', () => {
      const action = wsProfileGetMessage(mockOrdersData);
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        orders: mockOrders,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });
  });

  describe('clearProfileOrders', () => {
    it('должен очистить заказы профиля', () => {
      const stateWithData = {
        orders: mockOrders,
        loading: false,
        error: null,
        wsConnected: true,
        wsError: null
      };
      
      const state = reducer(stateWithData, clearProfileOrders());
      
      expect(state).toEqual({
        orders: [],
        loading: false,
        error: null,
        wsConnected: true,
        wsError: null
      });
    });
  });

  describe('synchronous actions', () => {
    it('должен возвращать текущее состояние для неизвестного действия.', () => {
      const stateWithData = {
        orders: mockOrders,
        loading: false,
        error: null,
        wsConnected: true,
        wsError: null
      };
      
      const state = reducer(stateWithData, { type: 'UNKNOWN_ACTION' });
      expect(state).toBe(stateWithData);
    });
  });
});