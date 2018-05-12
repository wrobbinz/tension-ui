const { each } = require('lodash')

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
    } catch (error) {
      response.status(500).send(error)
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
    } catch (error) {
      response.status(500).send(error)
    }
  }
  // POST
  async store({ auth, request, response }) {
    try {
      const noteData = request.only(['title', 'content', 'tags'])
      const notes = await Note
        .query()
        .where('owned_by', '=', auth.user.id)
        .fetch()
      console.log(notes)
      noteData.order = notes.length
      noteData.owned_by = auth.user.id
      const note = await Note.create(noteData)
      response.send(note)
    } catch (error) {
      response.status(500).send(error)
    }
  }
  // PUT/PATCH
  async update({ params, request, response }) {
    try {
      const note = new Note()
      each(request.post(), (value, key) => {
        note[key] = value
      })
      await Note
        .query()
        .where('id', params.id)
        .update(note)
      const updatedNote = await Note
        .find(params.id)
      response.send(updatedNote)
    } catch (error) {
      response.status(500).send(error)
    }
  }
  // DELETE
  async destroy({ params, response }) {
    try {
      const note = await Note.find(params.id)
      await note.delete()
      response.send(note)
    } catch (error) {
      response.status(500).send(error)
    }
  }
}

module.exports = NoteController
