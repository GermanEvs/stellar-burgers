import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredientById } from '../../services/slices/ingredients/selectors';
import { fetchIngredients } from '../../services/slices/ingredients/slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredientData = useSelector(getIngredientById(id || ''));

  // Загружаем ингредиенты если их нет
  useEffect(() => {
    if (!ingredientData) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientData, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
