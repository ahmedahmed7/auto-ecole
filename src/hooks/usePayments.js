import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments, recordPayment } from '../store/slices/paymentsSlice';

export function usePayments() {
  const dispatch = useDispatch();
  const { items: payments, status, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  return {
    payments,
    loading: status === 'loading',
    error,
    record: (data) => dispatch(recordPayment(data)),
  };
}
