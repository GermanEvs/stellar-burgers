import { RootState } from '../../store';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export const getConstructorItems = (state: RootState) => ({
  bun: state.burgerConstructor.bun,
  ingredients: state.burgerConstructor.ingredients
});

export const getConstructorBun = (state: RootState): TIngredient | null =>
  state.burgerConstructor.bun;

export const getConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const getIngredientCount =
  (ingredientId: string) =>
  (state: RootState): number => {
    const { bun, ingredients } = state.burgerConstructor;
    let count = 0;

    if (bun && bun._id === ingredientId) {
      count += 2; // Булки всегда 2 штуки
    }

    count += ingredients.filter(
      (item: TConstructorIngredient) => item._id === ingredientId
    ).length;

    return count;
  };
