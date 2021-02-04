import React from 'react'
import { useLocation } from 'react-router-dom'
import { LoginNewForm } from '.'

const LoginNew = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const chitChatId = searchParams.get('chitChatId')

  return <LoginNewForm chitChatIdFromSearchParams={chitChatId} />
}

export default LoginNew
