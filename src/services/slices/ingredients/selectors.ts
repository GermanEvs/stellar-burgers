import { RootState } from '../../store';
import { TIngredient } from '@utils-types';

export const getIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients;

export const getIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.loading;

export const getIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

export const getBuns = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients.filter(
    (item: TIngredient) => item.type === 'bun'
  );

export const getMains = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients.filter(
    (item: TIngredient) => item.type === 'main'
  );

export const getSauces = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients.filter(
    (item: TIngredient) => item.type === 'sauce'
  );

export const getIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.ingredients.find((item: TIngredient) => item._id === id);
