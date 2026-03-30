export const saveUser = (user) => {
  localStorage.setItem('iot_user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('iot_user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('iot_user');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!getUser();
};
