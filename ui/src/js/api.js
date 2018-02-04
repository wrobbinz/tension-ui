const base = 'http://localhost:3333/api/v1/'
const api = {
  notes: `${base}notes/`,
  users: `${base}users/`,
  login: `${base}login/`,

  config() {
    return {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem('jwtToken')}`,
      },
    }
  },
}

export default api
