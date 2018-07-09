export const base = 'http://0.0.0.0:4000/api/v0';

export const routes = {
  notes: `${base}/notes`,
  users: `${base}/users`,
  currentUser: `${base}/user`,
  login: `${base}/login`,
  logout: `${base}/logout-all`,
};

export const options = () => ({
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
  },
});
