import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors, createInstructor, deleteInstructor } from '../store/slices/instructorsSlice';

export function useInstructors() {
  const dispatch = useDispatch();
  const { items: instructors, status, error } = useSelector((state) => state.instructors);

  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);

  return {
    instructors,
    loading: status === 'loading',
    error,
    create: (data) => dispatch(createInstructor(data)),
    remove: (id)   => dispatch(deleteInstructor(id)),
  };
}
