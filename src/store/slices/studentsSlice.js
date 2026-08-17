import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

const normalizeStudent = (student) => {
  const user = student?.utilisateur ?? student?.Utilisateur ?? student?.user ?? student?.User ?? {};

  return {
    ...student,
    id: student?.id ?? student?.ID ?? user?.id ?? user?.ID ?? '',
    nom: student?.nom ?? student?.Nom ?? user?.nom ?? user?.Nom ?? user?.last_name ?? user?.LastName ?? '',
    prenom: student?.prenom ?? student?.Prenom ?? user?.prenom ?? user?.Prenom ?? user?.name ?? user?.Name ?? '',
    cin: student?.cin ?? student?.Cin ?? user?.cin ?? user?.Cin ?? '',
    email: student?.email ?? student?.Email ?? user?.email ?? user?.Email ?? '',
    num_telephone: student?.num_telephone ?? student?.NumTelephone ?? user?.num_telephone ?? user?.NumTelephone ?? user?.phone ?? user?.Phone ?? '',
    date_de_naissance:
      student?.date_de_naissance ??
      student?.DateNaissance ??
      user?.date_de_naissance ??
      user?.DateNaissance ??
      user?.date_naissance ??
      '',
    lunette: student?.lunette ?? student?.Lunette ?? false,
    observation: student?.observation ?? student?.Observation ?? '',
  };
};

export const fetchStudents = createAsyncThunk('students/fetchAll', () =>
  api.get('/students')
);
export const createStudent = createAsyncThunk('students/create', (data) =>
  api.post('/students', data)
);
export const updateStudent = createAsyncThunk('students/update', ({ id, data }) =>
  api.put(`/students/${id}`, data)
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
      .addCase(fetchStudents.fulfilled, (state, action)  => {
        state.status = 'success';
        state.items = (action.payload ?? []).map(normalizeStudent);
      })
      .addCase(fetchStudents.rejected,  (state, action)  => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(createStudent.fulfilled, (state, action)  => { state.items.push(normalizeStudent(action.payload)); })
      .addCase(updateStudent.fulfilled, (state, action)  => {
        const updated = normalizeStudent(action.payload);
        state.items = state.items.map((s) => (s.id === updated.id ? updated : s));
      })
      .addCase(deleteStudent.fulfilled, (state, action) => { state.items = state.items.filter((s) => s.id !== action.payload); });
  },
});

export default studentsSlice.reducer;
