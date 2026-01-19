import reducer, { 
  fetchFeeds,
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage,
  clearFeed,
  TFeedState 
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
    status: 'pending',
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

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  wsConnected: false,
  wsError: null
};

describe('feed reducer', () => {
  describe('initial state', () => {
    it('должен вернуться initial state', () => {
      const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('fetchFeeds', () => {
    it('обработчик fetchFeeds.pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: true,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });

    it('обработчик fetchFeeds.fulfilled', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockOrdersData
      };
      const pendingState = reducer(initialState, { 
        type: fetchFeeds.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });

    it('обработчик fetchFeeds.rejected', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const pendingState = reducer(initialState, { 
        type: fetchFeeds.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: errorMessage,
        wsConnected: false,
        wsError: null
      });
    });
  });

  describe('WebSocket actions', () => {
    it('обработчик wsConnectionStart', () => {
      const url = 'wss://example.com/feed';
      const state = reducer(initialState, wsConnectionStart(url));
      
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: true,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });

    it('обработчик wsConnectionSuccess', () => {
      const state = reducer(initialState, wsConnectionSuccess());
      
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        wsConnected: true,
        wsError: null
      });
    });

    it('обработчик wsConnectionError', () => {
      const errorMessage = 'WebSocket connection failed';
      const state = reducer(initialState, wsConnectionError(errorMessage));
      
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: errorMessage
      });
    });

    it('обработчик wsConnectionClosed', () => {
      const stateWithConnection = { 
        ...initialState, 
        wsConnected: true,
        loading: true 
      };
      const state = reducer(stateWithConnection, wsConnectionClosed());
      
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });

    it('обработчик wsGetMessage', () => {
      const action = wsGetMessage(mockOrdersData);
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });
  });

  describe('clearFeed', () => {
    it('должен очистить данные ленты', () => {
      const stateWithData = {
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: false,
        error: null,
        wsConnected: true,
        wsError: null
      };
      
      const state = reducer(stateWithData, clearFeed());
      
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
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
        total: 100,
        totalToday: 10,
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