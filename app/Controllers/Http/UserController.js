const Database = use('Database')
const { validate } = use('Validator')
const User = use('App/Models/User')


class UserController {
  async login({ request, auth }) {
    const { email, password } = request.all()
    return auth.attempt(email, password)
  }

  // GET
  async index() {
    try {
      return User.all()
    } catch (err) {
      throw new Error('[ERROR] Unable to get notes...')
    }
  }
  // GET :id
  async show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }
    return auth.user
  }

  async store({ request }) {
    const rules = {
      email: 'required|email|unique:users,email',
      username: 'required',
      password: 'required',
    }
    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return 'Incorrect credentials. Try again...'
    }
    try {
      const user = new User()

      user.email = request.post().email
      user.username = request.post().username
      user.password = request.post().password

      return user.save()
    } catch (err) {
      throw new Error(`[ERROR] Failed to create user: ${err.message}`)
    }
  }

  destroy() {

  }
}

module.exports = UserController
