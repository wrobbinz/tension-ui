const Database = use('Database')


class NoteController {
  // GET
  async index() {
    try {
      return Database
        .select('*')
        .from('notes')
        .paginate(1, 10)
    } catch (err) {
      throw new Error('[ERROR] Unable to get notes...')
    }
  }
  // GET :id
  async show({ params }) {
    try {
      const { id } = params
      return Database
        .select('*')
        .from('notes')
        .where({ id })
    } catch (err) {
      throw new Error('[ERROR] Unable to fetch note...')
    }
  }
  // POST
  async store({ request }) {
    try {
      const [id] = await Database
        .insert(request.post())
        .into('notes')
        .returning('id')
      return Database
        .select('*')
        .from('notes')
        .where({ id })
    } catch (err) {
      throw new Error('[ERROR] Note creation failed...')
    }
  }
  // PUT/PATCH
  async update({ params, request }) {
    try {
      const { id } = params
      return Database
        .table('notes')
        .where({ id })
        .update(request.post())
        .returning('id')
        .then(() => Database
          .select('*')
          .from('notes')
          .where({ id }))
    } catch (err) {
      throw new Error('[ERROR] Note update failed...')
    }
  }
  // DELETE
  async destroy({ params }) {
    try {
      const { id } = params
      return Database
        .table('notes')
        .where({ id })
        .delete()
    } catch (err) {
      throw new Error('[ERROR] Failed to delete note...')
    }
  }
}

module.exports = NoteController
