import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchPayments = createAsyncThunk('payments/fetchAll', (studentId = '') =>
  api.get(studentId ? `/payments?student_id=${studentId}` : '/payments')
);
export const recordPayment = createAsyncThunk('payments/record', (data) =>
  api.post('/payments', data)
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending,   (state)         => { state.status = 'loading'; })
      .addCase(fetchPayments.fulfilled, (state, action) => { state.status = 'success'; state.items = action.payload ?? []; })
      .addCase(fetchPayments.rejected,  (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(recordPayment.fulfilled, (state, action) => { state.items.push(action.payload); });
  },
});

export default paymentsSlice.reducer;
