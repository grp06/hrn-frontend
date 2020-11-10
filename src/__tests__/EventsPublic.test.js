import React from 'react'
import { screen, render, waitFor } from 'test/test-utils'
import userEvent from '@testing-library/user-event'
import { EventsPublic } from '../pages/EventsPublic'
import { getAllPublicEventsMock } from '../test/mocks'

it('shows only one event for HRN Events based off Mock Data', async () => {
  render(<EventsPublic />, { apolloMocks: getAllPublicEventsMock })
  const HRNEventCard = await waitFor(() => screen.getByText(/hi right now not started event/i))
  expect(HRNEventCard).toBeTruthy()
})

it('shows only one event for All Events based off Mock Data', async () => {
  render(<EventsPublic />, { apolloMocks: getAllPublicEventsMock })
  await waitFor(() => screen.getByText(/hi right now not started event/i))
  userEvent.click(screen.getByRole('button', { name: /all events/i }))
  expect(screen.getByText(/some random event/i)).toBeTruthy()
})

it('does not show the completed event', async () => {
  render(<EventsPublic />, { apolloMocks: getAllPublicEventsMock })
  await waitFor(() => screen.getByText(/hi right now not started event/i))
  userEvent.click(screen.getByRole('button', { name: /all events/i }))
  expect(screen.queryByText(/completed event/i)).toBeNull()
})
