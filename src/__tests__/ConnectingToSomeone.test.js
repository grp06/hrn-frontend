import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ConnectingToSomeone } from '../common/waitingRoomScreens'

test('return connecting to someone text on the screen', () => {
  const { getByText } = render(<ConnectingToSomeone />)
  const connectingToSomeoneDiv = getByText('Connecting you to someone awesome!')
  expect(connectingToSomeoneDiv).toBeTruthy()
})
