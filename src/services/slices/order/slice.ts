import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientsIds: string[], { rejectWithValue }) => {
    console.log('createOrder thunk STARTED with ingredients:', ingredientsIds);

    // УБИРАЕМ таймаут - он мешает диагностике
    try {
      console.log('Calling orderBurgerApi...');
      const startTime = Date.now();

      // Просто вызываем API без таймаута
      const response = await orderBurgerApi(ingredientsIds);

      const endTime = Date.now();
      console.log(
        'orderBurgerApi SUCCESS. Time taken:',
        endTime - startTime,
        'ms'
      );
      console.log('orderBurgerApi response:', response);

      if (!response || !response.success) {
        throw new Error('Неверный ответ от сервера');
      }

      return response.order;
    } catch (error: any) {
      console.log('orderBurgerApi ERROR DETAILS:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return rejectWithValue(error.message || 'Ошибка создания заказа');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      console.log('order/slice: clearOrder reducer called');
      state.orderModalData = null;
      state.currentOrder = null;
      state.error = null;
    },
    setOrderError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        console.log('order/slice: createOrder.pending');
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log('order/slice: createOrder.fulfilled');
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        console.log('order/slice: createOrder.rejected', action.error);
        state.orderRequest = false;
        state.error = (action.payload as string) || 'Ошибка создания заказа';
      })
      // Получение заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка получения заказа';
      });
  }
});

export const { clearOrder, setOrderError } = orderSlice.actions;
export default orderSlice.reducer;
