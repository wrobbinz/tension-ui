const base = 'http://0.0.0.0:4000/api/v0/';
const api = {
  notes: `${base}users/1/notes`,
  makeNote: `${base}notes/`,
  users: `${base}user`,
  login: `${base}login`,

  config() {
    return {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
      },
    };
  },
};

export default api;
