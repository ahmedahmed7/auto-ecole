import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchExams = createAsyncThunk('exams/fetchAll', (studentId = '') =>
  api.get(studentId ? `/exams?student_id=${studentId}` : '/exams')
);
export const recordExam = createAsyncThunk('exams/record', (data) =>
  api.post('/exams', data)
);

const examsSlice = createSlice({
  name: 'exams',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending,   (state)         => { state.status = 'loading'; })
      .addCase(fetchExams.fulfilled, (state, action) => { state.status = 'success'; state.items = action.payload ?? []; })
      .addCase(fetchExams.rejected,  (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(recordExam.fulfilled, (state, action) => { state.items.push(action.payload); });
  },
});

export default examsSlice.reducer;
