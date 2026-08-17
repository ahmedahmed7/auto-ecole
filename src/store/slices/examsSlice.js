import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

const normalizeExam = (exam) => ({
  ...exam,
  id: exam?.id ?? exam?.ID ?? '',
  candidat_id: exam?.candidat_id ?? exam?.CandidatID ?? exam?.student_id ?? exam?.StudentID ?? '',
  nature: exam?.nature ?? exam?.Nature ?? '',
  categorie: exam?.categorie ?? exam?.Categorie ?? '',
  date_examen: exam?.date_examen ?? exam?.DateExamen ?? '',
  centre: exam?.centre ?? exam?.Centre ?? '',
  convocation: exam?.convocation ?? exam?.Convocation ?? '',
  numero_liste: exam?.numero_liste ?? exam?.NumeroListe ?? '',
  etat: exam?.etat ?? exam?.Etat ?? '',
  vehicule_id: exam?.vehicule_id ?? exam?.VehiculeID ?? '',
});

export const fetchExams = createAsyncThunk('exams/fetchAll', (candidatId = '') =>
  api.get(candidatId ? `/exams?candidat_id=${candidatId}` : '/exams')
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
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = (action.payload ?? []).map(normalizeExam);
      })
      .addCase(fetchExams.rejected,  (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(recordExam.fulfilled, (state, action) => { state.items.push(normalizeExam(action.payload)); });
  },
});

export default examsSlice.reducer;
