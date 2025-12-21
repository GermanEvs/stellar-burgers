import { RootState } from '../../store';
import { TOrder } from '@utils-types';

export const getOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;

export const getOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;

export const getCurrentOrder = (state: RootState): TOrder | null =>
  state.order.currentOrder;

export const getOrderError = (state: RootState): string | null =>
  state.order.error;
