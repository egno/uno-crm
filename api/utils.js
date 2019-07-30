function alert (message, info) {
  let a = {
    message: message
  }
  if (info) {
    a.info = info
  }
  return a
}

export function makeAlert (err) {
  console.log(err)
  if (!err) {
    return alert('Ой! Что-то пошло не так...')
  }
  if (typeof err === 'string') {
    return alert(err)
  }
  if (!err.response) {
    return alert('Ошибка в запросе к серверу', err.message || err)
  }
  if (err.response.status === 401) {
    return
  }
  if (err.response.status === 403) {
    if (err.response.data && err.response.data.code==="42501") {
      return alert('Недостаточно прав для выполнения операции', err.response)
    }
    return alert('Неправильный логин или пароль', err.response)
  }
  if (err.response.status === 400) {
    if (err.response.data.code === '2F002') {
      return alert('Недостаточно прав для изменения этой записи', err.response)
    }
    if (err.response.data.code === '23P01') {
      return alert('Невозможно сохранить. Это время занято', err.response)
    }
    return alert(err.response.data.message, err.response)
  }
  return alert(err.message, err.response)
}

export function responseGetId (res) {
  if (!(res && res.headers && res.headers.location)) return
  return res.headers.location.split('.')[1]
}
