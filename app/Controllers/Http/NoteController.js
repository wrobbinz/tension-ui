const Note = use('App/Models/Note')


class NoteController {
  // GET
  async index({ auth, response }) {
    try {
      const notes = await Note
        .query()
        .where('owned_by', '=', auth.user.id)
        .fetch()
      response.send(notes)
    } catch (err) {
      response.status(500).send({ error: 'Failed to GET notes.' })
    }
  }
  // GET :id
  async show({ auth, params, response }) {
    try {
      const note = await Note
        .find(params.id)
      if (auth.user.id === note.owned_by) {
        response.send(note)
      } else {
        response.status(403).send({ error: 'You don\'t have access to this note.' })
      }
    } catch (err) {
      response.status(500).send({ error: `Failed to GET note (id: ${params.id}).` })
    }
  }
  // POST
  async store({ auth, request, response }) {
    try {
      const noteData = request.only(['title', 'content'])
      noteData.owned_by = auth.user.id
      const note = await Note.create(noteData)
      response.send(note)
    } catch (err) {
      response.status(500).send({ message: 'Failed to POST note.', error: err })
    }
  }
  // PUT/PATCH
  async update({ params, request, response }) {
    try {
      const note = new Note()
      note.title = request.post().title
      note.contents = request.post().contents
      const noteId = await Note
        .query()
        .where('id', params.id)
        .update(note)
      const updatedNote = await Note
        .find(params.id)
      response.send(updatedNote)
    } catch (err) {
      response.status(500).send({ error: `Failed to PUT note (id: ${params.id}).` })
    }
  }
  // DELETE
  async destroy({ params, response }) {
    try {
      const note = await Note.find(params.id)
      await note.delete()
      response.send(note)
    } catch (err) {
      response.status(500).send({ error: `Failed to DELETE note (id: ${params.id}).` })
    }
  }
}

module.exports = NoteController
