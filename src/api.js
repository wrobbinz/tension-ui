import axios from 'axios';


class Api {
  constructor() {
    this.base = 'http://0.0.0.0:4040/api/v0';
  }

  options = () => ({
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
    },
  })

  /* Auth */
  logIn = (credentials) => {
    const url = `${this.base}/login`;
    return axios.post(url, credentials);
  }

  logOut = () => {
    const url = `${this.base}/logout-all`;
    return axios.post(url, {}, this.options());
  }

  /* User */
  createUser = (user) => {
    const url = `${this.base}/users`;
    return axios.post(url, user);
  }

  getCurrentUser = () => {
    const url = `${this.base}/user`;
    return axios.get(url, this.options());
  }

  updateUser = ({ user, data }) => {
    const url = `${this.base}/users/${user.id}`;
    return axios.patch(url, data, this.options());
  }

  listNotes = ({ user }) => {
    const url = `${this.base}/users/${user.id}/notes`;
    return axios.get(url, this.options());
  }

  /* Note */
  createNote = ({ note, user }) => {
    const url = `${this.base}/users/${user.id}/notes`;
    return axios.post(url, note, this.options());
  }

  updateNote = ({ note, data }) => {
    const url = `${this.base}/notes/${note.id}`;
    return axios.patch(url, data, this.options());
  }

  deleteNote = ({ note }) => {
    const { id } = note;
    const url = `${this.base}/notes/${id}`;
    return axios.delete(url, this.options());
  }
}

export default Api;
