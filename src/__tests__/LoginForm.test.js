import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { LoginForm } from '../common'

test('it should render a login button', () => {
  const { getByText } = render(<LoginForm />)

  const loginButton = getByText('Log In')
  console.log(loginButton)
})
