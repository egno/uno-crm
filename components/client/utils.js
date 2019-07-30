function newClientName () {
  return { forename: undefined, surname: undefined }
}

export function newClient () {
  return {
    id: undefined,
    business_id: undefined,
    user_id: undefined,
    name: newClientName(),
    phone: undefined,
    email: undefined,
    birth_date: undefined,
    discount: undefined,
    sex: undefined,
    notes: undefined
  }
}

export function clientPrefill (client) {
  if (!client) {
    client = newClient()
  }
  if (!client.name) {
    client.name = newClientName()
  }
  return client
}

export function clientToAPI (client) {
  const { id, business_id, user_id, ...c } = clientPrefill(client)
  return {
    id,
    business_id,
    user_id,
    j: c
  }
}

export function clientFromAPI (data) {
  let o = clientPrefill(data.j)
  return {
    id: data.id,
    business_id: data.business_id,
    user_id: data.user_id,
    ...o
  }
}
