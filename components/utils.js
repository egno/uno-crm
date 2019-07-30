export function hash (s) {
  if (!s) {
    return 0
  }
  return s.split('').reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
}

export function hashColor (value, sat = 100, light = 50) {
  let h = hash(value) % 360
  return `hsl(${h}, ${sat}%, ${light}%)`
}

export function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function numberText (n, textArray) {

  function format (n, template) {
    if (template.indexOf('%') > -1) {
      return template.replace('%', ''+n)
    }
    return `${n} ${template}`
  }

  if (!n) {
    return (textArray[3] !== undefined) ? textArray[3] : format(n, textArray[2])
  }
  if (n % 10 == 1 && (~~(n / 10)) % 10 != 1) {
    return format(n, textArray[0])
  }
  if (n % 10 < 5 && (~~(n / 10)) % 10 != 1) {
    return format(n, textArray[1])
  }
  return format(n, textArray[2])
}

export function conjugateEmployee (n) {
  const forms = ["мастер", "мастера", "мастеров", "Нет мастеров"]
  return numberText(n, forms)
}

export function conjugateFilial (n) {
  const forms = ["филиал", "филиала", "филиалов", "Нет филиалов"]
  return numberText(n, forms)
}

export function conjugateServices (n) {
  const forms = ["услуга", "услуги", "услуг", "Нет услуг"]
  return numberText(n, forms)
}

export function conjugateVisits (n) {
  const forms = ["визит", "визита", "визитов", "Нет визитов"]
  return numberText(n, forms)
}

export function widgetHost () {
  let host = window.location.host
  // set host address for debug
  if (host.substr(-5) === ':8080') {
    host = 'kudri.ml'
  }
  return `https://widget.${host}`
}