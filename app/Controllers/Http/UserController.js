const User = use('App/Models/User')


class UserController {
  // POST
  async login({ auth, request, response }) {
    try {
      const { email, password } = request.all()
      return auth.attempt(email, password)
    } catch (err) {
      return response.status(500).send({ error: 'Failed to login.' })
    }
  }

  // GET
  async index({ response }) {
    try {
      const users = User.all()
      response.send(users)
    } catch (err) {
      response.status(500).send({ error: 'Failed to GET users.' })
    }
  }
  // GET :id
  async show({ auth, params, response }) {
    try {
      if (auth.user.id === Number(params.id)) {
        response.send(auth.user)
      } else {
        response.status(403).send({ error: 'You don\'t have permission to view this user.' })
      }
    } catch (err) {
      response.status(500).send({ error: `Failed to GET user (id: ${params.id})` })
    }
  }
  // POST
  async store({ request, response }) {
    try {
      const userData = request.only(['email', 'username', 'password'])
      const user = await User.create(userData)
      response.send(user)
    } catch (err) {
      response.status(500).send({ error: 'Failed to POST user.' })
    }
  }
  // PUT/PATCH
  async update({ params, request, response }) {
    try {
      const user = new User()
      user.email = request.post().email
      user.username = request.post().username
      const updatedNote = await User
        .query()
        .where('id', params.id)
        .update(user)
      response.send(updatedNote)
    } catch (err) {
      response.status(500).send({ error: `Failed to PUT note (id: ${params.id}).` })
    }
  }
  // DELETE
  async destroy({ params, response }) {
    try {
      const user = await User.find(params.id)
      await user.delete()
      response.send(user)
    } catch (err) {
      response.status(500).send({ error: `Failed to DELETE user (id: ${params.id}).` })
    }
  }
}

module.exports = UserController
