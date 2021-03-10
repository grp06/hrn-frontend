import React from 'react'
import { cleanup, render, screen, waitFor } from 'test/test-utils'
import { getEventsByUserId } from '../gql/queries'
import { MyEvents } from '../pages/Events'

afterEach(cleanup)
const getEventsByUserIdMock = [
  {
    request: {
      query: getEventsByUserId,
      variables: {
        userId: 1,
      },
    },
    result: {
      data: {
        event_users: [
          {
            event: {
              start_at: '2021-10-22T20:31:12.937+00:00',
              ended_at: false,
              id: 4,
              description: 'Test Desc',
              event_name: 'Not Started Event',
              host_id: 1,
              current_round: 0,
              updated_at: '2020-10-22T22:40:25.700082+00:00',
              round_length: 2,
              num_rounds: 3,
              public_event: false,
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
          },
          {
            event: {
              start_at: '2020-10-24T22:40:48.435+00:00',
              ended_at: '2020-11-05T20:52:08.168+00:00',
              id: 10,
              description: 'Test Desc',
              event_name: 'Completed Event',
              host_id: 1,
              current_round: null,
              updated_at: '2020-11-05T20:52:08.49309+00:00',
              round_length: 1,
              num_rounds: 1,
              public_event: false,
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
          },
        ],
      },
    },
  },
]

it('should render 2 event cards from the mocked Query', async () => {
  render(<MyEvents />, { apolloMocks: getEventsByUserIdMock })
  screen.debug()
  const completedEventCard = await waitFor(() =>
    screen.getByRole('heading', { name: /completed event/i })
  )
  // screen.debug()
})
