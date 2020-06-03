import jstz from 'jstz'
import moment from 'moment-timezone'

function formatDate(date) {
  const format = 'dddd, MMMM Do @ h:mm a'
  const timezone = jstz.determine()
  return moment(date).tz(timezone.name()).format(format)
}

export default formatDate
