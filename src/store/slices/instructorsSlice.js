import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

const normalizeInstructor = (instructor) => {
  const user = instructor?.utilisateur ?? instructor?.Utilisateur ?? instructor?.user ?? instructor?.User ?? {};

  return {
    ...instructor,
    id: instructor?.id ?? instructor?.ID ?? user?.id ?? user?.ID ?? '',
    nom: instructor?.nom ?? instructor?.Nom ?? user?.nom ?? user?.Nom ?? '',
    prenom: instructor?.prenom ?? instructor?.Prenom ?? user?.prenom ?? user?.Prenom ?? '',
    cin: instructor?.cin ?? instructor?.Cin ?? user?.cin ?? user?.Cin ?? '',
    email: instructor?.email ?? instructor?.Email ?? user?.email ?? user?.Email ?? '',
    num_telephone: instructor?.num_telephone ?? instructor?.NumTelephone ?? user?.num_telephone ?? user?.NumTelephone ?? '',
    date_validite_permis: instructor?.date_validite_permis ?? instructor?.DateValiditePermis ?? '',
    date_validite_liscence: instructor?.date_validite_liscence ?? instructor?.DateValiditeLiscence ?? '',
    specialite: instructor?.specialite ?? instructor?.Specialite ?? '',
    status: instructor?.status ?? instructor?.Status ?? 'active',
  };
};

export const fetchInstructors = createAsyncThunk('instructors/fetchAll', () =>
  api.get('/instructors')
);
export const createInstructor = createAsyncThunk('instructors/create', (data) =>
  api.post('/instructors', data)
);
export const promoteToInstructor = createAsyncThunk('instructors/promote', (data) =>
  api.post('/instructors/me/promote', data)
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
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = (action.payload ?? []).map(normalizeInstructor);
      })
      .addCase(fetchInstructors.rejected,  (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(createInstructor.fulfilled, (state, action) => { state.items.push(normalizeInstructor(action.payload)); })
      .addCase(promoteToInstructor.fulfilled, (state, action) => {
        const created = normalizeInstructor(action.payload);
        const exists = state.items.some((i) => i.id === created.id);
        state.items = exists ? state.items.map((i) => (i.id === created.id ? created : i)) : [...state.items, created];
      })
      .addCase(deleteInstructor.fulfilled, (state, action) => {
        state.items = state.items.map((i) => (
          i.id === action.payload
            ? { ...i, status: 'inactive' }
            : i
        ));
      });
  },
});

export default instructorsSlice.reducer;
