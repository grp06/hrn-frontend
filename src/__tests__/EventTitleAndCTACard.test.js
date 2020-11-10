import React from 'react'
import { render, screen, waitFor } from 'test/test-utils'
import { EventTitleAndCTACard } from '../pages/Event'
import { mockHost, mockUser1, mockUserNotInEvent } from '../test/mocks-users'
import { mockWayFutureEvent } from '../test/mocks-events'
import userEvent from '@testing-library/user-event'

it('should render without error', () => {
  render(<EventTitleAndCTACard user={mockHost} event={mockWayFutureEvent} />)
})

it('renders with edit event button if user is the event host', () => {
  render(<EventTitleAndCTACard user={mockHost} event={mockWayFutureEvent} />)
  expect(screen.getByRole('button', { name: /edit event/i })).toBeTruthy()
})

it('renders with all set button if user is RSVPed', () => {
  render(<EventTitleAndCTACard user={mockUser1} event={mockWayFutureEvent} />)
  expect(screen.getByRole('button', { name: /all set/i })).toBeTruthy()
})

it('renders with rsvp button if user is not RSVPed', () => {
  render(<EventTitleAndCTACard user={mockUserNotInEvent} event={mockWayFutureEvent} />)
  expect(screen.getByRole('button', { name: /rsvp/i })).toBeTruthy()
})

it('changes to all set button after you click RSVP', async () => {
  render(<EventTitleAndCTACard user={mockUserNotInEvent} event={mockWayFutureEvent} />)
  await waitFor(() => userEvent.click(screen.getByRole('button', { name: /rsvp/i })))
  screen.debug()
})
