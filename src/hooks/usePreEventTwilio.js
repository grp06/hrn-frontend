import { useSetupUserPreEvent } from '.'
import { setupHostPreEvent } from '../helpers'
import { useAppContext } from '../context/useAppContext'

const usePreEventTwilio = () => {
  const { setupUserPreEvent } = useSetupUserPreEvent()
  const { setCameraAndMicPermissions } = useAppContext()

  const startPreEventTwilio = (room, isEventHost) => {
    if (room) {
      console.log('startPreEventTwilio -> room', room)
      if (isEventHost) {
        setupHostPreEvent(room, setCameraAndMicPermissions)
      } else {
        setupUserPreEvent(room)
      }

      window.addEventListener('beforeunload', () => {
        room.disconnect()
      })
      room.on('disconnected', function (rum) {
        console.log('disconnected')
      })
    }
  }

  return { startPreEventTwilio }
}

export default usePreEventTwilio
