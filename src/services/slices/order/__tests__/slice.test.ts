import reducer, { 
  createOrder, 
  fetchOrderByNumber,
  clearOrder,
  resetOrderConfirmation,
  setOrderError,
  TOrderState 
} from '../slice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order_1',
  status: 'done',
  name: 'Space флюоресцентный бургер',
  createdAt: '2023-10-10T10:00:00.000Z',
  updatedAt: '2023-10-10T10:00:00.000Z',
  number: 12345,
  ingredients: ['bun_1', 'main_1']
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  error: null,
  isOrderConfirmed: false
};

describe('order reducer', () => {
  describe('initial state', () => {
    it('должен вернуть исходное состояние', () => {
      const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('createOrder', () => {
    it('обработчик createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        orderRequest: true,
        orderModalData: null,
        currentOrder: null,
        error: null,
        isOrderConfirmed: false
      });
    });

    it('обработчик createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const pendingState = reducer(initialState, { 
        type: createOrder.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orderRequest: false,
        orderModalData: mockOrder,
        currentOrder: null,
        error: null,
        isOrderConfirmed: true
      });
    });

    it('обработчик createOrder.rejected', () => {
      const errorMessage = 'Недостаточно ингредиентов';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const pendingState = reducer(initialState, { 
        type: createOrder.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        error: errorMessage,
        isOrderConfirmed: false
      });
    });
  });

  describe('fetchOrderByNumber', () => {
    it('обработчик fetchOrderByNumber.pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = reducer(initialState, action);
      
      expect(state.orderRequest).toBe(true);
    });

    it('обработчик fetchOrderByNumber.fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const pendingState = reducer(initialState, { 
        type: fetchOrderByNumber.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orderRequest: false,
        orderModalData: null,
        currentOrder: mockOrder,
        error: null,
        isOrderConfirmed: false
      });
    });

    it('обработчик fetchOrderByNumber.rejected', () => {
      const errorMessage = 'Заказ не найден';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const pendingState = reducer(initialState, { 
        type: fetchOrderByNumber.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        error: errorMessage,
        isOrderConfirmed: false
      });
    });
  });

  describe('synchronous actions', () => {
    it('обработчик clearOrder', () => {
      const stateWithOrder: TOrderState = {
        orderRequest: false,
        orderModalData: mockOrder,
        currentOrder: mockOrder,
        error: 'Some error',
        isOrderConfirmed: true
      };
      
      const state = reducer(stateWithOrder, clearOrder());
      
      expect(state).toEqual({
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        error: null,
        isOrderConfirmed: false
      });
    });

    it('обработчик resetOrderConfirmation', () => {
      const stateConfirmed: TOrderState = {
        ...initialState,
        isOrderConfirmed: true
      };
      
      const state = reducer(stateConfirmed, resetOrderConfirmation());
      
      expect(state.isOrderConfirmed).toBe(false);
      expect(state).toEqual({
        ...initialState,
        isOrderConfirmed: false
      });
    });

    it('обработчик setOrderError', () => {
      const errorMessage = 'Custom error message';
      const state = reducer(initialState, setOrderError(errorMessage));
      
      expect(state.error).toBe(errorMessage);
      expect(state).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('должен возвращать текущее состояние для неизвестного действия.', () => {
      const stateWithData: TOrderState = {
        orderRequest: true,
        orderModalData: mockOrder,
        currentOrder: null,
        error: null,
        isOrderConfirmed: false
      };
      
      const state = reducer(stateWithData, { type: 'UNKNOWN_ACTION' });
      expect(state).toBe(stateWithData);
    });
  });
});