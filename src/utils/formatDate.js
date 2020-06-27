import jstz from 'jstz'
import moment from 'moment-timezone'

function formatDate(date) {
  const format = 'dddd, MMMM Do @ h:mm a'
  console.log('date ->', date)
  const timezone = jstz.determine()
  const usersTimezone = timezone.name()
  const usersTimezoneAbbr = moment().tz(usersTimezone).zoneAbbr()
  return moment.tz(date, usersTimezone).format(format).concat(' ', usersTimezoneAbbr)
}

export default formatDate
