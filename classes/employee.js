import ApiObject from '~/classes/api_object'
import Api from '~/api/backend'
import { responseGetId } from '~/api/utils'
import { imagePath } from '~/components/gallery/utils'

/* import DaySchedule from '~/classes/day_schedule'

class ScheduleTemplate extends ApiObject {
  set jsonObject (newVal) {
    this.type = (newVal && newVal.type) || null
    this.data = (newVal && newVal.data) || []
  }

  get jsonObject () {
    return super.jsonObject
  }

  get templates () {
    let weekSchedule = [],
      l = 7
    while (l--) {
      weekSchedule.push(new DaySchedule())
    }
    return [
      {
        title: 'Будние дни',
        type: 'week',
        data: weekSchedule,
        get: function (dt, data) {
          return data[(dt.getDay() + 1) % 7]
        }
      },
        { title: 'Все', type: 'week', data: weekSchedule,
        get: function (dt, data) {
            return data[(dt.getDay() + 1) % 7]
        }},
      {
        title: 'Нечетные числа',
        type: 'shift',
        data: [new DaySchedule(), new DaySchedule()],
          get: function (dt, data) {
              return data[dt.getDate() % 2]
          }
      },
      {
        title: 'Четные числа',
        type: 'shift',
        data: [new DaySchedule(), new DaySchedule()],
          get: function (dt, data) {
              return data[dt.getDate() % 2]
          }
      },
      {
        title: '2/1',
        type: 'shift',
        data: [new DaySchedule(), new DaySchedule(), new DaySchedule()],
        start: null,
        get: function (dt, data) {
            return data[dt.getDate() % 3]
        }
      },
      {
        title: '2/2',
        type: 'shift',
        data: [
          new DaySchedule(),
          new DaySchedule(),
          new DaySchedule(),
          new DaySchedule()
        ],
        start: null
      }
    ]
  }
} */

// class Service extends ApiObject {
//   set jsonObject (newVal) {
//     this.duration = (newVal && newVal.duration) || 60
//     this.group = (newVal && newVal.group) || null
//     this.name = (newVal && newVal.name) || null
//     this.price = (newVal && newVal.price) || 0
//     this.n = (newVal && newVal.n) || 0
//   }

//   get jsonObject () {
//     return super.jsonObject
//   }
// }

class Employee extends ApiObject {
  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set jsonObject (newVal) {
    this.id = (newVal && newVal.id) || null
    this.access = (newVal && newVal.access) || true
    this.parent = (newVal && newVal.parent) || null
    this.j = (newVal && newVal.j) || {}

    this.schedule = this.j.schedule || {}
    if (!newVal || !newVal.j || !newVal.j.phones) {
      this.phones = []
    }
  }

  get jsonObject () {
    return super.jsonObject
  }

  // Properties

  set email (newVal) {
    if (newVal) {
      this.j.email = newVal
    } else {
      delete this.j.email
    }
  }

  get email () {
    return this.j && this.j.email
  }

  /**
   * @param {String} newVal
   */
  set image (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ image: newVal } }
    } else {
      delete this.j.image
    }
  }

  get image () {
    return this.j && this.j.image
  }

  get imagePath () {
    return this.image && imagePath(this.image, this.parent)
  }

  set name (newVal) {
    if (newVal) {
      this.j.name = newVal
    } else {
      delete this.j.name
    }
  }

  get name () {
    return this.j && this.j.name
  }

  set surname (newVal) {
    if (newVal) {
      this.j.surname = newVal
    } else {
      delete this.j.surname
    }
  }

  get surname () {
    return this.j && this.j.surname
  }

  set position (newVal) {
    if (newVal) {
      this.j.position = newVal
    } else {
      delete this.j.position
    }
  }

  get position () {
    return this.j && this.j.position
  }

  set phones (newVal) {
    if (newVal) {
      this.j.phones = newVal
    } else {
      this.j.phones = []
    }
  }

  get phones () {
    return this.j && this.j.phones
  }

  set rating (newVal) {
    if (newVal) {
      this.j.rating = newVal
    } else {
      delete this.j.rating
    }
  }

  get rating () {
    return this.j && this.j.rating
  }

  set category (newVal) {
    if (newVal) {
      this.j.category = newVal
    } else {
      delete this.j.category
    }
  }

  get category () {
    return this.j && this.j.category
  }

  set services (newVal) {
    if (newVal) {
      this.j.services = newVal
    } else {
      delete this.j.services
    }
  }

  get services () {
    return this.j && this.j.services
  }

  set schedule (newVal) {
    this.j.schedule = newVal
  }

  get schedule () {
    return this.j.schedule
  }

  // API methods

  load (id) {
    if (!id || id === 'new') { return Promise.resolve() }
    return Api()
      .get(`employee?id=eq.${id}`)
      .then(res => res.data[0])
      .then((res) => {
        this.jsonObject = res
        return res
      })
  }

  save () {
    if (!this.id) {
      delete this.id
      return Api()
        .post(`employee?`, this.jsonObject)
        .then(res => responseGetId(res))
    } else {
      return Api()
        .patch(`employee?id=eq.${this.id}`, this.jsonObject)
        .then(() => {
          return this.jsonObject
        })
    }
  }
}

export default Employee
