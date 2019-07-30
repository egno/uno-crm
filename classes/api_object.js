class ApiObject {
  constructor (val) {
    this.jsonObject = val
  }

  set jsonObject (newVal) {}

  get jsonObject () {
    if (typeof this._exportedProps === 'string') {
      this._exportedProps = [this._exportedProps]
    }
    return Object.keys(this)
      .filter(
        key =>
          key[0] !== '_' &&
          (!this._exportedProps || this._exportedProps.some(x => x === key))
      )
      .reduce((obj, key) => {
        obj[key] =
          this[key] instanceof ApiObject ? this[key].jsonObject : this[key]
        return obj
      }, {})
  }
}

export default ApiObject
