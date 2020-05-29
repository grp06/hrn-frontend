import moment from 'moment-timezone'
import jstz from 'jstz'

function formatDate(date) {
  const format = 'dddd, MMMM Do @ h:mm a'
  const timezone = jstz.determine()
  return moment(date).tz(timezone.name()).format(format)
}

export default formatDate
