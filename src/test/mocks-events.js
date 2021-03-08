const mockWayFutureEvent = {
  id: 1,
  start_at: '2021-10-20T22:04:04.146+00:00',
  ended_at: null,
  description: 'my event desc',
  event_name: 'Test Event',
  host_id: 1,
  current_round: null,
  status: 'not-started',
  round_length: 1,
  num_rounds: 1,
  public_event: true,
  group_video_chat: true,
  banner_photo_url: false,
  host: {
    name: 'Max',
    id: 1,
    profile_pic_url: null,
  },
  event_users: [
    {
      user: {
        id: 1,
        name: 'Max',
        updated_at: '2020-11-08T14:48:27.081552+00:00',
      },
    },
    {
      user: {
        id: 2,
        name: 'Test User 1',
        updated_at: '2020-11-08T14:48:05.764404+00:00',
      },
    },
    {
      user: {
        id: 3,
        name: 'Test User 2',
        updated_at: '2020-11-05T22:27:33.241977+00:00',
      },
    },
  ],
}

export { mockWayFutureEvent }
