import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchVehicules = createAsyncThunk('vehicules/fetchAll', () =>
  api.get('/vehicules')
);
export const createVehicule = createAsyncThunk('vehicules/create', (data) =>
  api.post('/vehicules', data)
);
export const deleteVehicule = createAsyncThunk('vehicules/delete', async (id) => {
  await api.delete(`/vehicules/${id}`);
  return id;
});

const vehiculesSlice = createSlice({
  name: 'vehicules',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicules.pending,   (state)         => { state.status = 'loading'; })
      .addCase(fetchVehicules.fulfilled, (state, action) => { state.status = 'success'; state.items = action.payload ?? []; })
      .addCase(fetchVehicules.rejected,  (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(createVehicule.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(deleteVehicule.fulfilled, (state, action) => { state.items = state.items.filter((v) => v.ID !== action.payload); });
  },
});

export default vehiculesSlice.reducer;
