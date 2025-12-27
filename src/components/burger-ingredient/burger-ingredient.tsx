import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructor/slice';
import { getIngredientCount } from '../../services/slices/constructor/selectors';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const currentCount = useSelector(getIngredientCount(ingredient._id));

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={currentCount > 0 ? currentCount : undefined}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
