import { RootState } from '../../store';
import { TUser } from '@utils-types';

export const getUser = (state: RootState): TUser | null => state.user.user;

export const isAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;

export const getUserLoading = (state: RootState): boolean => state.user.loading;

export const getUserError = (state: RootState): string | null =>
  state.user.error;

export const isAuthenticated = (state: RootState): boolean =>
  !!state.user.user && state.user.isAuthChecked;
