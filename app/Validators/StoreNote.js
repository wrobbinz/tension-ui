class StoreNote {
  get rules() {
    return {
      title: 'required',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreNote
