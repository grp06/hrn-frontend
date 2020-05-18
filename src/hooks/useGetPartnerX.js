import { useGameContext } from '../context/useGameContext'

const useGetPartnerX = () => {
  const userId = localStorage.getItem('userId')
  const { currentRound, roundsData, setPartnerX } = useGameContext()

  if (roundsData && currentRound) {
    const myRound = roundsData.find((round) => {
      const me =
        round.round_number === currentRound &&
        (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))

      return me
    })

    setPartnerX(myRound.partnerX_id)
  }
  return null
}

export default useGetPartnerX
