import { useGameContext } from '../context/useGameContext'

const useGetPartnerX = () => {
  const userId = localStorage.getItem('userId')
  const { currentRound, roundsData, setPartnerX } = useGameContext()

  if (roundsData && currentRound) {
    const myRound = roundsData.find((round) => {
      const me =
        round.round_number === currentRound &&
        (round.partner_x === parseInt(userId, 10) || round.partner_y === parseInt(userId, 10))

      return me
    })

    setPartnerX(myRound.partner_x)
  }
  return null
}

export default useGetPartnerX
