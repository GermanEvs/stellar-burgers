import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

// Регистрация
export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    console.log('register thunk called with data:', data);
    const response = await registerUserApi(data);
    console.log('register response:', response);

    // ВАЖНОЕ ИСПРАВЛЕНИЕ: Сохраняем токен КАК ЕСТЬ (с "Bearer ")
    const accessToken = response.accessToken;
    console.log('Access token to save:', accessToken);

    setCookie('accessToken', accessToken, {
      expires: 20 * 60 // 20 минут в секундах
    });

    console.log('Cookie after set:', document.cookie);
    localStorage.setItem('refreshToken', response.refreshToken);
    console.log('Refresh token saved to localStorage');

    return response.user;
  }
);

// Вход
export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    console.log('login thunk called with data:', { ...data, password: '***' });
    const response = await loginUserApi(data);
    console.log('login response:', response);

    // ВАЖНОЕ ИСПРАВЛЕНИЕ: Сохраняем токен КАК ЕСТЬ (с "Bearer ")
    const accessToken = response.accessToken;
    console.log('Access token to save:', accessToken);

    setCookie('accessToken', accessToken, {
      expires: 20 * 60 // 20 минут в секундах
    });

    console.log('Cookie after set:', document.cookie);
    localStorage.setItem('refreshToken', response.refreshToken);
    console.log('Refresh token saved to localStorage');

    return response.user;
  }
);

// Выход
export const logout = createAsyncThunk('user/logout', async () => {
  console.log('logout thunk called');
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('Tokens cleared, cookie after delete:', document.cookie);
});

// Проверка авторизации
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    console.log('checkUserAuth called');
    console.log('All cookies:', document.cookie);
    console.log(
      'localStorage refreshToken:',
      localStorage.getItem('refreshToken')
    );

    const accessToken = getCookie('accessToken');
    console.log(
      'Access token from getCookie:',
      accessToken ? 'exists' : 'missing'
    );
    console.log('Access token value:', accessToken);
    console.log(
      'Token starts with Bearer?',
      accessToken?.startsWith('Bearer ')
    );

    // Если нет токена, просто возвращаем null (не reject)
    if (!accessToken) {
      console.log('checkUserAuth: no token, returning null');
      return null;
    }

    try {
      console.log(
        'checkUserAuth: calling getUserApi with token:',
        accessToken.substring(0, 20) + '...'
      );
      const response = await getUserApi();
      console.log('checkUserAuth: getUserApi success, user:', response.user);
      return response.user;
    } catch (error: any) {
      console.log('checkUserAuth: getUserApi error:', error.message);
      // Если токен невалидный, очищаем куки
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('Tokens cleared due to error');

      // Возвращаем null вместо reject
      return null;
    }
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    console.log('updateUser called with data:', data);
    const response = await updateUserApi(data);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      console.log('setAuthChecked reducer called with:', action.payload);
      state.isAuthChecked = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(register.pending, (state) => {
        console.log('register.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('register.fulfilled, user:', action.payload);
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        console.log('State after register:', state);
      })
      .addCase(register.rejected, (state, action) => {
        console.log('register.rejected, error:', action.error.message);
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Вход
      .addCase(login.pending, (state) => {
        console.log('login.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('login.fulfilled, user:', action.payload);
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        console.log('State after login:', state);
      })
      .addCase(login.rejected, (state, action) => {
        console.log('login.rejected, error:', action.error.message);
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // Выход
      .addCase(logout.pending, (state) => {
        console.log('logout.pending');
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('logout.fulfilled');
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
        console.log('State after logout:', state);
      })
      .addCase(logout.rejected, (state, action) => {
        console.log('logout.rejected, error:', action.error.message);
        state.loading = false;
        state.error = action.error.message || 'Ошибка выхода';
      })
      // Проверка авторизации
      .addCase(checkUserAuth.pending, (state) => {
        console.log('checkUserAuth.pending');
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        console.log('checkUserAuth.fulfilled, user:', action.payload);
        state.loading = false;
        state.user = action.payload; // Может быть null или user
        state.isAuthChecked = true;
        console.log('State after checkUserAuth fulfilled:', state);
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        console.log('checkUserAuth.rejected', action.error);
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
        console.log('State after checkUserAuth rejected:', state);
      })
      // Обновление данных
      .addCase(updateUser.pending, (state) => {
        console.log('updateUser.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log('updateUser.fulfilled, user:', action.payload);
        state.loading = false;
        state.user = action.payload;
        console.log('State after updateUser:', state);
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.log('updateUser.rejected, error:', action.error.message);
        state.loading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      });
  }
});

export const { setAuthChecked, clearUserError, clearUser } = userSlice.actions;
export default userSlice.reducer;
