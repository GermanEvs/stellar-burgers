// src/__mocks__/@api.ts
// Полный мок для всех API функций

// Типы для TypeScript
export type TRegisterData = {
  email: string;
  password: string;
  name: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

// Мок ингредиента
const mockIngredient = {
  _id: 'test_ingredient_1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'test.jpg',
  image_large: 'test_large.jpg',
  image_mobile: 'test_mobile.jpg'
};

// Мок заказа
const mockOrder = {
  _id: 'test_order_1',
  status: 'done',
  name: 'Test Burger',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['bun_1', 'main_1']
};

// Mock функции
export const getIngredientsApi = jest.fn(async () => [mockIngredient]);

export const getFeedsApi = jest.fn(async () => ({
  orders: [mockOrder],
  total: 100,
  totalToday: 10
}));

export const orderBurgerApi = jest.fn(async (ingredients: string[]) => ({
  order: { ...mockOrder, ingredients }
}));

export const getOrderByNumberApi = jest.fn(async (number: number) => ({
  orders: [{ ...mockOrder, number }]
}));

export const getOrdersApi = jest.fn(async () => [mockOrder]);

export const registerUserApi = jest.fn(async (data: TRegisterData) => ({
  user: { email: data.email, name: data.name },
  accessToken: 'Bearer test_access_token',
  refreshToken: 'test_refresh_token'
}));

export const loginUserApi = jest.fn(async (data: TLoginData) => ({
  user: { email: data.email, name: 'Test User' },
  accessToken: 'Bearer test_access_token',
  refreshToken: 'test_refresh_token'
}));

export const getUserApi = jest.fn(async () => ({
  user: { email: 'test@example.com', name: 'Test User' }
}));

export const updateUserApi = jest.fn(async (data: Partial<TRegisterData>) => ({
  user: { email: data.email || 'test@example.com', name: data.name || 'Updated User' }
}));

export const logoutApi = jest.fn(async () => {});