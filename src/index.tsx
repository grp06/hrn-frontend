import React from 'react'

import ReactDOM from 'react-dom'
import { IntercomProvider } from 'react-use-intercom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { constants } from './utils'

import App from './App'
import * as serviceWorker from './serviceWorker'

if (process.env.NODE_ENV === 'test') {
  const { server } = require('./mocks/server')
  server.start()
}

const { intercomAppId } = constants
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!)

ReactDOM.render(
  <IntercomProvider appId={intercomAppId}>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </IntercomProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
