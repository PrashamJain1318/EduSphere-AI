import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
  user,
  token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateXPAndStreak: (state, action) => {
      if (state.user) {
        state.user.xp = action.payload.xp;
        if (action.payload.streak !== undefined) {
          state.user.streak = action.payload.streak;
        }
        if (action.payload.badges) {
          state.user.badges = action.payload.badges;
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  loginSuccess,
  logout,
  setLoading,
  setError,
  clearError,
  updateXPAndStreak,
} = authSlice.actions;

export default authSlice.reducer;
