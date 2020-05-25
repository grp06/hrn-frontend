/* eslint-disable no-restricted-syntax */
const grabExistingData = (userIds, prevAssignments) => {
  // const map = JSON.parse(allAssignments)
  const map = prevAssignments
  userIds.forEach((id) => {
    if (!map[id]) {
      map[id] = []
    }
  })
  return map
}

const initialUserIdsMap = (userIds) => {
  return userIds.reduce((all, item, index) => {
    all[item] = []
    return all
  }, {})
}

function SamyakAlgo(userIds, prevAssignments) {
  const numRounds = userIds.length - 1
  const firstRun = !prevAssignments ? true : false

  const userIdsMap = firstRun
    ? initialUserIdsMap(userIds)
    : grabExistingData(userIds, prevAssignments)

  const copyOfUserIds = userIds.slice()

  let arrLength = 0
  const userIdsMapValues = Object.values(userIdsMap)
  for (const value of userIdsMapValues) {
    if (arrLength < value.length) {
      arrLength = value.length
    }
    value.push('User Offine')
  }

  for (const value of userIdsMapValues) {
    const tempLength = value.length
    for (let i = 0; i < arrLength - tempLength + 1; i++) {
      value.unshift('Not included')
    }
  }
  const pairingsArray = []

  while (copyOfUserIds.length > 0) {
    const player1 = copyOfUserIds[0]
    const playerMatch1 = userIdsMap[player1]
    let index = 1
    while (playerMatch1.includes(copyOfUserIds[index])) {
      index++
      if (index > copyOfUserIds.length - 1) {
        break
      }
    }
    if (index > copyOfUserIds.length - 1) {
      playerMatch1.pop()
      playerMatch1.push('NULL')
    } else {
      const player2 = copyOfUserIds[index]
      const playerMatch2 = userIdsMap[player2]
      playerMatch1.pop()
      playerMatch1.push(player2)
      playerMatch2.pop()
      playerMatch2.push(player1)
      userIdsMap[player2] = playerMatch2
      copyOfUserIds.splice(index, 1)
      pairingsArray.push([playerMatch1[0], playerMatch2[0]])
    }
    userIdsMap[player1] = playerMatch1
    copyOfUserIds.splice(0, 1)
  }

  return { pairingsArray, userIdsMap }
}

export default SamyakAlgo
