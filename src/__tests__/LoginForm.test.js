import React from 'react'
import { act, cleanup, render, screen, waitFor } from 'test/test-utils'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { handlers } from 'test/server-handlers'
import { build, fake } from '@jackfranklin/test-data-bot'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../pages/Auth'

const buildLoginForm = build({
  fields: {
    email: fake((faker) => faker.internet.email()),
    password: fake((faker) => faker.internet.password()),
    name: fake((faker) => faker.internet.userName()),
  },
})

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  })
})

test('it should render a login button', () => {
  render(<LoginForm />)
  expect(screen.getByLabelText(/email */i)).toBeTruthy()
  expect(screen.getByLabelText(/password */i)).toBeTruthy()
  expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy()
})

test('it should display error snack when user not in db', async () => {
  const testErrorMessage = 'Incorrect email or password'
  server.use(
    rest.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json({ message: testErrorMessage }))
    })
  )
  const { email, password, name } = buildLoginForm()
  render(<LoginForm />)
  userEvent.type(screen.getByLabelText(/email/i), name)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', { name: /log in/i }))
  const loginErrorSnack = await waitFor(() => screen.findByRole('alert'))
  expect(loginErrorSnack.textContent).toBe('Incorrect password or email')
})

test('it should display welcome home snack when successfully logged in', async () => {
  const { email, password } = buildLoginForm()
  render(<LoginForm />)
  userEvent.type(screen.getByLabelText(/email/i), email)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', { name: /log in/i }))
  const loginSuccessSnack = await waitFor(() => screen.findByRole('alert'))
  expect(loginSuccessSnack.textContent).toBe('Welcome Home 🏡')
})

test('it should save id and token in LocalStorage when successfully logged in', async () => {
  const { email, password } = buildLoginForm()
  render(<LoginForm />)
  userEvent.type(screen.getByLabelText(/email/i), email)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', { name: /log in/i }))
  const loginSuccessSnack = await waitFor(() => screen.findByRole('alert'))
  expect(loginSuccessSnack.textContent).toBe('Welcome Home 🏡')
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(2)
  expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'eyJhbGci')
  expect(window.localStorage.setItem).toHaveBeenCalledWith('userId', 74)
})
