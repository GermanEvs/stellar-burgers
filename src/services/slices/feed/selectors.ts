import { RootState } from '../../store';
import { TOrder } from '@utils-types';

export const getFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const getFeedTotal = (state: RootState): number => state.feed.total;

export const getFeedTotalToday = (state: RootState): number =>
  state.feed.totalToday;

export const getFeedLoading = (state: RootState): boolean => state.feed.loading;

export const getFeedError = (state: RootState): string | null =>
  state.feed.error;

export const isWsConnected = (state: RootState): boolean =>
  state.feed.wsConnected;
