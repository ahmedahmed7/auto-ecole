import { useDispatch, useSelector } from 'react-redux';
import { signup, login, logout } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated: !!token,
    loading: status === 'loading',
    error,
    signup: (data) => dispatch(signup(data)),
    login:  (data) => dispatch(login(data)),
    logout: ()     => dispatch(logout()),
  };
}
