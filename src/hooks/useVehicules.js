import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicules, createVehicule, deleteVehicule } from '../store/slices/vehiculesSlice';

export function useVehicules() {
  const dispatch = useDispatch();
  const { items: vehicules, status, error } = useSelector((state) => state.vehicules);

  useEffect(() => {
    dispatch(fetchVehicules());
  }, [dispatch]);

  return {
    vehicules,
    loading: status === 'loading',
    error,
    create: (data) => dispatch(createVehicule(data)),
    remove: (id)   => dispatch(deleteVehicule(id)),
  };
}
