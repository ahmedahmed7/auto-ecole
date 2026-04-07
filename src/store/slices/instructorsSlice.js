import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchInstructors = createAsyncThunk('instructors/fetchAll', () =>
  api.get('/instructors')
);
export const createInstructor = createAsyncThunk('instructors/create', (data) =>
  api.post('/instructors', data)
);
export const deleteInstructor = createAsyncThunk('instructors/delete', async (id) => {
  await api.delete(`/instructors/${id}`);
  return id;
});

const instructorsSlice = createSlice({
  name: 'instructors',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructors.pending,   (state)         => { state.status = 'loading'; })
      .addCase(fetchInstructors.fulfilled, (state, action) => { state.status = 'success'; state.items = action.payload ?? []; })
      .addCase(fetchInstructors.rejected,  (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(createInstructor.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(deleteInstructor.fulfilled, (state, action) => { state.items = state.items.filter((i) => i.ID !== action.payload); });
  },
});

export default instructorsSlice.reducer;
