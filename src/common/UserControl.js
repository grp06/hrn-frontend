import React from 'react'

import { Redirect } from 'react-router-dom'

import { MainVideo } from '../components'
import { useGameContext } from '../context/useGameContext'
import { useRoundsData, useGetCurrentRound, useGetToken, useGetPartnerX } from '../hooks'

const UserControl = () => {
  const { currentRound, userId } = useGameContext()

  useRoundsData()
  useGetCurrentRound()
  useGetPartnerX()
  useGetToken()

  if (!userId) {
    return <Redirect to="/" push />
  }

  if (currentRound === 0) {
    return <div>waiting for event to start</div>
  }

  return <div>video component</div>
}

export default UserControl
