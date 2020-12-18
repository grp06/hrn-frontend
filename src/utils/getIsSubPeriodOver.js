import moment from 'moment'

const getIsSubPeriodOver = (subPeriodEnd) => {
  const now = new Date()
  const subPeriodEndDate = new Date(subPeriodEnd)
  const isSubPeriodOver = now > subPeriodEndDate
  const subPeriodEnds = moment(subPeriodEndDate.getTime()).fromNow()
  return { isSubPeriodOver, subPeriodEnds }
}

export default getIsSubPeriodOver
