const getEpochSecondsFromDate = (date) => {
  return Math.round(new Date(date).getTime() / 1000)
}

export default getEpochSecondsFromDate
