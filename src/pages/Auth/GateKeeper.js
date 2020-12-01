import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useUserContext } from '../../context'

const GateKeeper = () => {
  const history = useHistory()
  const { user } = useUserContext()
  console.log('user ->', user)

  useEffect(() => {
    if (Object.keys(user).length > 2) {
      history.push('/events')
      window.location.reload()
    }
  }, [user])

  return <div>Hello</div>
}

export default GateKeeper
