import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

const normalizeLesson = (lesson) => ({
  ...lesson,
  id: lesson?.id ?? lesson?.ID ?? '',
  candidat_id:
    lesson?.candidat_id ??
    lesson?.CandidatID ??
    lesson?.student_id ??
    lesson?.StudentID ??
    '',
  date_h_debut:
    lesson?.date_h_debut ??
    lesson?.DateHDebut ??
    lesson?.scheduled_at ??
    lesson?.ScheduledAt ??
    '',
  date_h_fin:
    lesson?.date_h_fin ??
    lesson?.DateHFin ??
    lesson?.end_at ??
    lesson?.EndAt ??
    '',
  lieu_rencontre:
    lesson?.lieu_rencontre ??
    lesson?.LieuRencontre ??
    lesson?.location ??
    lesson?.Location ??
    '',
});

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
      .addCase(fetchLessons.fulfilled,  (state, action) => {
        state.status = 'success';
        state.items = (action.payload ?? []).map(normalizeLesson);
      })
      .addCase(fetchLessons.rejected,   (state, action) => { state.status = 'failed';  state.error = action.error.message; })
      .addCase(scheduleLesson.fulfilled,(state, action) => { state.items.push(normalizeLesson(action.payload)); })
      .addCase(cancelLesson.fulfilled,  (state, action) => { state.items = state.items.filter((l) => l.id !== action.payload); });
  },
});

export default lessonsSlice.reducer;
