import { useEffect } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import { bulkInsertRounds } from '../gql/mutations'
import samyakAlgoPro from '../utils/samyakAlgoPro'
import { findUsers } from '../gql/queries'
import { useStartRound } from '.'
import endpointUrl from '../utils/endpointUrl'

const useStartEvent = () => {
  const {
    userId,
    roundsData,
    currentRound,
    users,
    eventId,
    appLoading,
    setUsers,
  } = useGameContext()

  const [bulkInsertRoundsMutation] = useMutation(bulkInsertRounds)
  const { startRound } = useStartRound()
  const timeoutDuration = currentRound === 0 ? 0 : 1

  const { loading, error, data: findUsersData } = useQuery(findUsers, {
    skip: appLoading,
  })

  useEffect(() => {
    if (findUsersData && findUsersData.users && !users) {
      setUsers(findUsersData.users)
    }
  }, [findUsersData, users])

  const createRoundsMap = (roundData, users) => {
    if (!roundsData || roundData.rounds.length === 0) {
      return {}
    }

    const generateUserMap = (user_id) => {
      const userRounds = roundData.rounds.filter(
        (pairing) => pairing.partnerX_id === user_id || pairing.partnerY_id === user_id
      )
      // This is to get an array of only your partners id for each round as the array element
      return userRounds.map((roundObject) => {
        if (roundObject.partnerX_id === user_id) {
          return roundObject.partnerY_id
        }
        return roundObject.partnerX_id
      })
    }

    const roundsMapObject = users.reduce((all, user) => {
      const map = generateUserMap(user)
      all[user] = map
      return all
    }, {})

    return roundsMapObject
  }

  const startEvent = async () => {
    await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
    setTimeout(async () => {
      const variablesArr = []

      const userIds = users.reduce((all, item) => {
        all.push(item.id)
        return all
      }, [])
      const roundsMap = createRoundsMap(roundsData, userIds)
      const { pairingsArray } = samyakAlgoPro(userIds, roundsMap)

      pairingsArray.forEach((pairing) => {
        variablesArr.push({
          partnerX_id: pairing[0],
          partnerY_id: pairing[1],
          round_number: currentRound + 1,
          event_id: eventId,
        })
      })

      const insertedRounds = await bulkInsertRoundsMutation({
        variables: {
          objects: variablesArr,
        },
      })

      startRound(insertedRounds.data.insert_rounds.returning)
    }, timeoutDuration)
  }

  return { startEvent }
}

export default useStartEvent
