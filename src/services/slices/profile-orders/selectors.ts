import { RootState } from '../../store';
import { TOrder } from '@utils-types';

export const getProfileOrders = (state: RootState): TOrder[] =>
  state.profileOrders.orders;

export const getProfileOrdersLoading = (state: RootState): boolean =>
  state.profileOrders.loading;

export const getProfileOrdersError = (state: RootState): string | null =>
  state.profileOrders.error;

export const isProfileWsConnected = (state: RootState): boolean =>
  state.profileOrders.wsConnected;
