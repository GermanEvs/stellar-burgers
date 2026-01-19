import reducer, { 
  register, 
  login, 
  logout, 
  checkUserAuth, 
  updateUser,
  setAuthChecked,
  clearUserError,
  clearUser,
  TUserState 
} from '../slice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

describe('user reducer', () => {
  describe('initial state', () => {
    it('должен вернуть initial state', () => {
      const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('register', () => {
    it('обработчик register.pending', () => {
      const action = { type: register.pending.type };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
        loading: true,
        error: null
      });
    });

    it('обработчик register.fulfilled', () => {
      const action = {
        type: register.fulfilled.type,
        payload: mockUser
      };
      const pendingState = reducer(initialState, { 
        type: register.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      });
    });

    it('обработчик register.rejected', () => {
      const errorMessage = 'Email уже используется';
      const action = {
        type: register.rejected.type,
        error: { message: errorMessage }
      };
      const pendingState = reducer(initialState, { 
        type: register.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('login', () => {
    it('обработчик login.pending', () => {
      const action = { type: login.pending.type };
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('обработчик login.fulfilled', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockUser
      };
      const pendingState = reducer(initialState, { 
        type: login.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      });
    });

    it('обработчик login.rejected', () => {
      const errorMessage = 'Неверный email или пароль';
      const action = {
        type: login.rejected.type,
        error: { message: errorMessage }
      };
      const pendingState = reducer(initialState, { 
        type: login.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
      expect(state.user).toBe(null);
    });
  });

  describe('logout', () => {
    it('обработчик logout.pending', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = { type: logout.pending.type };
      const state = reducer(stateWithUser, action);
      
      expect(state.loading).toBe(true);
      expect(state.user).toBe(mockUser);
    });

    it('обработчик logout.fulfilled', () => {
      const stateWithUser = { 
        ...initialState, 
        user: mockUser,
        loading: true 
      };
      const action = { type: logout.fulfilled.type };
      const state = reducer(stateWithUser, action);
      
      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        loading: false,
        error: null
      });
    });

    it('обработчик logout.rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const stateWithUser = { 
        ...initialState, 
        user: mockUser,
        loading: true 
      };
      const action = {
        type: logout.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(stateWithUser, action);
      
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
      expect(state.user).toBe(mockUser);
    });
  });

  describe('checkUserAuth', () => {
    it('обработчик checkUserAuth.pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = reducer(initialState, action);
      
      expect(state.loading).toBe(true);
    });

    it('обработчик checkUserAuth.fulfilled with user', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const pendingState = reducer(initialState, { 
        type: checkUserAuth.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      });
    });

    it('обработчик checkUserAuth.fulfilled with null', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: null
      };
      const pendingState = reducer(initialState, { 
        type: checkUserAuth.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        loading: false,
        error: null
      });
    });

    it('обработчик checkUserAuth.rejected', () => {
      const action = { type: checkUserAuth.rejected.type };
      const pendingState = reducer(initialState, { 
        type: checkUserAuth.pending.type 
      });
      const state = reducer(pendingState, action);
      
      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        loading: false,
        error: null
      });
    });
  });

  describe('updateUser', () => {
    it('обработчик updateUser.pending', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = { type: updateUser.pending.type };
      const state = reducer(stateWithUser, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('обработчик updateUser.fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const stateWithUser = { 
        ...initialState, 
        user: mockUser,
        loading: true 
      };
      const state = reducer(stateWithUser, action);
      
      expect(state).toEqual({
        user: updatedUser,
        isAuthChecked: false,
        loading: false,
        error: null
      });
    });

    it('обработчик updateUser.rejected', () => {
      const errorMessage = 'Ошибка обновления';
      const action = {
        type: updateUser.rejected.type,
        error: { message: errorMessage }
      };
      const stateWithUser = { 
        ...initialState, 
        user: mockUser,
        loading: true 
      };
      const state = reducer(stateWithUser, action);
      
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
      expect(state.user).toBe(mockUser);
    });
  });

  describe('synchronous actions', () => {
    it('обработчик setAuthChecked', () => {
      const state = reducer(initialState, setAuthChecked(true));
      expect(state.isAuthChecked).toBe(true);
      
      const state2 = reducer(state, setAuthChecked(false));
      expect(state2.isAuthChecked).toBe(false);
    });

    it('обработчикclearUserError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const state = reducer(stateWithError, clearUserError());
      expect(state.error).toBe(null);
    });

    it('обработчикclearUser', () => {
      const stateWithUser = { 
        ...initialState, 
        user: mockUser,
        isAuthChecked: false 
      };
      const state = reducer(stateWithUser, clearUser());
      
      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        loading: false,
        error: null
      });
    });

    it('должен возвращать текущее состояние для неизвестного действия', () => {
      const stateWithData = {
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      };
      
      const state = reducer(stateWithData, { type: 'UNKNOWN_ACTION' });
      expect(state).toBe(stateWithData);
    });
  });
});