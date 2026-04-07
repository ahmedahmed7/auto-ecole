import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

const stored = JSON.parse(localStorage.getItem('auth') || 'null');

export const signup = createAsyncThunk('auth/signup', (data) =>
  api.post('/auth/signup', data)
);
export const login = createAsyncThunk('auth/login', (data) =>
  api.post('/auth/login', data)
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:   stored?.user   ?? null,
    token:  stored?.token  ?? null,
    status: 'idle',
    error:  null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    const handlePending   = (state) => { state.status = 'loading'; state.error = null; };
    const handleFulfilled = (state, action) => {
      state.status = 'success';
      state.user   = action.payload.user;
      state.token  = action.payload.token;
      localStorage.setItem('auth',  JSON.stringify({ user: action.payload.user, token: action.payload.token }));
      localStorage.setItem('token', action.payload.token);
    };
    const handleRejected  = (state, action) => { state.status = 'failed'; state.error = action.error.message; };

    builder
      .addCase(signup.pending,    handlePending)
      .addCase(signup.fulfilled,  handleFulfilled)
      .addCase(signup.rejected,   handleRejected)
      .addCase(login.pending,     handlePending)
      .addCase(login.fulfilled,   handleFulfilled)
      .addCase(login.rejected,    handleRejected);
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
