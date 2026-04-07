import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons, scheduleLesson, cancelLesson } from '../store/slices/lessonsSlice';

export function useLessons() {
  const dispatch = useDispatch();
  const { items: lessons, status, error } = useSelector((state) => state.lessons);

  useEffect(() => {
    dispatch(fetchLessons());
  }, [dispatch]);

  return {
    lessons,
    loading:  status === 'loading',
    error,
    schedule: (data) => dispatch(scheduleLesson(data)),
    cancel:   (id)   => dispatch(cancelLesson(id)),
  };
}
