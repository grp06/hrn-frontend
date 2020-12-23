import React from 'react'
import { render, screen } from 'test/test-utils'
import { ConnectingToSomeone } from '../pages/VideoRoom/waitingRoomScreens'

const mockMyRound = {
  id: 1,
  event_id: 1,
  created_at: '2020-10-28T00:00:00.000+00:00',
  partner: {
    city: 'New York',
    name: 'Gary',
  },
  user_id: 1,
  round: 1,
  partner_id: 2,
}

test('return connecting to someone text on the screen if partner is connecting', () => {
  render(<ConnectingToSomeone partnerNeverConnected={false} myRound={mockMyRound} />)
  expect(screen.getByText('Connecting you to someone awesome!'))
})

test('return button to go back to lobby if partner has not connected', () => {
  render(<ConnectingToSomeone partnerNeverConnected myRound={mockMyRound} />)
  expect(screen.getByRole('button', { name: /lobby/i }))
})
