class StoreUser {
  get rules() {
    return {
      email: 'required|email|unique:users,email',
      username: 'required',
      password: 'required',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreUser
