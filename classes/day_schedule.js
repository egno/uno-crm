import ApiObject from '~/classes/api_object'

function formatTime (val) {
  if (!val || typeof val !== 'string') {
    return null
  }
  return val
}

class DaySchedule extends ApiObject {
  set jsonObject (newVal) {
    if (newVal && Array.isArray(newVal) && newVal.length % 2 == 1) {
      newVal.push('00:00')
    }
    this._data = (newVal && newVal.data) || []
  }

  get jsonObject () {
    return this._data
  }

  get timeBegin () {
    return this._data && Array.isArray(this._data) && formatTime(this._data[0])
  }

  get timeEnd () {
    return (
      this._data &&
      Array.isArray(this._data) &&
      formatTime(this._data[this._data.length - 1])
    )
  }

  get lunchBreaks () {
    if (
      this._data &&
      Array.isArray(this._data) &&
      this._data[this._data.length] > 2
    ) {
      return [
        {
          timeBegin: formatTime(this._data[1]),
          timeEnd: formatTime(this._data[2])
        }
      ]
    }
    return []
  }
}

export default DaySchedule
