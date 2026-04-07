import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchLessons = createAsyncThunk('lessons/fetchAll', () =>
  api.get('/lessons')
);
export const scheduleLesson = createAsyncThunk('lessons/schedule', (data) =>
  api.post('/lessons', data)
);
export const cancelLesson = createAsyncThunk('lessons/cancel', async (id) => {
  await api.delete(`/lessons/${id}`);
  return id;
});

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending,    (state)         => { state.status = 'loading'; })
      .addCase(fetchLessons.fulfilled,  (state, action) => { state.status = 'success'; state.items = action.payload ?? []; })
      .addCase(fetchLessons.rejected,   (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(scheduleLesson.fulfilled,(state, action) => { state.items.push(action.payload); })
      .addCase(cancelLesson.fulfilled,  (state, action) => { state.items = state.items.filter((l) => l.ID !== action.payload); });
  },
});

export default lessonsSlice.reducer;
