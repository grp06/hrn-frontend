import React from 'react'
import { render } from '@testing-library/react'
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter as Router } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import {
  EventProvider,
  AppProvider,
  UserProvider,
  TwilioProvider,
  UserEventStatusProvider,
} from '../context'
import theme from '../ui/theme'

const renderWithAllProviders = (ui, options) => {
  const { apolloMocks } = options || []
  const AllTheProviders = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <MockedProvider mocks={apolloMocks} addTypename={false}>
            <Router>
              <AppProvider>
                <UserProvider>
                  <EventProvider>
                    <TwilioProvider>
                      <UserEventStatusProvider>{children}</UserEventStatusProvider>
                    </TwilioProvider>
                  </EventProvider>
                </UserProvider>
              </AppProvider>
            </Router>
          </MockedProvider>
        </StylesProvider>
      </ThemeProvider>
    )
  }
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
export { renderWithAllProviders as render }
