import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  TConstructorState
} from '../slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

const mockConstructorIngredient: TConstructorIngredient = {
  ...mockIngredient,
  id: 'unique_id_1'
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructor reducer', () => {
  describe('initial state', () => {
    it('должен вернуть initial state', () => {
      const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('addBun', () => {
    it('обработчик addBun action', () => {
      const state = reducer(initialState, addBun(mockBun));
      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('должен заменить существующую булочку', () => {
      const anotherBun: TIngredient = {
        ...mockBun,
        _id: 'bun_2',
        name: 'Флюоресцентная булка'
      };
      
      const stateWithBun = reducer(initialState, addBun(mockBun));
      const state = reducer(stateWithBun, addBun(anotherBun));
      
      expect(state.bun).toEqual(anotherBun);
    });
  });

  describe('addIngredient', () => {
    it('обработчик addIngredient action', () => {
      const state = reducer(initialState, addIngredient(mockIngredient));
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.any(String) // uuid генерируется
      });
    });

    it('должен добавить несколько ингредиентов', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      state = reducer(state, addIngredient(mockIngredient));
      
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('обработчик removeIngredient action', () => {
      const stateWithIngredient = reducer(
        initialState, 
        addIngredient(mockIngredient)
      );
      const ingredientId = stateWithIngredient.ingredients[0].id;
      
      const state = reducer(
        stateWithIngredient, 
        removeIngredient(ingredientId)
      );
      
      expect(state.ingredients).toHaveLength(0);
    });

    it('не удалять ингредиенты по id', () => {
      const stateWithIngredient = reducer(
        initialState, 
        addIngredient(mockIngredient)
      );
      const ingredientId = stateWithIngredient.ingredients[0].id;
      
      const state = reducer(
        stateWithIngredient, 
        removeIngredient('wrong_id')
      );
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe(ingredientId);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен переместить ингредиент выше', () => {
      // Добавляем три ингредиента
      let state = reducer(initialState, addIngredient(mockIngredient));
      const firstId = state.ingredients[0].id;
      
      const secondIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'main_2'
      };
      state = reducer(state, addIngredient(secondIngredient));
      const secondId = state.ingredients[1].id;
      
      const thirdIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'main_3'
      };
      state = reducer(state, addIngredient(thirdIngredient));
      const thirdId = state.ingredients[2].id;
      
      // Перемещаем третий элемент вверх (индекс 2 -> 1)
      state = reducer(state, moveIngredientUp(2));
      
      expect(state.ingredients[0].id).toBe(firstId);
      expect(state.ingredients[1].id).toBe(thirdId);
      expect(state.ingredients[2].id).toBe(secondId);
    });

    it('не перемещает первый ингредиент вверх.', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      state = reducer(state, addIngredient({ ...mockIngredient, _id: 'main_2' }));
      
      const firstId = state.ingredients[0].id;
      const secondId = state.ingredients[1].id;
      
      state = reducer(state, moveIngredientUp(0));
      
      // Порядок не должен измениться
      expect(state.ingredients[0].id).toBe(firstId);
      expect(state.ingredients[1].id).toBe(secondId);
    });
  });

  describe('moveIngredientDown', () => {
    it('должен переместить ингредиент вниз', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      const firstId = state.ingredients[0].id;
      
      state = reducer(state, addIngredient({ ...mockIngredient, _id: 'main_2' }));
      const secondId = state.ingredients[1].id;
      
      state = reducer(state, addIngredient({ ...mockIngredient, _id: 'main_3' }));
      const thirdId = state.ingredients[2].id;
      
      
      state = reducer(state, moveIngredientDown(0));
      
      expect(state.ingredients[0].id).toBe(secondId);
      expect(state.ingredients[1].id).toBe(firstId);
      expect(state.ingredients[2].id).toBe(thirdId);
    });

    it('не перемещает последний ингредиент вниз', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      state = reducer(state, addIngredient({ ...mockIngredient, _id: 'main_2' }));
      
      const firstId = state.ingredients[0].id;
      const secondId = state.ingredients[1].id;
      
      state = reducer(state, moveIngredientDown(1));
      
     
      expect(state.ingredients[0].id).toBe(firstId);
      expect(state.ingredients[1].id).toBe(secondId);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить ингредиенты и булки', () => {
      let state = reducer(initialState, addBun(mockBun));
      state = reducer(state, addIngredient(mockIngredient));
      state = reducer(state, addIngredient({ ...mockIngredient, _id: 'main_2' }));
      
      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);
      
      state = reducer(state, clearConstructor());
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});