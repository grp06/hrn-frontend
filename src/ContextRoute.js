import React from 'react'
import { Route } from 'react-router-dom'

const ContextRoute = ({ contextComponent, component, ...rest }) => {
  const { Provider } = contextComponent
  const Component = component

  return (
    <Route {...rest}>
      <Provider>
        <Component />
      </Provider>
    </Route>
  )
}

export default ContextRoute
