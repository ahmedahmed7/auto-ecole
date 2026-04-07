const getToken = () => localStorage.getItem('token');

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
};

export const api = {
  get:    (path)       => request(path),
  post:   (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: (path)       => request(path, { method: 'DELETE' }),
};

