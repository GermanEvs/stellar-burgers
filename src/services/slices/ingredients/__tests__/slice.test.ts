import reducer, { fetchIngredients, TIngredientsState } from '../slice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun_1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image_url',
    image_large: 'image_large_url',
    image_mobile: 'image_mobile_url'
  },
  {
    _id: 'main_1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'image_url',
    image_large: 'image_large_url',
    image_mobile: 'image_mobile_url'
  },
  {
    _id: 'sauce_1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'image_url',
    image_large: 'image_large_url',
    image_mobile: 'image_mobile_url'
  }
];

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

describe('ingredients reducer', () => {
  describe('initial state', () => {
    it('должен вернуть исходное состояние', () => {
      const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('fetchIngredients', () => {
    it('обработчик fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        ingredients: [],
        loading: true,
        error: null
      });
    });

    it('обработчик fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const pendingState = reducer(initialState, { 
        type: fetchIngredients.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        ingredients: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('обработчик fetchIngredients.rejected', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const pendingState = reducer(initialState, { 
        type: fetchIngredients.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        ingredients: [],
        loading: false,
        error: errorMessage
      });
    });

    it('должен обрабатывать запрос Ingredients.rejected с сообщением об ошибке по умолчанию.', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const pendingState = reducer(initialState, { 
        type: fetchIngredients.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        ingredients: [],
        loading: false,
        error: 'Ошибка загрузки ингредиентов'
      });
    });
  });

  describe('synchronous actions', () => {
    it('должен возвращать текущее состояние для неизвестного действия.', () => {
      const stateWithData = {
        ingredients: mockIngredients,
        loading: false,
        error: null
      };
      
      const state = reducer(stateWithData, { type: 'UNKNOWN_ACTION' });
      expect(state).toBe(stateWithData);
    });
  });
});