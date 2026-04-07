import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, recordExam } from '../store/slices/examsSlice';

export function useExams() {
  const dispatch = useDispatch();
  const { items: exams, status, error } = useSelector((state) => state.exams);

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  return {
    exams,
    loading: status === 'loading',
    error,
    record: (data) => dispatch(recordExam(data)),
  };
}
