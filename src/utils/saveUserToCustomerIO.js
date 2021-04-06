import { getEpochSecondsFromDate } from '.'

const saveUserToCustomerIO = (user) => {
  const { _cio } = window

  const {
    became_host_at,
    city,
    created_at,
    email,
    id,
    name,
    role,
    event_users,
    sub_period_end,
  } = user

  const num_events_hosted = role.includes('host')
    ? event_users.reduce((total, eventUserObject) => {
        if (eventUserObject.event.host_id === eventUserObject.user_id) total++
        return total
      }, 0)
    : null

  _cio.identify({
    id,
    email,
    first_name: name.split(' ')[0],
    last_name: name.split(' ')[1],
    city,
    role,
    created_at: getEpochSecondsFromDate(created_at),
    became_host_at: became_host_at ? getEpochSecondsFromDate(became_host_at) : null,
    sub_period_end: sub_period_end ? getEpochSecondsFromDate(sub_period_end) : null,
    num_events_hosted,
    num_events_rsvped: event_users?.length,
  })
}

export default saveUserToCustomerIO
