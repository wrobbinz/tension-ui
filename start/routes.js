const Route = use('Route')
const prefix = 'api/v1'


Route.get('/', ({ request }) => ({ greeting: 'prolificr' }))


// User
Route.group(() => {
  Route.resource('users', 'UserController')
    .apiOnly()
    .middleware(new Map([
      [['users.show', 'users.update', 'users.destroy'], ['auth']],
    ]))
}).prefix(prefix)

Route.post('login', 'UserController.login').prefix(prefix)

// Notes
Route.group(() => {
  Route.resource('notes', 'NoteController')
    .apiOnly()
    .middleware(['auth'])
}).prefix(prefix)
