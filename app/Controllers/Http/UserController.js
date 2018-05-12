const { each } = require('lodash')

const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {
  // POST
  async login({ auth, request, response }) {
    try {
      const { email, password } = request.all()
      return auth.attempt(email, password)
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  // GET
  async index({ auth, response }) {
    try {
      response.send(auth.user)
    } catch (error) {
      response.status(500).send(error)
    }
  }
  // GET :id
  async show({ auth, params, response }) {
    try {
      if (auth.user.id === Number(params.id)) {
        response.send(auth.user)
      } else {
        response.status(403).send({ message: 'You don\'t have permission to view this user.' })
      }
    } catch (error) {
      response.status(500).send(error)
    }
  }
  // POST
  async store({ request, response }) {
    try {
      const userData = request.only(['email', 'username', 'password'])
      const user = await User.create(userData)
      response.send(user)
    } catch (error) {
      response.status(500).send(error)
    }
  }
  // PUT/PATCH
  async update({ params, request, response }) {
    try {
      const user = new User()
      each(request.post(), (value, key) => {
        user[key] = key === 'tags' ? JSON.stringify(value) : value
      })
      await User
        .query()
        .where('id', params.id)
        .update(user)
      const updatedUser = await User
        .find(params.id)
      response.send(updatedUser)
    } catch (error) {
      response.status(500).send(error)
    }
  }
  // DELETE
  async destroy({ params, response }) {
    try {
      const user = await User.find(params.id)
      await user.delete()
      response.send(user)
    } catch (error) {
      response.status(500).send(error)
    }
  }
}

module.exports = UserController
