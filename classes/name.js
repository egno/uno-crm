class Name {
  constructor (val) {
    this.fullName = val
  }

  get jsonObject () {
    return this
  }

  set fullName (val) {
    if (val && (typeof val === 'object')) {
      this.forename = val.forename
      this.surname = val.surname
      this.fullname = val.fullname
      return
    }
    if (typeof val === 'string') {
      [this.forename, this.surname] = val.split(' ')
      this.fullname = val
    } else {
      this.forename = ''
      this.surname = ''
      this.fullname = ''
    }
  }

  get fullName () {
    if (this.forename && this.surname) {
      return `${this.forename} ${this.surname}`
    } else if (this.forename) {
      return this.forename
    } else {
      return this.fullname
    }
  }
}

export default Name
