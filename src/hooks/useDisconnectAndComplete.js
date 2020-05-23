import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import { bulkInsertRounds } from '../gql/mutations'
import roundRobin from '../utils/roundRobin'
import { findUsers } from '../gql/queries'
import { useStartRound } from '.'

// call API which will disconnect all users from their rooms
// it should also complete the rooms afterwards
// then we want to create new rooms
// then increment
export default function useDisconnectAndComplete() {
  const disconnectAndComplete = async () => {}

  return { disconnectAndComplete }
}
