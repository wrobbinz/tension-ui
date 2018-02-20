const Schema = use('Schema')

class NoteSchema extends Schema {
  up() {
    this.create('notes', (table) => {
      table.increments()
      table.string('title')
      table.json('content')
      table.integer('owned_by')
      table.timestamps()
    })
  }

  down() {
    this.drop('notes')
  }
}

module.exports = NoteSchema
