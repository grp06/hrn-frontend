import jstz from 'jstz'
import moment from 'moment-timezone'

function formatChatMessagesData(date) {
  const format = 'h:mm a'
  const timezone = jstz.determine()
  const usersTimezone = timezone.name()
  return moment.tz(date, usersTimezone).format(format)
}

export default formatChatMessagesData
