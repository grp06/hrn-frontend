import { getAllPublicEvents } from '../../../gql/queries'

export const getAllPublicEventsMock = [
  {
    request: {
      query: getAllPublicEvents,
    },
    result: {
      data: {
        events: [
          {
            start_at: '2021-10-22T20:31:12.937+00:00',
            ended_at: false,
            id: 4,
            status: 'not-started',
            description: 'Hi Right Now Test Desc',
            event_name: 'Hi Right Now Not Started Event',
            host_id: 1,
            current_round: null,
            updated_at: '2020-10-22T22:40:25.700082+00:00',
            round_length: 2,
            num_rounds: 3,
            post_event_link: '',
            public_event: true,
            group_video_chat: false,
            banner_photo_url: null,
            event_users: [
              {
                user: {
                  id: 1,
                  name: 'Host',
                },
              },
              {
                user: {
                  id: 2,
                  name: 'user1',
                },
              },
            ],
            host: {
              name: 'Host',
              profile_pic_url:
                'https://hi-right-now-profile-photos.s3.amazonaws.com/bucketFolder/1-2020-11-07T00-41-51.180Z.jpg',
            },
          },
          {
            start_at: '2020-10-24T22:40:48.435+00:00',
            ended_at: '2020-11-05T20:52:08.168+00:00',
            id: 10,
            status: 'complete',
            description: 'Test Desc',
            event_name: 'Completed Event',
            host_id: 1,
            current_round: null,
            updated_at: '2020-11-05T20:52:08.49309+00:00',
            round_length: 1,
            num_rounds: 1,
            post_event_link: null,
            public_event: true,
            group_video_chat: true,
            banner_photo_url:
              'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3NzAzMH0',
            event_users: [
              {
                user: {
                  id: 1,
                  name: 'Host',
                },
              },
              {
                user: {
                  id: 2,
                  name: 'user1',
                },
              },
              {
                user: {
                  id: 3,
                  name: 'user2',
                },
              },
            ],
            host: {
              name: 'Host',
              profile_pic_url:
                'https://hi-right-now-profile-photos.s3.amazonaws.com/bucketFolder/1-2020-11-07T00-41-51.180Z.jpg',
            },
          },
          {
            start_at: '2021-10-24T22:40:48.435+00:00',
            ended_at: null,
            id: 11,
            status: 'not-started',
            description: 'Test Desc',
            event_name: 'Some Random Event ',
            host_id: 1,
            current_round: null,
            updated_at: '2020-11-05T20:52:08.49309+00:00',
            round_length: 1,
            num_rounds: 1,
            post_event_link: null,
            public_event: true,
            group_video_chat: true,
            banner_photo_url:
              'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3NzAzMH0',
            event_users: [],
            host: {
              name: 'Host',
              profile_pic_url:
                'https://hi-right-now-profile-photos.s3.amazonaws.com/bucketFolder/1-2020-11-07T00-41-51.180Z.jpg',
            },
          },
        ],
      },
    },
  },
]
