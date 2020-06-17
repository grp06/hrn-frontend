import { useSetupUserPreEvent } from '.'
import { useAppContext } from '../context/useAppContext'
import { setupHostPreEvent } from '../helpers'

const usePreEventTwilio = () => {
  const { user } = useAppContext()
  const { role } = user
  const { setupUserPreEvent } = useSetupUserPreEvent()

  const startPreEventTwilio = (room) => {
    if (room) {
      const { localParticipant } = room
      console.log('startPreEventTwilio -> localParticipant', localParticipant)

      if (role === 'host') {
        setupHostPreEvent(room)
      } else {
        setupUserPreEvent(room)
      }

      window.addEventListener('beforeunload', () => {
        room.disconnect()
      })
    }
  }

  return { startPreEventTwilio }
}

export default usePreEventTwilio
