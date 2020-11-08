import React from 'react'
import { render, screen } from 'test/test-utils'
import { setupServer } from 'msw/node'
import { handlers } from 'test/server-handlers'
import { build, fake } from '@jackfranklin/test-data-bot'
import { LoginForm } from '../pages/Auth'

const buildLoginForm = build({
  fields: {
    email: fake((faker) => faker.internet.email()),
    password: fake((faker) => faker.internet.password()),
  },
})

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterAll(() => server.close())

const buildLoginForm = build({
  fields: {
    email: fake((faker) => faker.internet.userName()),
    password: fake((faker) => faker.internet.password()),
  },
})

test('it should render a login button', () => {
  render(<LoginForm />)
  expect(screen.getByLabelText(/email */i)).toBeTruthy()
  expect(screen.getByLabelText(/password */i)).toBeTruthy()
  expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy()
})

// test('it should render a login button', () => {
//   const handleFormSubmit = jest.fn()
//   render(<LoginForm />)
//   const emailInput = screen.getByLabelText(/email */i)
//   const passwordInput = screen.getByLabelText(/password */i)
//   expect(emailInput).toBeTruthy()
//   expect(passwordInput).toBeTruthy()
//   expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy()
// })
