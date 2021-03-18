const getEventDataCSV = (events) => {
  const initialData = {
    headers: [
      { label: 'event_name', key: 'event_name' },
      { label: 'event_date', key: 'event_date' },
      { label: 'host_email', key: 'host_email' },
      { label: 'host_id', key: 'host_id' },
      { label: 'host_name', key: 'host_name' },
      { label: 'matching_type', key: 'matching_type' },
      { label: 'side_a', key: 'side_a' },
      { label: 'side_b', key: 'side_b' },
      { label: 'num_rounds', key: 'num_rounds' },
      { label: 'round_length', key: 'round_length' },
      { label: 'num_attendees', key: 'num_attendees' },
      { label: 'num_rsvps', key: 'num_rsvps' },
    ],
    data: [],
  }

  const csvData = events.reduce((all, item) => {
    const arrOfAttendeesIds = []
    item.partners.forEach((pairing) => {
      if (!arrOfAttendeesIds.includes(pairing.user_id)) {
        arrOfAttendeesIds.push(pairing.user_id)
      }
    })
    all.data.push({
      event_name: item.event_name,
      event_date: item.start_at,
      host_email: item.host.email,
      host_id: item.host.id,
      host_name: item.host.name,
      matching_type: item.matching_type,
      side_a: item.side_a,
      side_b: item.side_b,
      num_rounds: item.num_rounds,
      round_length: item.round_length,
      num_attendees: arrOfAttendeesIds.length,
      num_rsvps: item.event_users.length,
    })
    return all
  }, initialData)
  return csvData
}

export default getEventDataCSV
