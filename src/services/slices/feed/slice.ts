import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
  wsError: string | null;
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

export const fetchFeeds = createAsyncThunk('feed/fetchAll', async () => {
  console.log('fetchFeeds thunk called');
  const response = await getFeedsApi();
  console.log('fetchFeeds response:', response);
  return response;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnectionStart: (state, action: PayloadAction<string>) => {
      // Начинаем подключение WebSocket
      state.loading = true;
      state.wsConnected = false;
      state.wsError = null;
    },
    wsConnectionSuccess: (state) => {
      console.log('WebSocket connected successfully');
      state.wsConnected = true;
      state.wsError = null;
      state.loading = false; // Важно: сбрасываем loading при успешном подключении
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      console.log('WebSocket error:', action.payload);
      state.wsConnected = false;
      state.wsError = action.payload;
      state.loading = false; // Сбрасываем loading при ошибке
    },
    wsConnectionClosed: (state) => {
      console.log('WebSocket closed');
      state.wsConnected = false;
      state.loading = false;
    },
    wsGetMessage: (state, action: PayloadAction<TOrdersData>) => {
      console.log('WebSocket message received:', action.payload);
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.loading = false; // Сбрасываем loading при получении данных
      state.error = null; // Сбрасываем ошибки
    },
    clearFeed: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        console.log('fetchFeeds pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        console.log('fetchFeeds fulfilled:', action.payload);
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        console.log('fetchFeeds rejected:', action.error);
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      });
  }
});

export const {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage,
  clearFeed
} = feedSlice.actions;
export default feedSlice.reducer;
