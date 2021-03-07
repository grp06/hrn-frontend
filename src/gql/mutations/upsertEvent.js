import gql from 'graphql-tag'

const upsertEvent = gql`
  mutation upsertEvent($event_details: [events_insert_input!]!) {
    insert_events(
      on_conflict: {
        constraint: events_pkey
        update_columns: [
          banner_photo_url
          description
          event_name
          num_rounds
          public_event
          round_length
          start_at
        ]
      }
      objects: $event_details
    ) {
      returning {
        host_id
        id
        num_rounds
        public_event
        round_length
      }
    }
  }
`
export default upsertEvent
