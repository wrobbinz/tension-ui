const Route = use('Route')
const prefix = 'api/v1'


Route.get('/', () => ({ greeting: 'tension' }))


// User
Route.group(() => {
  Route.resource('users', 'UserController')
    .apiOnly()
    .middleware(new Map([
      [['users.index', 'users.show', 'users.update', 'users.destroy'], ['auth']],
    ]))
    .validator(new Map([
      [['users.store'], ['StoreUser']],
    ]))
}).prefix(prefix)

Route.post('login', 'UserController.login').prefix(prefix)

// Notes
Route.group(() => {
  Route.resource('notes', 'NoteController')
    .apiOnly()
    .middleware(['auth'])
    .validator(new Map([
      [['notes.store'], ['StoreNote']],
    ]))
}).prefix(prefix)
