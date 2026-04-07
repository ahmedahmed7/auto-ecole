import { configureStore } from '@reduxjs/toolkit';
import authReducer        from './slices/authSlice';
import studentsReducer    from './slices/studentsSlice';
import instructorsReducer from './slices/instructorsSlice';
import lessonsReducer     from './slices/lessonsSlice';
import examsReducer       from './slices/examsSlice';
import paymentsReducer    from './slices/paymentsSlice';
import vehiculesReducer   from './slices/vehiculesSlice';

export const store = configureStore({
  reducer: {
    auth:        authReducer,
    students:    studentsReducer,
    instructors: instructorsReducer,
    lessons:     lessonsReducer,
    exams:       examsReducer,
    payments:    paymentsReducer,
    vehicules:   vehiculesReducer,
  },
});
