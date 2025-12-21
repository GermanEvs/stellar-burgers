import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export type TProfileOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
  wsError: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null,
  wsConnected: false,
  wsError: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchAll',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsProfileConnectionStart: (state, action: PayloadAction<string>) => {},
    wsProfileConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },
    wsProfileConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.wsError = action.payload;
    },
    wsProfileConnectionClosed: (state) => {
      state.wsConnected = false;
    },
    wsProfileGetMessage: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export const {
  wsProfileConnectionStart,
  wsProfileConnectionSuccess,
  wsProfileConnectionError,
  wsProfileConnectionClosed,
  wsProfileGetMessage,
  clearProfileOrders
} = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
