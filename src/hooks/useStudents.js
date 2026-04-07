import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, createStudent, deleteStudent } from '../store/slices/studentsSlice';

export function useStudents() {
  const dispatch = useDispatch();
  const { items: students, status, error } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  return {
    students,
    loading: status === 'loading',
    error,
    create: (data) => dispatch(createStudent(data)),
    remove: (id)   => dispatch(deleteStudent(id)),
  };
}
