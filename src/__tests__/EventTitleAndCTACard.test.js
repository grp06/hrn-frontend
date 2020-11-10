import React from 'react'
import { act, render, screen, waitFor } from 'test/test-utils'
import { EventTitleAndCTACard } from '../pages/Event'
import { mockHost, mockUser1, mockUserNotInEvent } from '../test/mocks-users'
import { mockWayFutureEvent } from '../test/mocks-events'
import { insertEventUser } from '../gql/mutations'
import userEvent from '@testing-library/user-event'

it('should render without error', () => {
  render(<EventTitleAndCTACard user={mockHost} event={mockWayFutureEvent} />)
})

it('renders with edit event button if user is the event host', () => {
  render(<EventTitleAndCTACard user={mockHost} event={mockWayFutureEvent} />)
  expect(screen.getByRole('button', { name: /edit event/i }))
})

it('renders with all set button if user is RSVPed', () => {
  render(<EventTitleAndCTACard user={mockUser1} event={mockWayFutureEvent} />)
  expect(screen.getByRole('button', { name: /all set/i }))
})

it('renders with rsvp button if user is not RSVPed', () => {
  render(<EventTitleAndCTACard user={mockUserNotInEvent} event={mockWayFutureEvent} />)
  expect(screen.getByRole('button', { name: /rsvp/i }))
})

it('calls RSVP mutation when user RSVPS', async () => {
  let insertEventUserMutationCalled = false
  const insertEventUserMock = [
    {
      request: {
        query: insertEventUser,
        variables: {
          event_id: 1,
          user_id: 4,
        },
      },
      result: () => {
        insertEventUserMutationCalled = true
        return {
          data: {
            insert_event_users: {
              returning: [
                {
                  user_id: 4,
                  event_id: 1,
                  id: 94,
                },
              ],
            },
          },
        }
      },
    },
  ]

  render(<EventTitleAndCTACard user={mockUserNotInEvent} event={mockWayFutureEvent} />, {
    apolloMocks: insertEventUserMock,
  })
  userEvent.click(screen.getByRole('button', { name: /rsvp/i }))
  await new Promise((resolve) => setTimeout(resolve, 1000)) // wait for response
  expect(insertEventUserMutationCalled).toBe(true)
})
