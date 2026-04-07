import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchStudents = createAsyncThunk('students/fetchAll', () =>
  api.get('/students')
);
export const createStudent = createAsyncThunk('students/create', (data) =>
  api.post('/students', data)
);
export const deleteStudent = createAsyncThunk('students/delete', async (id) => {
  await api.delete(`/students/${id}`);
  return id;
});

const studentsSlice = createSlice({
  name: 'students',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending,   (state)          => { state.status = 'loading'; })
      .addCase(fetchStudents.fulfilled, (state, action)  => { state.status = 'success'; state.items = action.payload ?? []; })
      .addCase(fetchStudents.rejected,  (state, action)  => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(createStudent.fulfilled, (state, action)  => { state.items.push(action.payload); })
      .addCase(deleteStudent.fulfilled, (state, action)  => { state.items = state.items.filter((s) => s.ID !== action.payload); });
  },
});

export default studentsSlice.reducer;
