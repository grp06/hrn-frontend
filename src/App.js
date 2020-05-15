import React, { useState, useEffect } from 'react'

import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import makeApolloClient from './apollo'
import { LoginForm } from './common'
import { Test, MyEvents } from './components'
import { GameStateContextProvider } from './contexts/GameStateContext'
import Footer from './ui/Footer'
import Header from './ui/Header'
import theme from './ui/theme'

const App = () => {
  const [client, setClient] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  async function createClient() {
    try {
      const apolloClient = await makeApolloClient()
      setClient(apolloClient)
    } catch {
      setClient(null)
    }
  }

  useEffect(() => {
    createClient()
  }, [])

  if (!client) {
    return null
  }
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <ApolloProvider client={client}>
          <Router>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <Switch>
              <Route exact path="/" component={LoginForm} />
              <GameStateContextProvider>
                <Route exact path="/myevents" component={MyEvents} />
              </GameStateContextProvider>
              <Route exact path="/about" component={() => <div>About Us</div>} />
              <Route exact path="/contact" component={() => <div>Contact Us</div>} />
              <Route exact path="/test" component={Test} />
            </Switch>
          </Router>
        </ApolloProvider>
      </StylesProvider>
    </ThemeProvider>
  )
}

export default App
//            <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
